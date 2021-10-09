const mongoose=require('mongoose')
const AdminSchema=new mongoose.Schema({
    username:String,
    password:String
})
AdminSchema.plugin(psssportLocalMongoose);
module.exports=new mongoose.model("Admin",AdminSchema)

