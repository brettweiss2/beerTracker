const mongoCollections = require("../config/mongoCollections");
const reviews = mongoCollections.reviews;
const users = require("./users");
const beers = require("./beers");
const { ObjectId } = require('mongodb');

module.exports = {
    /**
     * Adds a review to the database
     * @param {string} userId 
     * @param {string} beerId 
     * @param {number} rating between 0 and 5
     * @param {string} comment 
     * @returns the review
     */
    async addReview(userId, beerId, rating, comment) {
        if (!userId) throw new Error("Must provide userId");
        if (!beerId) throw new Error("Must provide beerId");
        if (!rating) throw new Error("Must provide rating");
        if (!comment) throw new Error("Must provide comment");

        if (typeof userId !== "string") throw new Error("userId must be a string");
        if (typeof beerId !== "string") throw new Error("beerId must be a string");
        if (typeof rating !== "number") throw new Error("rating must be a number");
        if (rating < 0 || rating > 5) throw new Error("rating must be between 0 and 5");
        if (typeof comment !== "string") throw new Error("comment must be a string");

        const beer = await beers.getBeer(beerId);
        let beerReviews = beer.reviews;

        const reviewCollection = await reviews();
        const newReview = {
            user: userId,
            beer: beerId,
            rating: rating,
            comment: comment
        };

        const insertInfo = await reviewCollection.insertOne(newReview);
        if (insertInfo.insertedCount === 0) throw new Error("Could not add review");
        const newId = insertInfo.insertedId;

        beerReviews.push(newId);
        await beers.updateBeer(beerId, {reviews: beerReviews});

        const user = await users.getUser(userId);
        let userReviews = user.reviews;
        userReviews.push(newId.toString());
        await users.updateUser(userId, {reviews: userReviews})

        return await this.getReview(newId.toString());
    },

    /**
     * Gets a review by id from the database
     * @param {string} id 
     * @returns the review
     */
    async getReview(id) {
        if (!id) throw new Error("Must provide the review's ID");
        if (typeof id !== "string") throw new Error("ID must be a string");
        const objId = ObjectId.createFromHexString(id);

        const reviewCollection = await reviews();
        const result = await reviewCollection.findOne({_id: objId});
        if (result === null) throw new Error("No review with that ID");

        return result;
    },

    /**
     * Gets all reviews from the database
     * @returns the reviews as an array
     */
    async getAllReviews() {
        const reviewCollection = await reviews();
        return await reviewCollection.find({}).toArray();
    },

    /**
     * Removes a review by id from the database
     * @param {string} id 
     * @returns true if successful
     */
    async removeReview(id) {
        if (!id) throw new Error("Must provide the review's ID");
        if (typeof id !== "string") throw new Error("ID must be a string");
        const objId = ObjectId.createFromHexString(id);
        
        const review = await this.getReview(id);
        const user = await users.getUser(review.user);
        const beer = await beers.getBeer(review.beer);
        let userReviews = user.reviews;
        let beerReviews = beer.reviews;
        let index = userReviews.indexOf(id);
        userReviews.splice(index, 1);
        await users.updateUser(review.user, {reviews: userReviews});
        index = beerReviews.indexOf(id);
        beerReviews.splice(index, 1);
        await beers.updateBeer(review.beer, {reviews: beerReviews});

        const reviewCollection = await reviews();
        const deletionInfo = await reviewCollection.removeOne({_id: objId});
        if (deletionInfo.deletedCount === 0) throw new Error(`Could not delete the review of ID ${id}`);

        return true;
    },

    /**
     * Updates review by id with the supplied data. Elements of data with names that
     * do not exist in the defined collection will be ignored.
     * @param {string} id 
     * @param {object} data {rating, comment}
     * @returns the updated review
     */
    async updateReview(id, data) {
        if (!id) throw new Error("Must provide the review's ID");
        if (typeof id !== "string") throw new Error("ID must be a string");
        const objId = ObjectId.createFromHexString(id);

        let updatedReview = await this.getReview(id);

        if (data.rating) {
            if (typeof data.rating !== "number") throw new Error("updated rating must be a number");
            updatedReview.rating = data.rating;
        }
        if (data.comment) {
            if (typeof data.comment !== "string") throw new Error("updated comment must be a string");
            updatedReview.comment = data.comment;
        }

        const reviewCollection = await reviews();
        const updatedInfo = await reviewCollection.updateOne({_id: objId}, {$set: updatedReview});
        if (updatedInfo.modifiedCount === 0) throw new Error("Could not update review successfully");

        return await this.getReview(id);
    }
};