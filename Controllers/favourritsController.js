const Favourits = require('../Model/favouritsModel');
const User = require('../Model/registerModel');
const Tour = require('../Model/tourModel');
const Booking = require('../Model/bookingModel');

exports.addFavourit = async (req, res) => {
    try {
        const { userId, tourId } = req.body;

        const userExists = await User.exists({ _id: userId });
        if (!userExists) {
            return res.status(404).json({ message: 'User not found' });
        }

        const tourExists = await Tour.exists({ _id: tourId });
        if (!tourExists) {
            return res.status(404).json({ message: 'Tour not found' });
        }

        const existingFavourit = await Favourits.findOne({ user: userId, tour: tourId });
        if (existingFavourit) {
            return res.status(400).json({ message: 'You have already favorited this tour' });
        }

        const favourit = new Favourits({
            user: userId,
            tour: tourId
        });

        await favourit.save();

        const existingBooking = await Booking.findOne({ user: userId, tour: tourId });
        if (existingBooking) {
            existingBooking.isFavorite = true;
            await existingBooking.save();
        }

        res.status(200).json({ message: 'Favorite added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

exports.getFavouritsbyUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const favourits = await Favourits.find({ user: userId }).populate('tour');
        res.status(200).json(favourits);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

exports.removeFavourit = async (req, res) => {
    try {
        const { userId, tourId } = req.body;

        const userExists = await User.exists({ _id: userId });
        if (!userExists) {
            return res.status(404).json({ message: 'User not found' });
        }

        const tourExists = await Tour.exists({ _id: tourId });
        if (!tourExists) {
            return res.status(404).json({ message: 'Tour not found' });
        }

        const existingFavourit = await Favourits.findOne({ user: userId, tour: tourId });
        if (!existingFavourit) {
            return res.status(404).json({ message: 'Favorit not found' });
        }

        await Favourits.findOneAndDelete({ user: userId, tour: tourId });

        // Check if the booking exists and update the isFavorite field
        const existingBooking = await Booking.findOne({ user: userId, tour: tourId });
        if (existingBooking) {
            existingBooking.isFavorite = false;
            await existingBooking.save();
        }

        res.status(200).json({ message: 'Favorit removed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

