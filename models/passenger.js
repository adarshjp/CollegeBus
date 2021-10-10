const mongoose = require("mongoose");
const PassengerSchema = new mongoose.Schema({
  name: String,
  id: String,
  email: String,
  phone: Number,
  boardingpt: String,
  routeno: String,
  type: String,
});
module.exports = new mongoose.model("Passenger", PassengerSchema);
