const Flight = require('../models/Flight');
const redisClient = require('../config/redisClient');

// Lock selected seats
exports.lockSeats = async (req, res) => {
  const { flightId, seatNumbers, userId } = req.body;

  try {
    // Check if seats are already locked
    for (const seat of seatNumbers) {
      const lockKey = `lock:${flightId}:${seat}`;
      const isLocked = await redisClient.get(lockKey);
      if (isLocked) {
        return res.status(400).json({ message: `Seat ${seat} is already locked or reserved.` });
      }
    }

    // Lock seats for 10 minutes
    for (const seat of seatNumbers) {
      const lockKey = `lock:${flightId}:${seat}`;
      await redisClient.setEx(lockKey, 600, userId); // 10 minutes = 600 seconds
    }

    return res.status(200).json({ message: 'Seats locked for 10 minutes' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error locking seats' });
  }
};


// exports.confirmBooking = async (req, res) => {
//     const { flightId, seatNumbers, userId } = req.body;
  
//     try {
//       const flight = await Flight.findById(flightId);
  
//       if (!flight) return res.status(404).json({ message: 'Flight not found' });
  
//       for (const seat of seatNumbers) {
//         const lockKey = `lock:${flightId}:${seat}`;
//         const lockedBy = await redisClient.get(lockKey);
  
//         if (lockedBy !== userId) {
//           return res.status(403).json({ message: `Seat ${seat} not locked by this user` });
//         }
  
//         // Update seat as booked
//         const seatObj = flight.seats.find((s) => s.seatNumber === seat);
//         seatObj.isBooked = true;
//       }
  
//       await flight.save();
  
//       // Remove seat locks
//       for (const seat of seatNumbers) {
//         await redisClient.del(`lock:${flightId}:${seat}`);
//       }
  
//       return res.status(200).json({ message: 'Booking confirmed!' });
//     } catch (err) {
//       console.error(err);
//       return res.status(500).json({ message: 'Error confirming booking' });
//     }
//   };
  
