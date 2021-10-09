const express = require("express");
const router = express.Router();
const auth = require("../controllers/auth");
const adminController = require("../controllers/adminController");

router.get("/view", auth.isLoggedIn, adminController.viewGet);
router.post("/view", auth.isLoggedIn, adminController.viewPost);
router.get("/view/:id", auth.isLoggedIn, adminController.viewOne);
router.get("/admin", auth.isLoggedIn, adminController.home);

module.exports = router;
