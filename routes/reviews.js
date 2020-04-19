const express = require("express");
const router = express.Router();
const data = require('../data/');
const reviews = data.reviews;

//TODO
router.get("/:id", async (req, res) => {
    try {
      const review = await reviews.getReview(req.params.id);
      res.status(200).render(review);
    } catch (e) {
      res.status(404).json({ message: "review not found!" });
    }
});
  
router.get("/", async (req, res) => {
    try {
      const allReviews = await reviews.getAllReviews();
      res.status(200).render(allReviews);
    } catch (e) {
      // Something went wrong with the server!
      res.status(404).send();
    }
});

module.exports = router;