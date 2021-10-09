const express=require('express')
const router=express.Router()
const busController=require('../controllers/busController')
const auth=require('../controllers/auth')
router.get("/newBus",auth.isLoggedIn,busController.newBus_get)
router.post("/newBus",auth.isLoggedIn,busController.newBus_post)

module.exports=router