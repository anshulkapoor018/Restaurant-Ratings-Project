const express = require("express");
const router = express.Router();
const data = require('../data/');
const comments = data.comments;

//TODO
router.get("/:id", async (req, res) => {
    try {
      const comment = await comments.getComment(req.params.id);
      res.status(200).json(comment)
      // res.status(200).render("restaurant", { restaurant: restaurant })
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
module.exports = router;