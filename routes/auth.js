const express = require("express");
const passport = require("passport");
const router = express.Router();
const auth = require("../controllers/auth");
router.get("/register", auth.registerGet);
router.post("/register", auth.registerPost);
router.get("/login", auth.loginGet);
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/admin",
    failureRedirect: "/login",
  })
);
router.get("/logout", auth.logout);

module.exports = router;
