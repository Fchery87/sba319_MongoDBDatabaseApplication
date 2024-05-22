import express from 'express';
import {
  createMovie,
  getAllMovies,
  getMovieById,
  updateMovieById,
  deleteMovieById
} from '../controllers/movieController.js';

const router = express.Router();

router.post('/', createMovie);
router.get('/', getAllMovies);
router.get('/:id', getMovieById);
router.put('/:id', updateMovieById);
router.delete('/:id', deleteMovieById);

export default router;
