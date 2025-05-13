// controllers/paymentController.js
const Stripe=require('stripe');
const mongoose=require('mongoose');
const Booking=require('../models/Booking.js');
const redisClient=require('../config/redisClient.js');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

exports.createCheckoutSession= async (req,res) =>{

    try {
        const { seats, flightId, totalPrice , userId } = req.body;
    
        // Create Stripe Checkout session
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          mode: 'payment',
          success_url: `${process.env.CLIENT_URL}/success`,
          cancel_url: `${process.env.CLIENT_URL}/cancel`,
          line_items: [
            {
              price_data: {
                currency: 'usd',
                product_data: {
                  name: `Flight Reservation: ${flightId}`,
                },
                unit_amount: totalPrice * 100, // in cents
              },
              quantity: 1,
            },
          ],
          metadata: {
            flightId,
            seats: JSON.stringify(seats),
            userId,
          },
        });
    
        return res.status(200).json({ url: session.url });
      } catch (error) {
        console.error('Stripe session error:', error);
        res.status(500).json({ error: 'Failed to create checkout session' });
      }
}


exports.handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Webhook verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    await confirmBooking(session);
  }

  res.status(200).json({ received: true });
}



const confirmBooking = async (session) => {
  try {
    const flightId = session.metadata.flightId;
    const userId=session.metadata.userId;
    const seats = JSON.parse(session.metadata.seats);

    // Extract total price from session
    const totalPrice = session.amount_total / 100;

    const newBooking = new Booking({
      userId,
      flightId,
      seats,
      totalPrice,
      paymentStatus: "paid",
      paymentDetails: {
        sessionId: session.id,
        paymentIntentId: session.payment_intent,
        customerEmail: session.customer_email,
        paymentMethodTypes: session.payment_method_types,
      },
    });

    await newBooking.save();

    // Remove locked seats from Redis
    for (const seat of seats) {
      await redisClient.del(`${flightId}:${seat}`);
    }

    console.log(`✅ Booking confirmed and saved for session ${session.id}`);
  } catch (err) {
    console.error('❌ Failed to confirm booking:', err);
  }
};
