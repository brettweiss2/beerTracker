
const mongoCollections = require("../config/mongoCollections");
const beers = mongoCollections.beers;
const { ObjectId } = require('mongodb');

module.exports = {
    /**
     * Adds a beer to the database
     * @param {string} name 
     * @param {string} type 
     * @param {number} abv between 0 and 100
     * @param {string} malt 
     * @param {string} hops 
     * @param {string} notes
     * @returns the new beer
     */
    async addBeer(name, type, abv, malt, hops, notes) {
        if (!name) throw new Error("Must provide beer's name");
        if (!type) throw new Error("Must provide beer's type");
        if (!abv) throw new Error("Must provide beer's abv");
        if (!malt) throw new Error("Must provide beer's malt");
        if (!hops) throw new Error("Must provide beer's hops");
        if (!notes) throw new Error("Must provide beer's notes");

        if (typeof name !== "string") throw new Error("name must be a string");
        if (typeof type !== "string") throw new Error("type must be a string");
        if (typeof abv !== "number") throw new Error("abv must be a number");
        if (abv < 0 || abv > 100) throw new Error("abv must be between 0 and 100")
        // if (!Array.isArray(malt) || malt.length <= 0) throw new Error('malt must be a non-empty array');
        // if (!Array.isArray(hops) || hops.length <= 0) throw new Error('hops must be a non-empty array');
        if (typeof notes !== "string") throw new Error("notes must be a string");

        const beerCollection = await beers();
        const newBeer = {
            name: name,
            type: type,
            abv: abv,
            malt: malt,
            hops: hops,
            notes: notes,
            comments: []
        }

        const insertInfo = await beerCollection.insertOne(newBeer);
        if (insertInfo.insertedCount === 0) throw new Error("Could not add beer");
        const newId = insertInfo.insertedId;

        return await this.getBeer(newId.toString());
    },

    /**
     * Gets a beer by ID from the database
     * @param {string} id
     * @returns the beer
     */
    async getBeer(id) {
        if (!id) throw new Error("Must provide the beer's ID");
        if (typeof id !== "string") throw new Error("ID must be a string");
        const objId = ObjectId.createFromHexString(id);

        const beerCollection = await beers();
        const result = await beerCollection.findOne({_id: objId});
        if (result === null) throw new Error("No beer with that ID");

        return result;
    },

    /**
     * Gets all beers from the database
     * @returns the beers in an Array
     */
    async getAllBeers() {
        const beerCollection = await beers();
        return await beerCollection.find({}).toArray();
    },

    /**
     * Removes a beer by ID from the database
     * @param {string} id state
     */
    async removeBeer(id) {
        if (!id) throw new Error("Must provide the beer's ID");
        if (typeof id !== "string") throw new Error("ID must be a string");
        const objId = ObjectId.createFromHexString(id);

        const beerCollection = await beers();
        const deletionInfo = await beerCollection.removeOne({_id: objId});
        if (deletionInfo.deletedCount === 0) throw new Error(`Could not delete the beer of ID ${id}`);

        return true;
    },

    /**
     * Updates beer by id with the supplied data. Elements of data with names that
     * do not exist in the defined collection will be ignored.
     * @param {string} id 
     * @param {Object} data {name, type, abv, malt, hops, notes}
     */
    async updateBeer(id, data) {
        if (!id) throw new Error("Must provide the beer's ID");
        if (typeof id !== "string") throw new Error("ID must be a string");
        const objId = ObjectId.createFromHexString(id);

        let updatedBeer = await this.getBeer(id);

        if (data.name) {
            if (typeof data.name !== "string") throw new Error("updated name must be a string");
            updatedBeer.name = data.name;
        }
        if (data.type) {
            if (typeof data.type !== "string") throw new Error("updated type must be a string");
            updatedBeer.type = data.type;
        }
        if (data.abv) {
            if (typeof data.abv !== "number") throw new Error("updated abv must be a number");
            updatedBeer.abv = data.abv;
        }
        if (data.malt) {
            if (!Array.isArray(data.malt) || data.malt.length <= 0) 
                throw new Error('updated malt must be a non-empty array');
            updatedBeer.malt = data.malt;
        }
        if (data.hops) {
            if (!Array.isArray(data.hops) || data.hops.length <= 0) 
                throw new Error('updated hops must be a non-empty array');
            updatedBeer.hops = data.hops;
        }
        if (data.notes) {
            if (typeof data.notes !== "string") throw new Error("updated notes must be a string");
            updatedBeer.notes = data.notes;
        }

        const beerCollection = await beers();
        const updatedInfo = await beerCollection.updateOne({_id: objId}, {$set: updatedBeer});
        if (updatedInfo.modifiedCount === 0) throw new Error("Could not update beer successfully");

        return await this.getBeer(id);
    },

    /**
     * Adds a comment for a beer to the database
     * @param {string} beerId 
     * @param {string} userId 
     * @param {string} content
     * @returns the comment
     */
    async addComment(beerId, userId, content) {
        if (!beerId) throw new Error("Must provide beerId");
        if (!userId) throw new Error("Must provide userId");
        if (!content) throw new Error("Must provide content");

        if (typeof beerId !== "string") throw new Error("beerId must be a string");
        if (typeof userId !== "string") throw new Error("userId must be a string");
        if (typeof content !== "string") throw new Error("content must be a string");
        const objId = ObjectId.createFromHexString(beerId);

        const newComment = {
            _id: ObjectId(),
            date: new Date(),
            user: userId,
            content: content
        };

        const beer = await this.getBeer(beerId);
        let newComments = beer.comments;
        newComments.push(newComment);

        const beerCollection = await beers();
        const updatedInfo = await beerCollection.updateOne({_id: objId}, {$set: {comments: newComments}});
        if (updatedInfo.modifiedCount === 0) throw new Error("Could not add comment successfully");

        return newComment;
    },

    /**
     * Gets a beer by comment ID from the database
     * @param {string} id ID of the comment
     * @returns the beer
     */
    async getBeerOfComment(id) {
        if (!id) throw new Error("Must provide commentId");
        if (typeof id !== "string") throw new Error("commentId must be a string");
        const objId = ObjectId.createFromHexString(id);

        const beerCollection = await beers();
        const result = await beerCollection.findOne({"comments._id": objId});
        if (result === null) throw new Error("No comment with that ID");

        return result;
    },

    /**
     * Removes a comment by ID from the database
     * @param {string} id
     * @returns true if successful
     */
    async removeComment(id) {
        if (!id) throw new Error("Must provide commentId");
        if (typeof id !== "string") throw new Error("commentId must be a string");
        const objId = ObjectId.createFromHexString(id);

        const beerCollection = await beers();
        const beer = await beerCollection.findOne({"comments._id": objId});
        if (beer === null) throw new Error("No comment of that ID");

        let newComments = beer.comments;
        for (let i = 0; i < newComments.length; i++) {
            if (newComments[i]._id.toString() === objId.toString()) newComments.splice(i, 1);
        }
        
        const updatedInfo = await beerCollection.updateOne({_id: beer._id}, {$set: {comments: newComments}});
        if (updatedInfo.modifiedCount === 0) throw new Error("Could not remove comment successfully");

        return true;
    }
};
