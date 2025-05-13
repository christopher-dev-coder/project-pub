const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema({
  seatNumber: String,
  price: Number,
  isBooked: {
    type: Boolean,
    default: false,
  },
  lockedUntil: Date, 
});

const flightSchema = new mongoose.Schema({
  agency: {
    type: String,
    required: true,
  },
  airplaneModel: {
    type: String,
    required: true,
  },
  departure: {
    location: String,
    time: Date,
  },
  arrival: {
    location: String,
    time: Date,
  },
  seats: [seatSchema],
});

module.exports = mongoose.model("Flight", flightSchema);
