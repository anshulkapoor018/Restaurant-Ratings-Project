const { ObjectId } = require('mongodb');

const mongoCollections = require("../config/mongoCollections");
const reviews = mongoCollections.reviews;
const restaurants = mongoCollections.restaurants;
const users = mongoCollections.users;
const comments = mongoCollections.comments;
const commentFunctions = require("./comments")
// const uuid = require('uuid/v4');

module.exports = {
    async addReview(restaurantId, userId, reviewText, rating) {
        if (!restaurantId || (typeof restaurantId != "string")) throw "restaurant ID must be given as a string";
        if (!userId || (typeof userId != "string")) throw "user ID must be given as a string";
        if (!reviewText || (typeof reviewText != "string")) throw "review text must be given as a string";
        if (!rating || (typeof rating != "number") || (rating < 1) || (rating > 5)) throw "rating must be given as a number from 1 to 5";
        const reviewCollection = await reviews();
        let newReview = {
            restaurantId: restaurantId,
            userId: userId,
            reviewText: reviewText,
            rating: rating,
            comments: []
        }
        const alreadyReviewed = await reviewCollection.findOne({ 
            $and: [{
                restaurantId: restaurantId
            }, {
                userId: userId
            }]
        });
        if (alreadyReviewed) throw "This user already reviewed this restaurant";
        const insertInfo = await reviewCollection.insertOne(newReview);
        // if (insertInfo.insertedCount === 0) throw "could not add review";
        
        const resCollection = await restaurants();
        const usersCollection = await users();
        const objIdForRes = ObjectId.createFromHexString(restaurantId);
        const objIdForUser = ObjectId.createFromHexString(userId);

        // const insertInfo = await commentCollection.insertOne(newAlbum);
        
        if (insertInfo.insertedCount === 0) {
            throw 'Could not add new Review';
        } else {
            //Add the review id to the restaurant
            const updatedInfo = await resCollection.updateOne({ _id: objIdForRes }, { $push: { reviews: String(newReview._id) } });
            if (updatedInfo.modifiedCount === 0) {
                throw 'Could not update Restaurant Collection with Review Data!';
            }
            //Add the review id to the user
            const updatedInfo2 = await usersCollection.updateOne({ _id: objIdForUser }, { $push: { reviewIds: String(newReview._id) } });
            if (updatedInfo2.modifiedCount === 0) {
                throw 'Could not update Users Collection with Review Data!';
            }
        }
        const newId = insertInfo.insertedId;
        const newIDString = String(newId);
        const review = await this.getReview(newIDString);
        return review;
    },

    async getReview(id) {
        if (!id) throw "id must be given";
        if (typeof(id) === "string") id = ObjectId.createFromHexString(id);
        const reviewCollection = await reviews();
        const review = await reviewCollection.findOne({ _id: id});
        if (!review) throw "review with that id does not exist";
        return review;
    },

    async getAllReviews() {
        const reviewCollection = await reviews();
        const reviewList = await reviewCollection.find({}).toArray();
        if (reviewList.length === 0) throw "no reviews in the collection";
        return reviewList;
    },

    async updateReview(id, updatedReview) {
        if (typeof(id) === "string") id = ObjectId.createFromHexString(id);
        const reviewCollection = await reviews();
        const updatedReviewData = {};
        if (updatedReview.reviewText) {
            updatedReviewData.reviewText = updatedReview.reviewText;
        }

        if (updatedReview.rating) {
            updatedReviewData.rating = updatedReview.rating;
        }
        await reviewCollection.updateOne({_id: id}, {$set: updatedReviewData});
        return await this.getReview(id);
    },

    async removeReview(id) {
        if (!id) throw "id must be given";
        const reviewcollection = await reviews();
        const { ObjectId } = require('mongodb');
        const objRevId = ObjectId.createFromHexString(id);
        const reviewSearch = await reviewcollection.findOne({_id: objRevId});
        const commentList = reviewSearch.comments;
        if (reviewSearch === null){
            throw 'No Review with id - ' + id;
        }
        if (commentList.length != 0) {
            console.log("comments not empty");
            for (var j = 0; j < commentList.length; j++){
                try {
                    console.log("trying to delete comments");
                    const commentCollection = await comments();
                    const { ObjectId } = require('mongodb');
                    const objCommentId = ObjectId.createFromHexString(commentList[j]);
                    const deletionInfoForComment = await commentCollection.removeOne({_id: objCommentId});
                
                    if (deletionInfoForComment.deletedCount === 0) {
                        throw `Could not delete Comment with id of ${commentList[j]}`;
                    }
                } catch (e) {
                    throw 'Could not Delete Comment while deleting Review!';
                }
            }
        }
            try {
                console.log("trying to delete review from user");
                const userCollection = await users();
                const { ObjectId } = require('mongodb');
                const objUserId = ObjectId.createFromHexString(reviewSearch.userId);
                const deletionInfoForReviewFromUsers = await userCollection.updateOne({ _id: objUserId }, { $pull: { reviewIds: String(id) } });
                
                if (deletionInfoForReviewFromUsers.deletedCount === 0) {
                    throw `Could not delete Review with id of ${id}`;
                }
            } catch (e) {
                throw "Could not Delete Review from User while Deleting Review!";
            }
            try {
                console.log("trying to delete review from restaurant");
                const resCollection = await restaurants();
                const { ObjectId } = require('mongodb');
                const objResId = ObjectId.createFromHexString(reviewSearch.restaurantId);
                const deletionInfoForReviewFromRestaurant = await resCollection.updateOne({ _id: objResId }, { $pull: { reviews: String(id) } });
                
                if (deletionInfoForReviewFromRestaurant.deletedCount === 0) {
                    throw `Could not delete Review with id of ${id}`;
                }
            } catch (e) {
                throw `Could not delete Review from Restaurant while Deleting Review!`;
            }
            const deletionInfoForReview = await reviewcollection.removeOne({_id: objRevId});
            if (deletionInfoForReview.deletedCount === 0) {
                throw `Could not delete Review with id of ${objRevId}`;
            }
            return true;
        }
    }