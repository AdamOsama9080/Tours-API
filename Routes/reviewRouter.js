const express = require('express');
const router = express.Router();
const reviewController = require('../Controllers/reviewController');

router.post('/review', reviewController.postReview);
router.get('/reviews/:userId', reviewController.getReviewsByUserId);
router.get('/reviews/tour/:tourId', reviewController.getReviewsByTourId);
router.get('/review/:postId', reviewController.getReviewDetailsByPostId);
router.put('/review', reviewController.updateReview);
router.delete('/review', reviewController.deleteReview);

module.exports = router;
