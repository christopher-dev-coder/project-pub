const Flight = require('../models/Flight');

// Generate seats based on row/column config
function generateSeats(rows, columns, defaultPrice) {
  const seats = [];
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      seats.push({
        seatNumber: `${alphabet[i]}${j + 1}`,
        price: defaultPrice,
        isBooked: false,
        lockedUntil: null,
      });
    }
  }

  return seats;
}

// Add new flight
exports.addFlight = async (req, res) => {
  try {
    const {
      agency,
      airplaneModel,
      departure,
      arrival,
      rows,
      columns,
      defaultSeatPrice,
    } = req.body;

    const seats = generateSeats(rows, columns, defaultSeatPrice);

    const newFlight = new Flight({
      agency,
      airplaneModel,
      departure,
      arrival,
      seats,
    });

    await newFlight.save();

    return res.status(201).json({
      message: 'Flight created successfully',
      flight: newFlight,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error creating flight' });
  }
};
