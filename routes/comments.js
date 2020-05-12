const express = require("express");
const router = express.Router();
const data = require('../data/');
const comments = data.comments;

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

router.get('/:restaurantId/:commentId/delete', async (req, res) => {
	if (!req.params.commentId) {
		res.status(400).json({ error: 'You must Supply an ID to delete' });
		return;
	}
	try {
		await comments.getComment(req.params.commentId);
	} catch (e) {
		res.status(404).json({ error: 'Comment not found!' });
		return;
	}
	try {
    deleteCommentsFromReview = await comments.removeComment(req.params.commentId);
    if(deleteCommentsFromReview){
      return res.redirect("/restaurants/" + req.params.restaurantId);
    } else {
      return res.status(404).send();
    }
	} catch (e) {
		res.status(500).json({ error: e });
	}
});

router.post("/:restaurantId/:commentId/edit", async (req, res) => {
  const data = req.body;
  const rating = data.rating;
  const commentVal = req.body.commentValue;
  let hasError = false;
  let error = [];

  try {
    const updatedComment = await comments.updateComment(req.params.commentId, commentVal);
    return res.redirect("/restaurants/" + req.params.restaurantId);
  } catch (e) {
    console.log(e);
    res.status(404).json ({message: "Could not update comment!"});
  }
});

module.exports = router;