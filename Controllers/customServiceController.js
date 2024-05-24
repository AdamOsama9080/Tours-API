const User  = require(`../Model/registerModel`) ;
const Booking = require (`../Model/bookingModel`) ;

exports.getDetails = async (req, res) => {
    const { input } = req.body; // Change to req.body to handle POST request
    if (!input) {
      return res.status(400).json({ error: 'Input is required' });
    }
  
    try {
      if (/^\d+$/.test(input)) {
        // If input is a number, treat it as tripCode
        const booking = await Booking.findOne({ tripCode: input }).populate('user', 'firstName lastName email');
        if (!booking) {
          return res.status(404).json({ error: 'Booking not found' });
        }
  
        const user = booking.user;
        return res.json({ booking, user });
      } else {
        // If input is not a number, treat it as email
        const user = await User.findOne({ email: input }, 'firstName lastName email');
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
  
        const bookings = await Booking.find({ user: user._id });
        return res.json({ user, bookings });
      }
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

