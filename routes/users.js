const express = require("express");
const router = express.Router();
const data = require('../data/');
const users = data.users;

router.get("/:id", async (req, res) => {
    try {
      const user = await users.getUser(req.params.id);
      res.status(200).render("profile", { firstName: user.firstName, lastName: user.lastName, profilePicture: user.profilePicture});
    } catch (e) {
      res.status(404).json({ message: "User not found!" });
    }
});

router.get("/myprofile", (req, res) => {
  if (!req.session.user) {
      return res.redirect("/login");
  } else {
      return res.render('myprofile', { 
        firstName: req.session.firstName,
        lastName: req.session.lastName,
        profilePicture: req.session.profilePicture,
        email: req.session.email,
        city: req.session.city,
        state: req.session.state,
        age: req.session.age,
        isEditing: false });
  }
});

router.patch("/myprofile", (req, res) => {
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
  
router.get("/", async (req, res) => {
    try {
      const userList = await users.getAllUsers();
      res.status(200).json(userList);
    } catch (e) {
      // Something went wrong with the server!
      res.status(404).send();
    }
});

module.exports = router;