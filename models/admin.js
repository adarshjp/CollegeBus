const mongoose = require("mongoose");
passportLocalMongoose = require("passport-local-mongoose");
const AdminSchema = new mongoose.Schema({
  username: String,
  password: String,
});
AdminSchema.plugin(passportLocalMongoose);
module.exports = new mongoose.model("Admin", AdminSchema);
