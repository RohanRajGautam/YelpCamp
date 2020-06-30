const express = require("express");
(app = express()),
  (bodyParser = require("body-parser")),
  (port = 3000),
  (mongoose = require("mongoose")),
  localStrategy = require('passport-local'),
  (Campground = require("./models/campground")),
  User = require('./models/user')
Comment = require('./models/comment'),
  (seedDB = require("./seed"));


mongoose.connect("mongodb://localhost/yelp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
seedDB();

// Campground.create(
//   {
//     name: 'Resurrection Bay',
//     image: 'https://source.unsplash.com/eDgUyGu93Yw',
//     description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris aliquam dolor ac porttitor auctor.'
//   }, (err, campground) => {
//     if (err) {
//       console.log("SOMETHING WENT WRONG!")
//     } else {
//       console.log("NEW DATABASE ADDED");
//       console.log(campground);
//     }
//   });

app.get("/", (req, res) => res.render("landing"));

// INDEX - display all the campground result
app.get("/campgrounds", (req, res) => {
  // get all campground from database
  Campground.find({}, (err, allCamps) => {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", { campgrounds: allCamps });
    }
  });
});

// CREATE - add new campground to the db
app.post("/campgrounds", (req, res) => {
  //get data from form and add to campground array
  let name = req.body.name;
  let image = req.body.image;
  let description = req.body.description;
  let newCampground = { name: name, image: image, description: description };

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
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

//SHOW - displays a particular item in the db
app.get("/campgrounds/:id", (req, res) => {
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

// --------------------
// COMMENT ROUTE


app.get('/campgrounds/:id/comments/new', (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', { campground: campground })
    }
  })
})

app.post('/campgrounds/:id/comments', (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
      res.redirect('/campgrounds');
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          console.log(err);
        } else {
          campground.comments.push(comment);
          campground.save();
          res.redirect('/campgrounds/' + campground._id);
        }
      })

    }
  })
})


app.listen(port, () =>
  console.log(`server listening at https://localhost:${port}`)
);
