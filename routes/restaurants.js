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
const session = require("express-session");

router.get("/manage", async (req, res) => {
  if (!req.session.AuthCookie) {
    res.status(401).redirect("/users/login");
  } else{ 
    try {
      const restaurantList = await restaurants.getRestaurantsByOwner(req.session.AuthCookie);
      // const userLoggedIn = (req.session.AuthCookie) ? true : false;
      res.status(200).render("management", { restaurants: restaurantList, userLoggedIn: true })
    } catch (e) {
      console.log(e);
      res.status(200).render("management", { restaurants: [], userLoggedIn: true })
    }
  }
});

router.get("/edit/:id", async (req, res) => {
  if (!req.session.AuthCookie) {
    res.status(401).redirect("/users/login");
  } else if (!restaurants.checkRestaurantOwnership(req.params.id, req.session.AuthCookie)) {
    res.status(401).redirect("/restaurants/manage");
  } else {
    res.status(200).render("editRestaurant", { id: req.params.id, userLoggedIn: true })
  }
});

router.get("/:id", async (req, res) => {
    try {
      let restaurant = await restaurants.getRestaurant(req.params.id);
      let reviewList = [];
      let userData = {}
      let userLoggedIn = false;
      let loggedInReviewer = false;
      let sumRating = 0;
      let totalRating = 0;
      let hasError = false;
      let error = [];
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
              comment.restaurantId = req.params.id;
              // If this comment is by the logged in user, let them edit it from here
              if (req.session.AuthCookie === comment.userId) {
                comment.isCommenter = true;
              } else {
                comment.isCommenter = false;
              }
              commentList.push(comment); // This is a simple FIFO - can be improved or filtered in client JS
            }
          } catch (e) {
            console.log(e);
          }
          // console.log(commentList);
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
      restaurant = await restaurants.getRestaurant(req.params.id);
      res.status(200).render("restaurant", { restaurant: restaurant, reviews: reviewList, userLoggedIn: userLoggedIn, loggedInReviewer: loggedInReviewer, currentUserData: userData, hasError: hasError, error: error})
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

router.get("/sort/best", async (req, res) => {
  try {
    let userLoggedIn = false;
    let userId = req.session.AuthCookie;

   if(!userId) {
      userLoggedIn = false;
    } else {
      userLoggedIn = true;
    }
    restaurantList = await restaurants.getBestRestaurants();
    res.status(200).render("restaurants", { restaurants: restaurantList, userLoggedIn: userLoggedIn});
  } catch (e) {
    // Something went wrong with the server!
    console.log(e);
    res.status(404).send();
}
});

router.get("/sort/worst", async (req, res) => {
  try {
    let userLoggedIn = false;
    let userId = req.session.AuthCookie;

   if(!userId) {
      userLoggedIn = false;
    } else {
      userLoggedIn = true;
    }
    restaurantList = await restaurants.getWorstRestaurants();
    res.status(200).render("restaurants", { restaurants: restaurantList, userLoggedIn: userLoggedIn});
  } catch (e) {
    // Something went wrong with the server!
    console.log(e);
    res.status(404).send();
}
});

router.post("/add", async (req, res) => {
  if (!req.session.AuthCookie) {
    res.status(401).redirect("/users/login");
  }
  const body = req.body;
  if (!body.name) res.status(400).redirect("/restaurants/manage"); 
  if (!body.website) res.status(400).redirect("/restaurants/manage");
  if (!body.category) res.status(400).redirect("/restaurants/manage");
  if (!body.address) res.status(400).redirect("/restaurants/manage");
  if (!body.city) res.status(400).redirect("/restaurants/manage");
  if (!body.state) res.status(400).redirect("/restaurants/manage");
  if (!body.zip) res.status(400).redirect("/restaurants/manage");
  if (!body.longitude) res.status(400).redirect("/restaurants/manage");
  if (!body.latitude) res.status(400).redirect("/restaurants/manage");
  try {
    await restaurants.addRestaurantWithOwner(body.name, body.website, body.category, body.address, body.city, body.state, body.zip, parseFloat(body.longitude), parseFloat(body.latitude), req.session.AuthCookie);
  } catch (e) {
    console.log(e);
  }
  res.redirect("/restaurants/manage");
})

router.post("/edit", async (req, res) => {
  const body = req.body;
  if (!req.session.AuthCookie) {
    res.status(401).redirect("/users/login");
  } else if (!body._id) { // Check that restaurant ID didn't get lost somehow
    res.status(400).redirect("/restaurants/manage")
  } else if (!restaurants.checkRestaurantOwnership(body._id, req.session.AuthCookie)) { // Check that user has permission to manage
    res.status(401).redirect("/restaurants/manage");
  } else {
    if (!body.name) res.status(400).redirect("/restaurants/manage"); 
    if (!body.website) res.status(400).redirect("/restaurants/manage");
    if (!body.category) res.status(400).redirect("/restaurants/manage");
    if (!body.address) res.status(400).redirect("/restaurants/manage");
    if (!body.city) res.status(400).redirect("/restaurants/manage");
    if (!body.state) res.status(400).redirect("/restaurants/manage");
    if (!body.zip) res.status(400).redirect("/restaurants/manage");
    if (!body.longitude) res.status(400).redirect("/restaurants/manage");
    if (!body.latitude) res.status(400).redirect("/restaurants/manage");
    try {
      await restaurants.updateRestaurant(body._id, body.name, body.website, body.category, body.address, body.city, body.state, body.zip, parseFloat(body.longitude), parseFloat(body.latitude));
    } catch (e) {
      console.log(e);
    }
    res.redirect("/restaurants/manage");
  }
  
})

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
      res.status(200).render("search", { userLoggedIn: userLoggedIn });
    }
  } catch (e) {
    res.status(500).send();
  }
})

module.exports = router;