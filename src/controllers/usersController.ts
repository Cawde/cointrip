import { Request, Response, NextFunction } from 'express';
import { User } from '../models/users';
const jwt = require('jsonwebtoken');
const { JWT_SECRET, NODE_ENV } = process.env;
const {  
  createUser,
  getUser,
  getUserByEmail,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  deactivateUser
} = require('../models/users');

const { getAllTransactions } = require('../models/transactions');

async function getAllUsers_get(req: Request, res:Response, next:NextFunction) {
  try {
    const users = await getAllUsers();
    res.send({
      users,
    });
  } catch (e) {
    console.log(e);
  }
}

async function userDashboard_get(req: Request, res:Response, next:NextFunction) {
  const { userId } = req.params;
  try {
    const user = getUserById(userId);
    const userTransactions = getAllTransactions().filter(
      (transaction: { initiateId: string; recipientId: string }) =>
        transaction.initiateId === userId || transaction.recipientId === userId
    );

    res.send({
      user,
      userTransactions
    })
    
  } catch (e) {
    console.log(e)
  }
}

async function registerUser_post(req:Request, res:Response, next:NextFunction) {
  const {firstName, lastName, email, password }: User = req.body;
  try {
    const _user = await getUserByEmail(email);
    console.log(_user);
    if (_user) {
      next({
        name: 'UserExistsError',
        message: 'This email has already been used to register with Cointrip.'
      })
    } else {
      let profilePicture:string = 'https://imgur.com/uW4gXnS';

      const user = await createUser({
        firstName,
        lastName,
        email,
        password,
        profilePicture,
        isActive:true
      })

      const token = jwt.sign(
        {
          id: user.id,
        },
          JWT_SECRET,
        {
          expiresIn: '1w'
        }
      );

      res.cookie('token', token, {expires: new Date(Date.now() + 2 * 3600000), httpOnly: true});

      res.send({
        message: 'Thank you for registering with Cointrip!',
        token,
        userId: user.id,
        success: true
      });
    }
  } catch ({name, message}) {
    next({name, message});
  }
}

async function loginUser_post(req:Request, res:Response, next:NextFunction) {
  const { email, password }: User = req.body;

  if (!email || !password) {
    next({
      name: 'MissingCredentialsError',
      message: 'Please supply both a valid email and password'
    });
  }

  try {
    const user = await getUser({email, password})
      if (user && password) {
        const token = jwt.sign(
          {
            id: user.id,
          },
            JWT_SECRET,
          {
            expiresIn: '1w'
          }
        );

        res.cookie("token", token, {
          expires: new Date(Date.now() + 2 * 3600000),
          httpOnly: true,
          sameSite: NODE_ENV === 'production' ? true : 'none',
          secure: NODE_ENV === 'production' ? false : true,
        });
  
        res.send({
          message: 'Log in successful!',
          token: token,
          userId: user.id,
          success: true
        });
      } else {
        next({
          name: 'IncorrectCredentialsError',
          message: 'Email or password is incorrect.',
          success: false
        });
      }
    } catch (e) {
    next(e);
  }
}

async function updateUser_patch (req: Request, res:Response, next:NextFunction) {
  const { userId } = req.params;
  const { firstName, lastName, email, password, profilePicture, isActive }: User = req.body;

  try {
    const updatedUser = await updateUser({
      id: userId,
      firstName,
      lastName,
      email,
      password,
      profilePicture,
      isActive
    })

    res.send({
      message: 'Your account was successfully updated!',
      user: updatedUser
    })
  } catch (e) {
    next(e);
  }
}

async function deactivateUser_patch (req:Request, res:Response, next:NextFunction) {
  const { userId } = req.params;

  try {
    const deactivatedUser = await deactivateUser(userId);
    res.send({
      message: 'The account has been successfully deactivated.',
      deactivatedUser: deactivatedUser
    })
  } catch (e) {
    next(e);
  }
}

async function deleteUser_delete (req:Request, res:Response, next:NextFunction) {
  const { userId } = req.params;

  try {
    const deletedUser = await deleteUser(userId);
    res.send({
      message: 'User was successfully deleted',
      deletedUser: deletedUser
    })
  } catch (e) {
    next(e);
  }
}

module.exports = {
  getAllUsers_get,
  userDashboard_get,
  registerUser_post,
  loginUser_post,
  updateUser_patch,
  deactivateUser_patch,
  deleteUser_delete
}