import { NextFunction } from "express";

const express = require('express');
const usersRouter = express.Router();
const { getAllUsers_get, userDashboard_get, registerUser_post, loginUser_post, updateUser_patch, deactivateUser_patch, deleteUser_delete } = require('../controllers/usersController');
const authenticateCookie = require('../utils/authenticateCookie');

usersRouter.use((req: any, res:any, next:NextFunction) => {
  console.log('A request is being made to /users');
  next();
});

usersRouter.get('/', getAllUsers_get);
usersRouter.get('/dashboard/:userId', authenticateCookie, userDashboard_get);
usersRouter.post('/register', registerUser_post);
usersRouter.post('/login', loginUser_post);
usersRouter.patch('/:userId', updateUser_patch);
usersRouter.patch('/deactivate/:userId', deactivateUser_patch)
usersRouter.delete('/:userId', deleteUser_delete);

module.exports = usersRouter;