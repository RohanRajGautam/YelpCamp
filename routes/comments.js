const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware/index");

// --------------------
// COMMENT ROUTE

router.get(
  "/campgrounds/:id/comments/new",
  middleware.isLoggedIn,
  (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
      if (err) {
        console.log(err);
      } else {
        res.render("comments/new", { campground: campground });
      }
    });
  }
);

router.post("/campgrounds/:id/comments", middleware.isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          req.flash('error', 'Something went wrong. Please try again.')
        } else {
          //add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          //save comment
          comment.save();
          campground.comments.push(comment);
          campground.save();
          req.flash('success', 'Added new comment.')
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
});

//COMMENTS EDIT ROUTE

router.get(
  "/campgrounds/:id/comments/:comment_id/edit",
  middleware.checkCommentOwnership,
  (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
      if (err || !foundCampground) {
        req.flash('error', 'Something went wrong. Please try again.');
        return res.redirect('/campgrounds')
      }
      Comment.findById(req.params.comment_id, (err, foundComment) => {
        if (err) {
          req.flash('error', 'Something went wrong. Please try again.');
          res.redirect("back");
        } else {
          res.render("comments/edit", {
            campground_id: req.params.id,
            comment: foundComment,
          });
        }
      });
    })
  }
);

//COMMENTS UPDATE ROUTE

router.put(
  "/campgrounds/:id/comments/:comment_id",
  middleware.checkCommentOwnership,
  (req, res) => {
    Comment.findByIdAndUpdate(
      req.params.comment_id,
      req.body.comment,
      (err, updateCampground) => {
        if (err) {
          req.flash('error', 'Something went wrong. Please try again.')
          res.redirect("back");
        } else {
          req.flash('success', 'Comment updated.')
          res.redirect("/campgrounds/" + req.params.id);
        }
      }
    );
  }
);

// DESTROY COMMENT ROUTE

router.delete(
  "/campgrounds/:id/comments/:comment_id",
  middleware.checkCommentOwnership,
  (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
      if (err) {
        req.flash('error', 'Something went wrong. Please try again.')
        res.redirect("back");
      } else {
        req.flash('error', 'Comment deleted.')
        res.redirect("/campgrounds/" + req.params.id);
      }
    });
  }
);

module.exports = router;
