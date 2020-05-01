const express = require("express");
const router = express.Router();
const data = require('../data/');
const users = data.users;

router.get("/login", (req, res) => {
  res.status(200).render("login");
});

router.get("/profile", (req, res) => {
  res.status(404).json({ message: "Sessions are not yet implemented."});
})

router.get("/:id", async (req, res) => {
    try {
      const user = await users.getUser(req.params.id);
      res.status(200).render("profile", { firstName: user.firstName, lastName: user.lastName, email: user.email, city: user.city, state: user.state, age: user.age })
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

router.post("/login", (req, res) => {
  // TODO
  res.status(404).send();
})

module.exports = router;