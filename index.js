import express from 'express';
import dotenv from 'dotenv';
import usersRouter from './routes/users.js';
import commentsRouter from './routes/comments.js';
import reviewsRouter from './routes/reviews.js';


dotenv.config();

const PORT = process.env.PORT || 4000;

const app = express();

//! ====== MIDDLEWARE ======

app.use(express.json());

app.use((req, res, next) => {
  console.log('Request from url: ' + req.url);
  next();
});

//! ====== ROUTES ======

app.get('/', (req, res) => {
  res.send('Welcome to the SBA 319');
});

app.use('/users', usersRouter);
app.use('/comments', commentsRouter)
app.use('/reviews', reviewsRouter)

//! ====== GLOBAL HANDLING ======

app.use((err, _req, res, next) => {
  res.status(500).send('Server Error!');
});

//! ====== LISTENING PORT ======

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
