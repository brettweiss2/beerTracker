const mongoCollections = require("../config/mongoCollections");
const comments = mongoCollections.comments;
const users = require("./users");
const uuid = require("uuid/v4");

const exportedMethods = {
    async getAllComments(){
        const commentCollection = await comments();
        return await commentCollection.find({}).toArray();
    },


    async getCommentById(id){
        const commentCollection = await comments();
        const comment = await commentCollection.findOne({_id: id});

        if(!comment) throw `Comment not found`;
        return comment;
    },



    async addComment(userId,content){
        if (typeof user !== 'string') throw 'No user provided';
        if (typeof content !== 'string') throw 'No content provided';

        const commentCollection =  await comments();


        const newComment = {
            user: {
                id: userId
            },
            content: content,
            _id: uuid()
        }

        const newInsertInformation = await commentCollection.insertOne(newComment);
        const newId = newInsertInformation.inserted;


        // this method not finished in reviews.js
        await users.addCommentToReview(reviewId, newId, content);

        return await this.getCommentById(newId);
    },


    async removeComment(id) {
        const commentCollection = await comments();
        let comment = null;
        try {
            comment = await this.getCommentById(id);
        } catch(e) {
            console.log(e);
            return;
        }

        const deletionInfo = await commentCollection.removeOne({_id: id});
        if (deletionInfo.deletedCount === 0){
            throw `Could not delete comment with id of ${id}`;
        }

        //here may has some mistakes
        await reviews.removeCommentFromReview(reviewId, id);
        return true;
    }
}