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
        const { ObjectId } = require('mongodb');
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
            const updatedInfo2 = await usersCollection.updateOne({ _id: objIdForUser }, { $push: { commentIds: String(newComment._id) } });
            if (updatedInfo2.modifiedCount === 0) {
                throw 'Could not update Users Collection with Review Data!';
            }
        }

        const newId = insertInfo.insertedId;
        const newIDString = String(newId);
        const recentComment = await this.getComment(newIDString);
        return recentComment;
    },

    async getComment(id) {
        if (!id) throw "id must be given";
        const commentCollection = await comments();
        const { ObjectId } = require('mongodb');
        const objId = ObjectId.createFromHexString(id);
        const comment = await commentCollection.findOne({ _id: objId});
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
        const commentCollection = await comments();
        let comment = await this.getComment(id);
        const deleteInfo = await commentCollection.removeOne({ _id: id});
        if (deleteInfo.deletedCount === 0) {
            throw "could not delete comment with id of ${id}";
        }
        //remove the comment from the user and the review
        const userCollection = await users();
        const reviewCollection = await reviews();
        const updateInfoUser = await userCollection.updateOne({_id: comment.userId}, {$pull: {commentIds: id}});
        if (!updateInfoUser.matchedCount && !updateInfoUser.modifiedCount) throw "could not remove commentId from the user";
        const updateInfoReview = await reviewCollection.updateOne({_id: comment.reviewId}, {$pull: {comments: id}});
        if (!updateInfoReview.matchedCount && !updateInfoReview.modifiedCount) throw "could not remove commentId from the review";
        return true;
    },

    async updateComment(id, commentText) {
        if (!id) throw "id is missing";
        if (!commentText) throw "text is missing";
        const commentCollection = await comments();
        const updateCommentInfo = await commentCollection.updateOne({ _id: id }, { $set: updatedAlbumData });
        if (updateCommentInfo.modifiedCount === 0) throw "Could not update comment";
        return await this.getComment(id);
    }
}