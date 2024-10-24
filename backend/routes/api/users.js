/*
the routes/api directory is used to define the API routes for the application. 
These routes specify how the server should respond to various HTTP requests (like GET, POST, PUT, DELETE) made by the client.
*/

import express from 'express';
const router = express.Router();
import userController from '../../controllers/userController.js'

/*----------Public Routes-----------*/
router.post('/signup', userController.signup);
router.post('/login', userController.login);

/*---------- Protected Routes ----------*/

export default router;