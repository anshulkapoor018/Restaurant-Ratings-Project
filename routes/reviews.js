const express = require("express");
const router = express.Router();
const data = require('../data/');
const reviews = data.reviews;

//TODO
router.get("/:id", async (req, res) => {
  let isReviewer = false;
    try {
      const review = await reviews.getReview(req.params.id);
      // if the reviewer is on the page, give them a button to edit
      if(req.session.AuthCookie === review.userId) {
        isReviewer = true;
      }
      res.status(200).render("review", { review: review, isReviewer: isReviewer, id: req.params.id });
    } catch (e) {
      res.status(404).json({ message: "review not found!" });
    }
});

router.post("/", async (req, res) => {
  try {
    const reviewRating = req.body.rating;
    const reviewText = req.body.reviewText;
    console.log(reviewText);
    // const reviewForR1 = await reviews.addReview(String(R1._id), String(U1._id), "Amazing Food!", 4);
    
  } catch (e) {
    // Something went wrong with the server!
    res.status(404).send();
  }
});
  
router.get("/", async (req, res) => {
    try {
      const allReviews = await reviews.getAllReviews();
      res.status(200).json(allReviews);
    } catch (e) {
      // Something went wrong with the server!
      res.status(404).send();
    }
});

router.get("/:id/edit", async (req, res) => {
  try {
    const review = await reviews.getReview(req.params.id);
    if (req.session.AuthCookie != review.userId) {
      return res.redirect("/reviews");
    } else {
      res.status(200).render("editReview", {reviewId: req.params.id, reviewText: review.reviewText, rating: review.rating});
    }} catch (e) {
      res.status(404).json({ message: "review not found" });
    }
});

router.post("/:id/edit", async (req, res) => {
  const data = req.body;
  const rating = data.rating;
  const reviewText = data.reviewText;
  const editedReview = {
    rating: rating,
    reviewText: reviewText
  }
  try {
    const updatedReview = await reviews.updateReview(req.params.id, editedReview);
    return res.redirect("../"+req.params.id);
  } catch (e) {
    console.log(e);
    res.status(404).json ({message: "could not update review"});
  }
});

module.exports = router;