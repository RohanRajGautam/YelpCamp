const middlewareObj = {};

middlewareObj.checkCampgroundOwnership = (req, res, next) => {
  // is user authenticated?
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, (err, foundCampground) => {
      if (err || !foundCampground) {
        req.flash("error", "Campground not found.");
        res.redirect("/campgrounds");
      } else {
        //does user own the campground?
        if (foundCampground.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "Permission denied.");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash('error', 'Please log in first!')
    res.redirect("back");
  }
};

middlewareObj.checkCommentOwnership = (req, res, next) => {
  // is user authenticated?
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err || !foundComment) {
        req.flash("error", "Comment not found.");
        res.redirect("/campgrounds");
      } else {
        //does user own the comment?
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "Permission denied.");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash('error', 'Please log in first!')
    res.redirect("back");
  }
};

middlewareObj.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "Please log in first!");
  res.redirect("/login");
};

module.exports = middlewareObj;
