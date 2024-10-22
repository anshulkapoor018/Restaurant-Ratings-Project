const { ObjectId } = require('mongodb');

const mongoCollections = require("../config/mongoCollections");
const comments = mongoCollections.comments;
const reviews = mongoCollections.reviews;
const users = mongoCollections.users;
// const uuid = require('uuid/v4');

module.exports = {
    // I think it makes sense to also add the review id that the comment is being written on
    async addComment(userId, reviewId, commentText) {
        if (!userId || (typeof userId != "string")) throw "userId must be given as a string";
        if (!reviewId || (typeof reviewId != "string")) throw "reviewId must be given as a string";
        if (!commentText || (typeof commentText != "string")) throw "must give comment text as a string";
        const commentCollection = await comments();
        let newComment = {
            userId: userId,
            reviewId: reviewId,
            commentText: commentText
        }
        const insertInfo = await commentCollection.insertOne(newComment);
        
        const revCollection = await reviews();
        const usersCollection = await users();
        const objIdForRev = ObjectId.createFromHexString(reviewId);
        const objIdForUser = ObjectId.createFromHexString(userId);
        
        if (insertInfo.insertedCount === 0) {
            throw 'Could not add new Review';
        } else {
            //Add the comment id to the review
            const updatedInfo = await revCollection.updateOne({ _id: objIdForRev }, { $push: { comments: String(newComment._id) } });
            if (updatedInfo.modifiedCount === 0) {
                throw 'Could not update Review Collection with Review Data!';
            }
            //Add the comment id to the user
            // const updatedInfo2 = await usersCollection.updateOne({ _id: objIdForUser }, { $push: { commentIds: String(newComment._id) } });
            // if (updatedInfo2.modifiedCount === 0) {
            //     throw 'Could not update Users Collection with Review Data!';
            // }
        }

        const newId = insertInfo.insertedId;
        const newIDString = String(newId);
        const recentComment = await this.getComment(newIDString);
        return recentComment;
    },

    async getComment(id) {
        if (!id) throw "id must be given";
        if (typeof(id) === "string") id = ObjectId.createFromHexString(id);
        const commentCollection = await comments();
        const comment = await commentCollection.findOne({ _id: id});
        if (!comment) throw "Comment with that id does not exist";
        return comment;
    },

    async getAllComments() {
        const commentCollection = await comments();
        const commentList = await commentCollection.find({}).toArray();
        if (commentList.length === 0) throw "no Comments in the collection";
        return commentList;
    },

    async removeComment(id) {
        if (!id) throw "id must be given";
        if (typeof(id) === "string") id = ObjectId.createFromHexString(id);
        const commentCollection = await comments();
        let comment = await this.getComment(id);
        const deleteInfo = await commentCollection.removeOne({ _id: id});
        if (deleteInfo.deletedCount === 0) {
            throw "could not delete comment with id of ${id}";
        }
        try {
            const reviewCollection = await reviews();
            const { ObjectId } = require('mongodb');
            const objUserId = ObjectId.createFromHexString(comment.reviewId);
            const deletionInfoForCommentFromReview = await reviewCollection.updateOne({ _id: objUserId }, { $pull: { comments: String(id) } });
            
            if (deletionInfoForCommentFromReview.deletedCount === 0) {
                throw `Could not delete Comment with id of ${id}`;
            }
        } catch (e) {
            throw "Could not Delete Comment from Review while Deleting Comment!";
        }

        return true;
    },
    
    async updateComment(id, commentText) {
        if (!id) throw "Comment Id is missing";
        
        const updatedCommentData = {};
        if (!commentText){
            throw "Please Enter a Comment";
        } else {
            updatedCommentData.commentText = commentText;
        }
    
        if (typeof(id) === "string") id = ObjectId.createFromHexString(id);
        const commentCollection = await comments();
        const updateCommentInfo = await commentCollection.updateOne({ _id: id }, { $set: updatedCommentData });
        if (updateCommentInfo.modifiedCount === 0) throw "Could not update comment";
        return await this.getComment(id);
    }
}