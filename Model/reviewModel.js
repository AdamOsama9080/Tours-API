const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tourId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour', required: true },
    name: { type: String },
    email: { type: String, required: true }, 
    reviewText: { type: String, required: true },
    rating: { type: Number, required: true },
    reviewTitle: { type: String, required: true },
    reviewDate: { type: Date, required: true },
    guideRating: { type: Number, required: true },
    locationRating: { type: Number, required: true },
    cleanlinessRating: { type: Number, required: true },
    serviceRating: { type: Number, required: true },
    transportationRating: { type: Number, required: true }
});


const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
