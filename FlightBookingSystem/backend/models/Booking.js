const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  flightId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Flight",
  },
  seats: [String], 
  totalPrice: Number,
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending",
  },
  paymentDetails: {
    type: Object,
  },
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
