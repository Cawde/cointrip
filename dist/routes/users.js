"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const usersRouter = express.Router();
const { getAllUsers_get, registerUser_post, loginUser_post, updateUser_patch, deactivateUser_patch, deleteUser_delete } = require('../controllers/usersController');
usersRouter.use((req, res, next) => {
    console.log('A request is being made to /users');
    next();
});
usersRouter.get('/', getAllUsers_get);
usersRouter.post('/register', registerUser_post);
usersRouter.post('/login', loginUser_post);
usersRouter.patch('/:userId', updateUser_patch);
usersRouter.patch('/deactivate/:userId', deactivateUser_patch);
usersRouter.delete('/:userId', deleteUser_delete);
module.exports = usersRouter;
