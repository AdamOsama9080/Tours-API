const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }],
  title: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  startTime: String,
  endTime: String,
  duration: String,
  images: [{
    type: String
  }],
  mainImage: String,
  type: String,
  limitNumberOfTravelers: {
    type: Number,
    required: true
  },
  touristReservations: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    numberOfTravelers: {
      type: Number,
      default: 0
    }
  }],
  totalTravelers: {
    type: Number,
    default: 0,
  },
  emptyPlaces: {
    type: Number,
    required: true
  },
  highlights: [String],
  details: String,
  included: [String],
  excluded: [String],
  program: [String],
  latitude: Number,
  longitude: Number,
  discountPercentage: {
    type: Number,
    default: 0
  },
  discountStartDate: Date,
  discountEndDate: Date
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;