const mongoCollections = require("../config/mongoCollections");
const comments = mongoCollections.comments;
const reviews = mongoCollections.reviews;
const users = mongoCollections.users;
const uuid = require('uuid/v4');

module.exports = {
    // I think it makes sense to also add the review id that the comment is being written on
    async addComment(userId, reviewId, commentText) {
        if (!userId || (typeof userId != "string")) throw "userId must be given as a string";
        if (!reviewId || (typeof reviewId != "string")) throw "reviewId must be given as a string";
        if (!commentText || (typeof commentText != "string")) throw "must give comment text as a string";
        const commentCollection = await comments();
        let newComment = {
            _id: uuid(),
            userId: userId,
            reviewId: reviewId,
            commentText: commentText
        }
        const insertInfo = await commentCollection.insertOne(newComment);
        if (insertInfo.insertedCount === 0) throw "could not add Comment";

        //Add comment ID to the review and user
        const newId = insertInfo.instertedId;
        const reviewCollection = await reviews();
        const userCollection = await users();
        const updateInfo = await reviewCollection.updateOne(
            {_id: reviewId},
            {$addToSet: {comments: newId}}
        );
        const updateInfo2 = await userCollection.updateOne(
            {_id: userId},
            {$addToSet: {commentIds: newId}}
        )
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw "Could not add comment ID to review";
        if (!updateInfo2.matchedCount && !updateInfo2.modifiedCount) throw "Could not add comment ID to user";

        return await this.getComment(insertInfo.insertedId);
    },

    async getComment(id) {
        if (!id) throw "id must be given";
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
    }
}