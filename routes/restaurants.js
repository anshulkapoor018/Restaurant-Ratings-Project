const express = require("express");
const router = express.Router();
const data = require('../data/');
const comments = data.comments;
const restaurants = data.restaurants;
const reviews = data.reviews;
const users = data.users;
const mongoCollections = require("../config/mongoCollections");
const rest = mongoCollections.restaurants;
const { ObjectId } = require('mongodb');

router.get("/:id", async (req, res) => {
    try {
      let restaurant = await restaurants.getRestaurant(req.params.id);
      let reviewList = [];
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
      }
      restaurant = await restaurants.getRestaurant(req.params.id);
      res.status(200).render("restaurant", { restaurant: restaurant, reviews: reviewList, userLoggedIn: userLoggedIn, loggedInReviewer: loggedInReviewer})
    } catch (e) {
      res.status(404).json({ message: "Restaurant not found!" });
    }
});
  
router.get("/", async (req, res) => {
  let sumRating = 0;
  let totalRating = 0;

  try {
    let restaurantList = await restaurants.getAllRestaurants();
    for (resto of restaurantList){
      let sumRating = 0;
      let totalRating = 0;
      for (reviewId of resto.reviews) {
        review = await reviews.getReview(reviewId);
        //Get Avg
        totalRating += 1;
        sumRating += parseInt(review.rating);
      }
      //Rating Updates
      let avgRating = sumRating/totalRating;
      avgRating = avgRating.toFixed(2);
      const restCollection = await rest();
      const updated = await restCollection.updateOne({_id: resto._id}, {$set: { rating: avgRating}});
      if(!updated.matchedCount && !updated.modifiedCount) res.status(500).json({ message: "Couldn't update rating" });
    }
    
    let userLoggedIn = false;
    let userId = req.session.AuthCookie;

    if(!userId) {
      userLoggedIn = false;
    } else {
      userLoggedIn = true;
    }
    restaurantList = await restaurants.getAllRestaurants();
    res.status(200).render("restaurants", { restaurants: restaurantList, userLoggedIn: userLoggedIn});
  } catch (e) {
    // Something went wrong with the server!
    console.log(e);
    res.status(404).send();
  }

    
});

router.post("/search", async (req, res) => {
  const body = req.body;
  try {
    let restaurantList = await restaurants.getRestaurantsViaSearch(body.search);

    let userLoggedIn = false;
    let userId = req.session.AuthCookie;
    if(!userId) {
      userLoggedIn = false;
    } else {
      userLoggedIn = true;
    }

    res.status(200).render("restaurants", { restaurants: restaurantList , userLoggedIn: userLoggedIn});
  } catch (e) {
    res.status(500).send();
  }
})

module.exports = router;