const mongoCollections = require("../config/mongoCollections");
const comments = mongoCollections.comments;
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