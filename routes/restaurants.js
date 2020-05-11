const express = require("express");
const router = express.Router();
const data = require('../data/');
const comments = data.comments;
const restaurants = data.restaurants;
const reviews = data.reviews;
const users = data.users;

router.get("/:id", async (req, res) => {
    try {
      const restaurant = await restaurants.getRestaurant(req.params.id);
      let reviewList = [];
      let userLoggedIn = false;
      let loggedInReviewer = false
      try { // Get reviews of restaurant
        for (reviewId of restaurant.reviews) {
          review = await reviews.getReview(reviewId);
          commentList = [];
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
      res.status(200).render("restaurant", { restaurant: restaurant, reviews: reviewList, userLoggedIn: userLoggedIn, loggedInReviewer: loggedInReviewer})
    } catch (e) {
      res.status(404).json({ message: "Restaurant not found!" });
    }
});
  
router.get("/", async (req, res) => {
    try {
      const restaurantList = await restaurants.getAllRestaurants();
      let userLoggedIn = false;
      let userId = req.session.AuthCookie;
      if(!userId) {
        userLoggedIn = false;
      } else {
        userLoggedIn = true;
      }
      res.status(200).render("restaurants", { restaurants: restaurantList, userLoggedIn: userLoggedIn});
    } catch (e) {
      // Something went wrong with the server!
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
    
    if (restaurantList.length > 0) {
      res.status(200).render("restaurants", { restaurants: restaurantList , userLoggedIn: userLoggedIn});
    } else {
      res.status(200).render("search");
    }
  } catch (e) {
    res.status(500).send();
  }
})

module.exports = router;