import express from 'express';
import db from '../db/conn.js';
import { ObjectId } from 'mongodb';

const router = express.Router();

// ======= User document minimum requirements ====== //
/**
 * {
 *  "email": "test@test.com",
 *  "password": "password123",
 *  "username": "testuser1"
 * }
 */

// ============== CRUD Operations ====================== //

/**
 * Create a new user
 * POST /users/
 */
router.post('/', async (req, res) => {
  try {
    const collection = await db.collection('users');
    const newUser = req.body;
    const result = await collection.insertOne(newUser);
    res.status(201).json(result); // Return the full result, which includes insertedId, etc.
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
