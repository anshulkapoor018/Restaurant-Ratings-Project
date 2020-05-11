const express = require("express");
const router = express.Router();
const data = require('../data/');
const comments = data.comments;

//TODO
router.get("/:id", async (req, res) => {
    try {
      const comment = await comments.getComment(req.params.id);
      res.status(200).render("comment", {commentText: comment.commentText})
    } catch (e) {
      res.status(404).json({ message: "Comment not found!" });
    }
});

router.get("/", async (req, res) => {
    try {
      const commentList = await comments.getAllComments();
      res.status(200).json(commentList)
    } catch (e) {
      // Something went wrong with the server!
      res.status(404).send();
    }
});

router.post('/:userId/:reviewId/:restaurantId/add', async (req, res) => {
    if (!req.params.reviewId || !req.params.userId) {
      res.status(400).json({ error: 'You must Supply an ID to add comment to!' });
      return;
	}
	const commentVal = req.body.commentValue;
    try {
      addCommentOnReview = await comments.addComment(req.params.userId, req.params.reviewId, commentVal)
      if(addCommentOnReview){
        return res.redirect("/restaurants/" + req.params.restaurantId);
      } else {
        return res.status(404).send();
      }
    } catch (e) {
      res.status(500).json({ error: e });
    }
});
module.exports = router;