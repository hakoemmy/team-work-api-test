import express from 'express';
import UserController from '../controllers/userController';


const router = express.Router();
// Creation of Controller Object
const userController = new UserController();

// POST /auth/signup
// Create user account
router.post('/signup', userController.signUp);
// POST /auth/signin
// Login a user
router.post('/signin', userController.signIn);

export default router;
