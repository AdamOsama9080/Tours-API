const Review = require('../Model/reviewModel');
const User = require('../Model/registerModel');
const Tour = require('../Model/tourModel');

exports.postReview = async (req, res) => {
  try {
    const { userId, tourId, name, email, reviewTitle, reviewText, rating , guideRating, locationRating, cleanlinessRating, serviceRating, transportationRating } = req.body;

    const user = await User.findById(userId);
    const tour = await Tour.findById(tourId);
    if (!user || !tour) {
      return res.status(404).json({ message: 'User or Tour not found' });
    }

    const existingReview = await Review.findOne({ userId, tourId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already submitted a review for this tour' });
    }

    const newReview = new Review({
      userId: user._id,
      tourId: tour._id,
      reviewText,
      rating,
      reviewTitle, // You can add a default title or require it in the request
      email , 
      guideRating,
      locationRating,
      cleanlinessRating,
      serviceRating,
      transportationRating,
      reviewDate: new Date()
    });

    await newReview.save();

    tour.reviews.push(newReview._id);
    await tour.save();

    res.status(200).json({ message: 'Review submitted successfully', reviewId: newReview._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getReviewsByUserId = async (req, res) => {
  try {
      const { userId } = req.params;
      const reviews = await Review.find({ userId }).populate('userId', 'firstName lastName').select('_id reviewText rating reviewTitle userId');
  
      res.status(200).json(reviews);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
};

exports.getReviewsByTourId = async (req, res) => {
  try {
      const { tourId } = req.params;
      const reviews = await Review.find({ tourId }).populate('userId', 'firstName lastName').select('_id reviewText rating reviewTitle userId reviewDate');
  
      res.status(200).json(reviews);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
};

exports.getReviewDetailsByPostId = async (req, res) => {
  try {
    const { postId } = req.params;

    const review = await Review.findOne({ postId }).populate('userId', 'firstName lastName');

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const { firstName, lastName } = review.userId;

    const reviewDetails = {
      firstName,
      lastName,
      review: {
        reviewText: review.reviewText,
        rating: review.rating,
        reviewTitle: review.reviewTitle,
        reviewDate: review.reviewDate
      }
    };

    res.status(200).json(reviewDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const {userId,reviewId,name,email,reviewText,rating,reviewTitle,reviewDate,guideRating,locationRating,cleanlinessRating,serviceRating,transportationRating} = req.body;

    if (!userId || !reviewId) {
      return res.status(400).json({ message: 'Both userId and reviewId are required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.name = name || review.name;
    review.email = email || review.email;
    review.reviewText = reviewText || review.reviewText;
    review.rating = rating || review.rating;
    review.reviewTitle = reviewTitle || review.reviewTitle;
    review.reviewDate = reviewDate || review.reviewDate;
    review.guideRating = guideRating || review.guideRating;
    review.locationRating = locationRating || review.locationRating;
    review.cleanlinessRating = cleanlinessRating || review.cleanlinessRating;
    review.serviceRating = serviceRating || review.serviceRating;
    review.transportationRating = transportationRating || review.transportationRating;

    await review.save();

    res.status(200).json({ message: 'Review updated successfully', review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { userId, reviewId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.userId.toString() !== userId) {
      return res.status(403).json({ message: 'You are not authorized to delete this review' });
    }

    await Review.findByIdAndDelete(reviewId);

    await Tour.findByIdAndUpdate(review.tourId, {
      $pull: { reviews: reviewId }
    });

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
