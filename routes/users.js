const { ObjectId } = require('mongodb');
const mongoCollections = require("../config/mongoCollections");

const express = require("express");
const router = express.Router();
const data = require('../data/');
const users = data.users;
const restaurants = data.restaurants;
const reviews = data.reviews;
const bcrypt = require("bcryptjs");
const reviewData = mongoCollections.reviews;
const userData = mongoCollections.users;

router.get("/login", (req, res) => {
  let hasErrors = false;
  let errors = [];
  let userId = req.session.AuthCookie;
  if(!userId) {
    auth = "Not Authorised User"
    errors.push("Not Authorised, Please Login");
    res.render("login");
  } else {
    auth = "Authorised User"
    res.redirect("/users/profile");
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy(function(err) {
    console.log("User logged out!");
  })
  res.status(200).render("login");
})

router.get("/profile", async (req, res) => {
    let hasErrors = true;
    let errors = [];
    if(!req.session.AuthCookie) {
      auth = "Not Authorised User"
      errors.push("Not Authorised, Please Login");
      res.status(403).render("login", {hasErrors:hasErrors, errors: errors});
    } else {
      auth = "Authorised User"
      let userId = req.session.AuthCookie;
      let userData = await users.getUser(userId);
      let reviewObject = [];
      for (i=0; i<userData.reviewIds.length; i++) {
        let curReview = await reviews.getReview(userData.reviewIds[i]);
        let curRestaurant = await restaurants.getRestaurant(curReview.restaurantId);
        let reviewInfo = {
          review: curReview,
          restaurant: curRestaurant
        }
        reviewObject.push(reviewInfo);
      }
      return res.status(307).render('profile', { 
        firstName: userData.firstName,
        lastName: userData.lastName,
        reviews: reviewObject});
    }
});

router.get("/myprofile", async (req, res) => {
  if (!req.session.AuthCookie) {
      return res.redirect("/users/login");
  } else {
    const currentUser = await users.getUser(req.session.AuthCookie);
      return res.status(307).render('myprofile', { 
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        profilePicture: currentUser.profilePicture,
        email: currentUser.email,
        city: currentUser.city,
        state: currentUser.state,
        age: currentUser.age,
        isEditing: false });
  }
});

router.get("/:id", async (req, res) => {
    try {
      const user = await users.getUser(req.params.id);
      res.status(200).render("profile", { firstName: user.firstName, lastName: user.lastName, profilePicture: user.profilePicture, reviews: user.reviwIds});
    } catch (e) {
      res.status(404).json({ message: "User not found!" });
    }
});
  
router.get("/", async (req, res) => {
    try {
      const userList = await users.getAllUsers();
      res.status(200).json(userList);
    } catch (e) {
      // Something went wrong with the server!
      res.status(404).send();
    }
});

router.post("/myprofile", async (req, res) => {
  let hasErrors = false;
  let errors = [];
  const data = req.body;
  const firstName = data.firstName;
  const lastName = data.lastName;
  const profilePicture = data.profilePicture;
  const email = data.email;
  const city = data.city;
  const state = data.state;
  const age = data.age;
  const password = data.password;
  const confirm = data.confirm;
  if (password != confirm) {
    hasErrors = true;
    errors.push("Passwords must match");
    return res.render("myprofile", {hasErrors: hasErrors, errors: errors});
  }
  const hashedPassword = bcrypt.hashSync(password, 10);
  const editedUser = {
    firstName: firstName,
    lastName: lastName,
    profilePicture: profilePicture,
    email: email,
    city: city,
    state: state,
    age: age,
    hashedPassword: hashedPassword
  }
  try {
    const updatedUser = await users.updateUser(req.session.AuthCookie, editedUser);
    return res.render('myprofile', { 
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      profilePicture: updatedUser.profilePicture,
      email: updatedUser.email,
      city: updatedUser.city,
      state: updatedUser.state,
      age: updatedUser.age,
      hashedPassword: hashedPassword})
    } catch(e) {
      res.status(404).json({ message: "Could not update user!" });
    }
  });

  router.post("/login", async (req, res) => {
    let hasErrors = false;
    let errors = [];
    let userId = req.session.AuthCookie;
    if(userId) {
      auth = "Authorised User"
      return res.redirect("/users/profile");
    } else {
      const userCollection = await userData();
      let userName = req.body.username;
      let password = req.body.password;
      
      const user = await userCollection.findOne({ email: userName});

      console.log(user)
      if(!user) {
          auth = "Not Authorised User"
          hasErrors = true;
          errors.push("Invalid Username or Password");
          res.status(401);
          return res.render("login", {hasErrors:hasErrors, errors: errors});
      } else {
          let isSame = await bcrypt.compare(password, user.hashedPassword);
          if(!isSame) {
             auth = "Not Authorised User"
             hasErrors = true;
             errors.push("Invalid Username/Password");
             res.status(401);
             return res.render("login", {hasErrors:hasErrors, errors: errors});
          } else {
            auth = "Authorised User"
            let userId = await users.getUserId(userName);
            req.session.AuthCookie = userId;
            req.session.user = user;
            return res.redirect("/users/profile");
          }
      }
    }
  });

module.exports = router;