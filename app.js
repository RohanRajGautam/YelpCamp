const express = require("express");
const passport = require("passport");
(app = express()),
  (bodyParser = require("body-parser")),
  (methodOverride = require("method-override")),
  connectDB = require('./config/db'),
  (port = process.env.PORT || 3000),
  (flash = require("connect-flash")),
  (localStrategy = require("passport-local")),
  (Campground = require("./models/campground")),
  (User = require("./models/user"));
(Comment = require("./models/comment"));

const commentRoutes = require("./routes/comments"),
  campgroundsRoutes = require("./routes/campgrounds"),
  indexRoutes = require("./routes/index");

// CONNECT TO DATABASE
connectDB();


app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

app.use(flash());

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

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use(commentRoutes);
app.use(campgroundsRoutes);
app.use(indexRoutes);

app.listen(port, () =>
  console.log(`Starting server at https://localhost:${port}`)
);
