import express from 'express';
import {
  createReview,
  getAllReviews,
  getReviewById,
  updateReviewById,
  deleteReviewById
} from '../controllers/reviewController.js';

const router = express.Router();

router.post('/', createReview);
router.get('/', getAllReviews);
router.get('/:id', getReviewById);
router.put('/:id', updateReviewById);
router.delete('/:id', deleteReviewById);

export default router;
