const express = require("express");
const router = express.Router();
const data = require('../data/');
const restaurants = data.restaurants;

//TODO

router.get("/:id", async (req, res) => {
    try {
      const restaurant = await restaurants.getRestaurant(req.params.id);
      res.status(200).render(restaurant);
    } catch (e) {
      res.status(404).json({ message: "Restaurant not found!" });
    }
  });
  
  router.get("/", async (req, res) => {
    try {
      const restaurantList = await restaurants.getAllRestaurants();
      res.status(200).render("restaurants", { restaurants: restaurantList });
    } catch (e) {
      // Something went wrong with the server!
      res.status(404).send();
    }
  });

module.exports = router;