const mongoose = require("mongoose");
const PassengerSchema = new mongoose.Schema({
  name: String,
  id: String,
  email: String,
  phno: Number,
  boardingpt: String,
  routeno: String,
  type: String,
  status: {
    type: String,
    enum:['Active','Inactive','Expired'],
    default:'Active'
  },
  paymentDetails:{
    orderId: String,
    paymentId: String,
    status: String,
    time:Date,
    amt: String,
  }
});
module.exports = new mongoose.model("Passenger", PassengerSchema);
