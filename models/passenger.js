const mongoose = require("mongoose");
const PassengerSchema = new mongoose.Schema({
  name: String,
  id: String,
  email: String,
  phone: Number,
  boardingpt: String,
  routeno: String,
  type: String,
  status: String,
  paymentDetails:{
    orderId: String,
    paymentid: String,
    status: String,
    time:Date,
    amt: String,
  }
});
module.exports = new mongoose.model("Passenger", PassengerSchema);
