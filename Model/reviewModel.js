const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User collection
    tourId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour', required: true }, // Reference to Tour collection
    reviewText: { type: String, required: true },
    rating: { type: Number, required: true },
    reviewTitle: { type: String, required: true },
    reviewDate: { type: Date, required: true }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
