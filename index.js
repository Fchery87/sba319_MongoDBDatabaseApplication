import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import morgan from 'morgan';
import usersRouter from './routes/users.js';
import moviesRouter from './routes/movies.js';
import reviewsRouter from './routes/reviews.js';

dotenv.config();

mongoose.connect(process.env.ATLAS_URI);

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(morgan('dev'));
app.use(express.json());

app.use((req, res, next) => {
  console.log('Request from url: ' + req.url);
  next();
});

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Movie Review App');
});

app.use('/users', usersRouter);
app.use('/movies', moviesRouter);
app.use('/reviews', reviewsRouter);

// Global error handler
app.use((err, _req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Server Error!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
