const express = require("express");
const router = express.Router();
const auth=require('../controllers/auth')
const boardingpt=require('../controllers/boardingpointController')
router.get('/newBoardingpoint',auth.isLoggedIn,boardingpt.newBoardingpoint_get)
router.post('/newBoardingpoint',auth.isLoggedIn,boardingpt.newBoardingpoint_post)

module.exports=router