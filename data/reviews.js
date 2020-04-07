const mongoCollections = require("../config/mongoCollections");
const reviews = mongoCollections.reviews;
const restaurants = mongoCollections.restaurants;
const commentFunctions = require("./comments")
const uuid = require('uuid/v4');

module.exports = {
    async addReview(restaurantId, userId, reviewText, rating) {
        if (!restaurantId || (typeof restaurantId != "string")) throw "restaurant ID must be given as a string";
        if (!userId || (typeof userId != "string")) throw "user ID must be given as a string";
        if (!reviewText || (typeof reviewText != "string")) throw "review text must be given as a string";
        if (!rating || (typeof rating != "number") || (rating < 1) || (rating > 5)) throw "rating must be given as a number from 1 to 5";
        const reviewCollection = await reviews();
        let newReview = {
            _id: uuid(),
            resaurantId: restaurantId,
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
        if (insertInfo.insertedCount === 0) throw "could not add review";
        //Add the review id to the restaurant
        const newId = insertInfo.instertedId;
        const restaurantCollection = await restaurants();
        const updateInfo = await restaurantCollection.updateOne(
            {_id: restaurantId},
            {$addToSet: {reviews: newId}}
        );
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw "Could not add review ID to restaurant";
        return await this.getReview(insertInfo.insertedId);
    },

    async getReview(id) {
        if (!id) throw "id must be given";
        const reviewCollection = await reviews();
        const review = await reviewCollection.findOne({ _id: id});
        if (!review) throw "review with that id does not exist";
        //Expand the comments to show all data
        if (review.comments.length === 0) {
            return review;
        }
        var expandedComments = [];
        for (i=0; i<review.comments.length; i++) {
            let curComment = commentFunctions.getComment(review.comments[i]);
            var tempObject = {
                _id: review.comments[i],
                userId: curComment.userId,
                reviewId: curComment.reviewId,
                commentText: curComment.commentText
            }
            expandedComments.push(tempObject);
        }
        const expandedReview = {
            _id: id,
            resaurantId: review.restaurantId,
            userId: review.userId,
            reviewText: review.reviewText,
            rating: review.rating,
            comments: expandedComments
        }

        return expandedReview;
    },

    async getAllreviews() {
        const reviewCollection = await reviews();
        const reviewList = await reviewCollection.find({}).toArray();
        if (reviewList.length === 0) throw "no reviews in the collection";
        var expandedReviews = [];
        for (i=0; i<reviewList.length; i++) {
            let curReview = await this.getReview(reviewList[i]._id);
            expandedReviews.push(curReview);
        }
        return expandedReviews;
    },

    async updateReview(id, updatedReview) {
        const reviewCollection = await reviews();
        const updatedReviewData = {};
        if (updatedReview.reviewText) {
            updatedReviewData.reviewText = updatedReview.reviewText;
        }

        if (updatedReview.rating) {
            updatedReviewData.rating = updatedReview.rating;
        }
        await reviewCollection.updateOne({_id: id}, {$set: updatedReviwData});
        return await this.getReview(id);
    }
}