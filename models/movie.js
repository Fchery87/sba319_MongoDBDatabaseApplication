import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  releaseDate: { type: Date, required: true },
  genre: { type: String },
  director: { type: String },
  imageUrl: { type: String }
});

const Movie = mongoose.model('Movie', movieSchema);

export default Movie;
