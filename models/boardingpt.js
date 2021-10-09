const mongoose=require('mongoose')
const BoardingptSchema=new mongoose.Schema({
    routeno:{
        type:String,
        required:true
    },
    boardingpt:{
        type:String,
        required:true,
        unique:true
    },
    price:{
        type:Number,
        required:true
    }
})
module.exports=new mongoose.model("Boardingpt",BoardingptSchema)
