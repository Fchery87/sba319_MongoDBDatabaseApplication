import Movie from '../models/movie.js';

// Create a new movie
export const createMovie = async (req, res) => {
  try {
    const newMovie = new Movie(req.body);
    const result = await newMovie.save();
    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating movie:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create bulk movies
export const createBulkMovies = async (req, res) => {
  try {
    const movies = req.body;
    const result = await Movie.insertMany(movies);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating bulk movies:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all movies
export const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find({});
    res.status(200).json(movies);
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a single movie by ID
export const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      res.status(404).json({ message: 'Movie not found' });
    } else {
      res.status(200).json(movie);
    }
  } catch (error) {
    console.error('Error fetching movie:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a movie by ID
export const updateMovieById = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!movie) {
      res.status(404).json({ message: 'Movie not found' });
    } else {
      res.status(200).json(movie);
    }
  } catch (error) {
    console.error('Error updating movie:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a movie by ID
export const deleteMovieById = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      res.status(404).json({ message: 'Movie not found' });
    } else {
      res.status(200).json({ message: 'Movie deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting movie:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
