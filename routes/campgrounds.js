const express = require('express');
const router = express.Router();

// INDEX - display all the campground result
router.get("/campgrounds", (req, res) => {
  // get all campground from database
  Campground.find({}, (err, allCamps) => {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", { campgrounds: allCamps, currentUser: req.user });
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
    username: req.user.username
  }
  let newCampground = { name: name, image: image, description: description, author: author };

  // create a new campground and add to database
  Campground.create(newCampground, (err, newCamp) => {
    if (err) {
      console.log("SOMEthing WENT WRONG!!");
    } else {
      //redirect to campground page
      res.redirect("/campgrounds");
    }
  });
});

//NEW - Show form to create a new campground
router.get("/campgrounds/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

//SHOW - displays a particular item in the db
router.get("/campgrounds/:id", (req, res) => {
  // find the campground with provided id
  Campground.findById(req.params.id)
    .populate("comments")
    .exec((err, foundCampground) => {
      if (err) {
        console.log(err);
      } else {
        res.render("campgrounds/show", { campground: foundCampground });
      }
    });
});

//middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login')
}

module.exports = router;