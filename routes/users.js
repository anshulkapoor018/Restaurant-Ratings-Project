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
const xss = require('xss');
const fs = require("fs");
const multer = require("multer");

const upload = multer({
  dest: "../public/images"
});

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
        email: userData.email,
        city: userData.city,
        state: userData.state,
        age: userData.age,
        reviews: reviewObject,
        userLoggedIn: true});
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
        isEditing: false,
        userLoggedIn: true});
  }
});

router.get("/:id", async (req, res) => {
  let userLoggedIn = false;
  if (req.session.AuthCookie) {
    userLoggedIn = true;
  }
  if (req.params.id === req.session.AuthCookie) {
    return res.redirect("/users/profile");
  }
    try {
      let userData = await users.getUser(req.params.id);
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
      res.status(200).render("user", { 
        firstName: userData.firstName, 
        lastName: userData.lastName, 
        profilePicture: userData.profilePicture, 
        state: userData.state,
        reviews: reviewObject,
        userLoggedIn: userLoggedIn});
    } catch (e) {
      console.log(e);
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

router.post("/myprofile", upload.single("file"), async (req, res) => {
  let hasErrors = false;
  let errors = [];
  let editedUser;
  let hashedPassword;
  let newFileName;
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
  console.log(data);

  if (password != confirm) {
    hasErrors = true;
    errors.push("Passwords must match");
    return res.render("myprofile", {hasErrors: hasErrors, errors: errors});
  }
  if (password) {
    hashedPassword = bcrypt.hashSync(password, 10);
    editedUser = {
      firstName: firstName,
      lastName: lastName,
      profilePicture: profilePicture,
      email: email,
      city: city,
      state: state,
      age: age,
      hashedPassword: hashedPassword
    }
  } else {
    editedUser = {
      firstName: firstName,
      lastName: lastName,
      profilePicture: profilePicture,
      email: email,
      city: city,
      state: state,
      age: age
    }
  }

  if (profilePicture){
    try {
      console.log("Checkpoint 0");
      console.log(req.file.path);
      const tempPath = req.file.path;
      console.log("Checkpoint 1");
      newFileName = lastName + "_" + firstName + "_" + "ProfilePicture.png"
      const targetPath = path.join(__dirname, "../public/images/" + newFileName);
      console.log("Checkpoint 2");
      console.log(path.extname(req.file.originalname).toLowerCase());
      if (path.extname(req.file.originalname).toLowerCase() === ".png" || path.extname(req.file.originalname).toLowerCase() === ".jpg") {
          console.log("Checkpoint 3");
          fs.rename(tempPath, targetPath, err => {
              console.log("Checkpoint 4");
              if (err) {
                  console.log(err);
                  return handleError(err, res);
              }
              console.log("Checkpoint 5");
          });
      }
      else {
          fs.unlink(tempPath, err => {
              console.log("Checkpoint 6");
              if (err) {
                  console.log(err);
                  return handleError(err, res);
              }
              console.log("Checkpoint 7");
              res.status(404).json({ message: "Could not update user! (0)" });
              console.log("Error uploading profile image (0)");
          });
      }
      console.log("Checkpoint 8");
      const newUser = await userData.addUser(data.firstname, data.lastname, data.username, data.password1, newFileName);
      console.log("Checkpoint 9");
  
    }
    catch (e) {
      console.log("Error uploading profile image (1)");
      return res.status(404).json({ message: "Could not update user! (1)" });
    }
  }

  try {
    console.log("1");
    const updatedUser = await users.updateUser(req.session.AuthCookie, editedUser);
    console.log("2");
    return res.render('myprofile', { 
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      profilePicture: updatedUser.profilePicture,
      email: updatedUser.email,
      city: updatedUser.city,
      state: updatedUser.state,
      age: updatedUser.age,
      userLoggedIn: true});
    } catch(e) {
      return res.status(404).json({ message: "Could not update user! (2)" });
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

router.post("/signup", async (req, res) => {
	let hasErrors = false;
	const saltRounds = 16;
	let errors = [];
  let hashedPassword = ""
  console.log(req.body);
	let firstName = req.body.firstname;
	let lastName = req.body.lastname;
	let age = req.body.age;
	let userName = req.body.username;
  let password = req.body.password;
  let city = req.body.city;
  let state = req.body.state;
  
  const userCollection = await userData();      
  const user = await userCollection.findOne({ email: userName});
  if (user) {
    hasErrors = true;
    errors.push("User with this email already exists");
    res.status(401);
    return res.render("login", {hasErrors:hasErrors, errors: errors});
  }

	if(firstName == "" || !firstName){
		hasErrors = true;
		errors.push("Please Enter your First Name");
		res.status(401);
		return res.render("login", {hasErrors:hasErrors, errors: errors});
	}
	if(lastName == "" || !lastName){
		hasErrors = true;
		errors.push("Please Enter your Last Name");
		res.status(401);
		return res.render("login", {hasErrors:hasErrors, errors: errors});
	}
	if(age == "" || !age){
		hasErrors = true;
		errors.push("Please Enter your age");
		res.status(401);
		return res.render("login", {hasErrors:hasErrors, errors: errors});
	}
	if(userName == "" || !userName){
		hasErrors = true;
		errors.push("Please Enter your Email");
		res.status(401);
		return res.render("login", {hasErrors:hasErrors, errors: errors});
  }
  if(city == "" || !city){
		hasErrors = true;
		errors.push("Please Enter your City Name");
		res.status(401);
		return res.render("login", {hasErrors:hasErrors, errors: errors});
	}
	if(password == "" || !password){
		hasErrors = true;
		errors.push("Please Enter a Password");
		res.status(401);
		return res.render("login", {hasErrors:hasErrors, errors: errors});
	}
	
	bcrypt.genSalt(saltRounds, function (err, salt) {
		if (err) {
			hasErrors = true;
			errors.push("Error in Parsing the Password, Please Try Again!");
			res.status(401);
			return res.render("login", {hasErrors:hasErrors, errors: err});
			// throw err
		} else {
			bcrypt.hash(password, salt, function(err, hash) {
				if (err) {
					hasErrors = true;
					errors.push("Error in Parsing the Password, Please Try Again!");
					res.status(401);
					return res.render("login", {hasErrors:hasErrors, errors: err});
					// throw err
				} else {
					hashedPassword = hash;
					users.addUser(xss(firstName), xss(lastName), xss(userName), "", xss(city), xss(state), xss(age), xss(hashedPassword));
					errors.push("Signed Up Successfully!");
      				res.status(200).render("login", {hasErrors:true, errors: errors});
				}
		  	})
		}
	});
});

module.exports = router;