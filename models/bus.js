const mongoose = require("mongoose");
const BusSchema = new mongoose.Schema({
  regno: {
    type: String,
    required: true,
    unique: true,
  },
  routeno: {
    type: String,
    required: true,
    unique: true,
  },
  totalseats: {
    type: Number,
    required: true,
  },
});
module.exports = new mongoose.model("Bus", BusSchema);
