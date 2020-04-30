const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const { ObjectId } = require('mongodb');

module.exports = {
    /**
     * Adds a user to the database
     * @param {string} email 
     * @param {string} hashedPassword 
     * @param {string} firstName 
     * @param {string} lastName 
     * @param {string} city 
     * @param {string} state 
     * @param {string} country
     * @returns the new user
     */
    async addUser(email, hashedPassword, firstName, lastName, city, state, country) {
        if (!email) throw new Error("Must provide user's email");
        if (!hashedPassword) throw new Error("Must provide user's hashedPassword");
        if (!firstName) throw new Error("Must provide user's firstName");
        if (!lastName) throw new Error("Must provide user's lastName");
        if (!city) throw new Error("Must provide user's city");
        if (!state) throw new Error("Must provide user's state");
        if (!country) throw new Error("Must provide user's country");

        if (typeof email !== "string") throw new Error("email must be a string");
        if (typeof hashedPassword !== "string") throw new Error("hashedPassword must be a string");
        if (typeof firstName !== "string") throw new Error("firstName must be a string");
        if (typeof lastName !== "string") throw new Error("lastName must be a string");
        if (typeof city !== "string") throw new Error("city must be a string");
        if (typeof state !== "string") throw new Error("state must be a string");
        if (typeof country !== "string") throw new Error("country must be a string");

        const userCollection = await users();
        const newUser = {
            email: email,
            hashedPassword: hashedPassword,
            firstName: firstName,
            lastName: lastName,
            city: city,
            state: state,
            country: country,
            favoriteBeers: [],
            following: [],
            reviews: []
        };

        const insertInfo = await userCollection.insertOne(newUser);
        if (insertInfo.insertedCount === 0) throw new Error("Could not add user");
        const newId = insertInfo.insertedId;

        return await this.getUser(newId.toString());
    },

    /**
     * Gets a user by ID from the database
     * @param {string} id 
     * @returns the user
     */
    async getUser(id) {
        if (!id) throw new Error("Must provide the user's ID");
        if (typeof id !== "string") throw new Error("ID must be a string");
        const objId = ObjectId.createFromHexString(id);

        const userCollection = await users();
        const result = await userCollection.findOne({_id: objId});
        if (result === null) throw new Error("No user with that ID");

        return result;
    },


    //temporary
    async getUserByEmail(emailAddress) {
        if (!emailAddress) throw new Error("Must provide the user's ID");
        if (typeof emailAddress !== "string") throw new Error("ID must be a string");

        const userCollection = await users();
        const result = await userCollection.findOne({email: emailAddress});
        if (result === null) throw new Error("No user with that ID");

        return result;
    },

    /**
     * Gets all users from the database
     * @returns the users in an Array
     */
    async getAllUsers() {
        const userCollection = await users();
        return await userCollection.find({}).toArray();
    },

    /**
     * Removes a user by ID from the database
     * @param {string} id
     * @returns true if successful
     */
    async removeUser(id) {
        if (!id) throw new Error("Must provide the user's ID");
        if (typeof id !== "string") throw new Error("ID must be a string");
        const objId = ObjectId.createFromHexString(id);

        const userCollection = await users();
        const deletionInfo = await userCollection.removeOne({_id: objId});
        if (deletionInfo.deletedCount === 0) throw new Error(`Could not delete the user of ID ${id}`);

        return true;
    },

    /**
     * Updates user by id with the supplied data. Elements of data with names that
     * do not exist in the defined collection will be ignored.
     * @param {string} id 
     * @param {Object} data {email, hashedPassword, firstName, lastName,
     * city, state, country, favoriteBeers, following, reviews}
     * @returns the updated user
     */
    async updateUser(id, data) {
        if (!id) throw new Error("Must provide the user's ID");
        if (typeof id !== "string") throw new Error("ID must be a string");
        const objId = ObjectId.createFromHexString(id);

        let updatedUser = await this.getUser(id);

        if (data.email) {
            if (typeof data.email !== "string") throw new Error("updated email must be a string");
            updatedUser.email = data.email;
        }
        if (data.hashedPassword) {
            if (typeof data.hashedPassword !== "string") throw new Error("updated hashedPassword must be a string");
            updatedUser.hashedPassword = data.hashedPassword;
        }
        if (data.firstName) {
            if (typeof data.firstName !== "string") throw new Error("updated firstName must be a string");
            updatedUser.firstName = data.firstName;
        }
        if (data.lastName) {
            if (typeof data.lastName !== "string") throw new Error("updated lastName must be a string");
            updatedUser.lastName = data.lastName;
        }
        if (data.city) {
            if (typeof data.city !== "string") throw new Error("updated city must be a string");
            updatedUser.city = data.city;
        }
        if (data.state) {
            if (typeof data.state !== "string") throw new Error("updated state must be a string");
            updatedUser.state = data.state;
        }
        if (data.country) {
            if (typeof data.country !== "string") throw new Error("updated country must be a string");
            updatedUser.country = data.country;
        }
        if (data.favoriteBeers) {
            if (!Array.isArray(data.favoriteBeers)) throw new Error("updated favoriteBeers must be an array");
            updatedUser.favoriteBeers = data.favoriteBeers;
        }
        if (data.following) {
            if (!Array.isArray(data.following)) throw new Error("updated following must be an array");
            updatedUser.following = data.following;
        }
        if (data.reviews) {
            if (!Array.isArray(data.reviews)) throw new Error("updated reviews must be an array");
            updatedUser.reviews = data.reviews;
        }

        const userCollection = await users();
        const updatedInfo = await userCollection.updateOne({_id: objId}, {$set: updatedUser});
        if (updatedInfo.modifiedCount === 0) throw new Error("Could not update user successfully");

        return await this.getUser(id);
    }
};