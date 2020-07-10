const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

router.get("/", (req, res) => res.render("landing"));

// ==============
// AUTH ROUTES
// ==============

//show sign up form
router.get("/register", (req, res) => {
  res.render("register");
});

//handle sign up logic
router.post("/register", (req, res) => {
  const newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      return res.render("/register");
    }
    passport.authenticate("local")(req, res, () => {
      res.redirect("/campgrounds");
    });
  });
});

//show login page
router.get("/login", (req, res) => {
  res.render("login");
});

//handle login logic
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
  }),
  (req, res) => { }
);

//logout route
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "Logged you out!!");
  res.redirect("/campgrounds");
});

//middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
