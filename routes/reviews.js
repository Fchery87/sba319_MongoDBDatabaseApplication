import express from 'express';
import {
  createReview,
  getAllReviews,
  getReviewById,
  getReviewsByMovieId,
  updateReviewById,
  deleteReviewById
} from '../controllers/reviewController.js';

const router = express.Router();

router.post('/', createReview);
router.get('/', getAllReviews);
router.get('/:id', getReviewById);
router.get('/movie/:movieId', getReviewsByMovieId); // New route to get reviews by movie ID
router.put('/:id', updateReviewById);
router.delete('/:id', deleteReviewById);

export default router;
