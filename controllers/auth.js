const Admin = require("../models/admin");
const passport = require("passport");

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
};

exports.registerGet = (req, res) => {
  res.render("register");
};

exports.registerPost = (req, res) => {
  var newUser = new Admin({ username: req.body.username });
  Admin.register(newUser, req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, function () {
      res.redirect("/admin");
    });
  });
};

exports.loginGet = (req, res) => {
  res.render("login");
};

exports.loginPost = (req, res) => {};

exports.logout = (req, res) => {
  req.logout();
  res.redirect("/admin");
};
