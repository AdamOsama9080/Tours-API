const Favourits = require('../Model/favouritsModel');
const User = require('../Model/registerModel');
const Tour = require('../Model/tourModel');

exports.addFavourit = async (req, res) => {
    try {
        const { userId, tourId } = req.body;

        const existingFavourit = await Favourits.findOne({ user: userId, tour: tourId });
        if (existingFavourit) {
            return res.status(400).json({ message: 'You have already favorited this tour' });
        }

        const favourit = new Favourits({
            user: userId,
            tour: tourId
        });

        await favourit.save();

        res.status(200).json({ message: 'Favorit added successfully' });
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
        const existingFavourit = await Favourits.findOne({ user: userId, tour: tourId });
        if (!existingFavourit) {
            return res.status(404).json({ message: 'Favorit not found' });
        }
        await Favourits.findOneAndDelete({ user: userId, tour: tourId });
        res.status(200).json({ message: 'Favorit removed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};
