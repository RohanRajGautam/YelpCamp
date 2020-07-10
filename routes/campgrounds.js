const express = require("express");
const router = express.Router();
const middleware = require("../middleware/index");

// INDEX - display all the campground result
router.get("/campgrounds", (req, res) => {
  // get all campground from database
  Campground.find({}, (err, allCamps) => {
    if (err) {
      req.flash('error', 'Something went wrong. Please try again.');
    } else {
      res.render("campgrounds/index", {
        campgrounds: allCamps,
        currentUser: req.user,
      });
    }
  });
});

// CREATE - add new campground to the db
router.post("/campgrounds", (req, res) => {
  //get data from form and add to campground array
  let name = req.body.name;
  let image = req.body.image;
  let description = req.body.description;
  let author = {
    id: req.user._id,
    username: req.user.username,
  };
  let newCampground = {
    name: name,
    image: image,
    description: description,
    author: author,
  };

  // create a new campground and add to database
  Campground.create(newCampground, (err, newCamp) => {
    if (err) {
      req.flash('error', 'Something went wrong. Please try again.')
    } else {
      //redirect to campground page
      req.flash("success", "Added new campground");
      res.redirect("/campgrounds");
    }
  });
});

//NEW - Show form to create a new campground
router.get("/campgrounds/new", middleware.isLoggedIn, (req, res) => {
  res.render("campgrounds/new", { currentUser: req.user });
});

//SHOW - displays a particular item in the db
router.get("/campgrounds/:id", (req, res) => {
  // find the campground with provided id
  Campground.findById(req.params.id)
    .populate("comments")
    .exec((err, foundCampground) => {
      if (err) {
        req.flash('error', 'Campground not found.')
      } else {
        res.render("campgrounds/show", {
          campground: foundCampground,
          currentUser: req.user,
        });
      }
    });
});

// EDIT Campground route
router.get(
  "/campgrounds/:id/edit",
  middleware.checkCampgroundOwnership,
  (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
      res.render("campgrounds/edit", {
        campground: foundCampground,
        currentUser: req.user,
      });
    });
  }
);

// UPDATE Campground route
router.put(
  "/campgrounds/:id",
  middleware.checkCampgroundOwnership,
  (req, res) => {
    Campground.findByIdAndUpdate(
      req.params.id,
      req.body.campground,
      (err, updateCampground) => {
        if (err) {
          req.flash('error', 'Something went wrong. Please try again.')
          res.redirect("/campgrounds");
        } else {
          req.flash('success', 'Campground updated.')
          res.redirect("/campgrounds/" + req.params.id);
        }
      }
    );
  }
);

// DESTROY campground route
router.delete(
  "/campgrounds/:id",
  middleware.checkCampgroundOwnership,
  (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err) => {
      if (err) {
        req.flash('error', 'Something went wrong. Couldn\'t delete the campground.')
        res.redirect("/campgrounds");
      } else {
        req.flash('error', 'Campground deleted.')
        res.redirect("/campgrounds");
      }
    });
  }
);

module.exports = router;
