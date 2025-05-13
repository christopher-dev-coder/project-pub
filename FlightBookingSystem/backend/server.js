const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const adminRoutes=require('./routes/adminRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const authRoutes = require('./routes/authRoutes');
const bodyParser=require('body-parser');
dotenv.config();


const app = express();
app.post("/api/payments/webhook", bodyParser.raw({ type: "application/json" }), require("./controllers/paymentController").handleStripeWebhook);
connectDB();
app.use(express.json());
app.use(cors());
app.use('/api/auth', authRoutes);
app.use("/api/admin",adminRoutes);
app.use('/api/booking', bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.get("/", (req, res) => {
  res.send("Flight Booking API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
