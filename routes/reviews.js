const express = require("express");
const router = express.Router();
const data = require('../data/');
const reviews = data.reviews;
const users = data.users;
const restaurants = data.restaurants;
const comments = data.comments;
const mongoCollections = require("../config/mongoCollections");
const rest = mongoCollections.restaurants;
const { ObjectId } = require('mongodb');

//TODO
router.get("/:id", async (req, res) => {
  let isReviewer = false;
    try {
      const review = await reviews.getReview(req.params.id);
      const user = await users.getUser(review.userId);
      const restaurant = await restaurants.getRestaurant(review.restaurantId);
      // if the reviewer is on the page, give them a button to edit
      if(req.session.AuthCookie === review.userId) {
        isReviewer = true;
      }
      res.status(200).render("review", { review: review, user: user, restaurant: restaurant, isReviewer: isReviewer, id: req.params.id });
    } catch (e) {
      res.status(404).json({ message: "review not found!" });
    }
});

router.post("/:id/add", async (req, res) => {
  const data = req.body;
  const rating = data.rating;
  const reviewText = data.reviewText;
  let hasError = false;
  let error = [];
  if (rating > 5 || rating < 1) {
    hasError = true;
    error.push("Rating must be a number between 1 and 5");
    let restaurant = await restaurants.getRestaurant(req.params.id);
      let reviewList = [];
      let userData = {}
      let userLoggedIn = false;
      let loggedInReviewer = false;
      let sumRating = 0;
      let totalRating = 0;

      try { // Get reviews of restaurant
        for (reviewId of restaurant.reviews) {
          review = await reviews.getReview(reviewId);
          commentList = [];
          //Get Avg
          totalRating += 1;
          sumRating += parseInt(review.rating);
        
          //Rating Updates
          let avgRating = sumRating/totalRating;
          avgRating = avgRating.toFixed(2);
          const restCollection = await rest();
          const objIdForRes = ObjectId.createFromHexString(req.params.id);
          const updated = await restCollection.updateOne({_id: objIdForRes}, {$set: { rating: avgRating}})
          if(!updated.matchedCount && !updated.modifiedCount) res.status(500).json({ message: "Couldn't update rating" });

          try { // Get comments of review
            for (commentId of review.comments) {
              comment = await comments.getComment(commentId);
              comment.user = await users.getUser(comment.userId);
              commentList.push(comment); // This is a simple FIFO - can be improved or filtered in client JS
            }
          } catch (e) {
            console.log(e);
          }
          review.commentList = commentList; // Add new array inside review object
          // If this review is by the logged in user, let them edit it from here
          if (req.session.AuthCookie === review.userId) {
            review.isReviewer = true;
            loggedInReviewer = true;
          } else {
            review.isReviewer = false;
            loggedInReviewer = false;
          }
          review.user = await users.getUser(review.userId);
          reviewList.push(review); // This is a simple FIFO - can be improved or filtered in client JS

        }
      } catch (e) {
        console.log(e);
      }

      let userId = req.session.AuthCookie;
      if(!userId) {
        userLoggedIn = false;
      } else {
        userLoggedIn = true;
        userData = await users.getUser(userId);
        userData.reviewedRestaurantPage = reviewList.some(item => item.userId === String(userData._id));
      }
    return res.status(403).render("restaurant", { restaurant: restaurant, reviews: reviewList, userLoggedIn: userLoggedIn, loggedInReviewer: loggedInReviewer, currentUserData: userData, hasError: hasError, error: error});
  }
  try {
    const reviewRating = req.body.rating;
    const reviewText = req.body.reviewText;
    let userId = req.session.AuthCookie;
    let restaurantID = req.params.id;
    const reviewForRes = await reviews.addReview(restaurantID, userId, reviewText, Number(reviewRating));
    const redirectURL = "/restaurants/" + restaurantID;
    return res.redirect(redirectURL);
  } catch (e) {
    // Something went wrong with the server!
    res.status(404).send();
  }
});
  
router.get("/", async (req, res) => {
    try {
      const allReviews = await reviews.getAllReviews();
      res.status(200).json(allReviews);
    } catch (e) {
      // Something went wrong with the server!
      res.status(404).send();
    }
});

router.get("/:id/edit", async (req, res) => {
  try {
    const review = await reviews.getReview(req.params.id);
    if (req.session.AuthCookie != review.userId) {
      return res.redirect("/reviews");
    } else {
      res.status(200).render("editReview", {reviewId: req.params.id, reviewText: review.reviewText, rating: review.rating});
    }} catch (e) {
      res.status(404).json({ message: "review not found" });
    }
});

router.post("/:id/edit", async (req, res) => {
  const data = req.body;
  const rating = data.rating;
  const reviewText = data.reviewText;
  let hasError = false;
  let error = [];
  const editedReview = {
    rating: rating,
    reviewText: reviewText
  }
  if (rating > 5 || rating < 1) {
    hasError = true;
    error.push("Rating must be a number between 1 and 5");
    return res.status(403).render("editReview", {reviewId: req.params.id, reviewText: reviewText, rating: rating, hasError: hasError, error: error});
  }
  try {
    const updatedReview = await reviews.updateReview(req.params.id, editedReview);
    return res.redirect("../"+req.params.id);
  } catch (e) {
    console.log(e);
    res.status(404).json ({message: "could not update review"});
  }
});

router.get('/:restaurantId/:reviewId/delete', async (req, res) => {
	if (!req.params.reviewId) {
		res.status(400).json({ error: 'You must Supply an ID to delete' });
		return;
	}
	try {
		await reviews.getReview(req.params.reviewId);
	} catch (e) {
		res.status(404).json({ error: 'Review not found!' });
		return;
	}
	try {
    deleteReviewWithComments = await reviews.removeReview(req.params.reviewId);
    if(deleteReviewWithComments){
      return res.redirect("/restaurants/" + req.params.restaurantId);
    } else {
      return res.status(404).send();
    }
		//res.json({deleted: true, data: toBeDeletedReview});
	} catch (e) {
		res.status(500).json({ error: e });
	}
});

module.exports = router;