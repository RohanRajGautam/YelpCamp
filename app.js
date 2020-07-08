const express = require("express");
const passport = require("passport");
(app = express()),
  (bodyParser = require("body-parser")),
  (methodOverride = require("method-override")),
  (port = 3000),
  (mongoose = require("mongoose")),
  (localStrategy = require("passport-local")),
  (Campground = require("./models/campground")),
  (User = require("./models/user"));
(Comment = require("./models/comment")), (seedDB = require("./seed"));

const commentRoutes = require("./routes/comments"),
  campgroundsRoutes = require("./routes/campgrounds"),
  indexRoutes = require("./routes/index");

mongoose.connect("mongodb://localhost/yelp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});
// seedDB(); //seed the database

//PASSPORT CONFIGURATION
app.use(
  require("express-session")({
    secret: "This is a secret message",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(commentRoutes);
app.use(campgroundsRoutes);
app.use(indexRoutes);

app.listen(port, () =>
  console.log(`server listening at https://localhost:${port}`)
);
