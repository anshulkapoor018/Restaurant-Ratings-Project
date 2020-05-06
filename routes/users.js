const express = require("express");
const router = express.Router();
const data = require('../data/');
const userData = require('../users');
const users = data.users;
const uData = require("../data/userData");
const bcrypt = require("bcryptjs");

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
  res.status.render("login");
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
      let userData = await uData.getUserData(userId);
      return res.status(307).render('profile', { 
        firstName: userData.firstName,
        lastName: userData.lastName});
    }
});

router.get("/myprofile", async (req, res) => {
  if (!req.session.AuthCookie) {
      return res.redirect("/users/login");
  } else {
    // I think these lines of code should work with the dynamic log in using database
    // const currentUser = await users.getUser(req.session.AuthCookie);
    //   return res.status(307).render('myprofile', { 
    //     firstName: currentUser.firstName,
    //     lastName: currentUser.lastName,
    //     profilePicture: currentUser.profilePicture,
    //     email: currentUser.email,
    //     city: currentUser.city,
    //     state: currentUser.state,
    //     age: currentUser.age,
    //     isEditing: false });

    //Temporary testing with static log in
    return res.status(307).render('myprofile', {
      firstName: req.session.user.firstName,
      lastName: req.session.user.lastName
    })
  }
});

router.get("/:id", async (req, res) => {
    try {
      const user = await users.getUser(req.params.id);
      res.status(200).render("profile", { firstName: user.firstName, lastName: user.lastName, profilePicture: user.profilePicture});
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

router.patch("/myprofile", async (req, res) => {
  const data = req.body;
  const firstName = data.firstName;
  const lastName = data.lastName;
  const profilePicture = data.profilePicture;
  const email = data.email;
  const city = data.city;
  const state = data.state;
  const age = data.age;
  const editedUser = {
    firstName: firstName,
    lastName: lastName,
    profilePicture: profilePicture,
    email: email,
    city: city,
    state: state,
    age: age
  }
  try {
    const updatedUser = await users.updateUser(req.session.id, editedUser);
    return res.render('myprofile', { 
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      profilePicture: updatedUser.profilePicture,
      email: updatedUser.email,
      city: updatedUser.city,
      state: updatedUser.state,
      age: updatedUser.age,
      isEditing: false });
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
      let userName = req.body.username;
      let password = req.body.password;
      user = userData.users.find(element=>element.username === userName)
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
            let userId = await uData.getUserId(userName);
            req.session.AuthCookie = userId;
            req.session.user = user;
            return res.redirect("/users/profile");
          }
      }
    }
  });

module.exports = router;