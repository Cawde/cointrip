import { NextFunction } from "express";
import { ReplOptions } from "repl";

const express = require('express');
const usersRouter = express.Router();
const jwt = require('jsonwebtoken');
const {  
  createUser,
  getUser,
  getUserByEmail,
  getAllUsers,
  updateUser,
  deleteUser,
  deactivateUser
} = require('../database/users');

usersRouter.use((next:NextFunction) => {
  console.log('A request is being made to /users');

  next();
});

usersRouter.get('/', async (res: any) => {
  try {
    const users = await getAllUsers();
    res.send({
      users
    });
  } catch (e) {
    console.log(e);
  }
})

usersRouter.post('/register', async (req:any, res:any, next:NextFunction) => {
  const {firstName, lastName, email, password } = req.body;

  try {

    const _user = await getUserByEmail(email);

    if (_user) {
      next({
        name: "UserExistsError",
        message: "This email has already been used to register with Cointrip."
      })
    } else {
      let profilePicture:string = './images/coin.png';
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
          userFullName: `${user.firstName} ${user.lastName}`,
          email: user.email
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '1w'
        }
      );

      res.send({
        message: "Thank you for registering with Cointrip!",
        token,
        userId: user.id
      });
    }
  } catch ({name, message}) {
    next({name, message});
  }
})

usersRouter.post('/login', async (req:any, res:any, next:NextFunction) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a valid email and password"
    });
  }

  try {
    const user = await getUser({email, password})
      if (user && password) {
        const token = jwt.sign(
          {
            id: user.id,
            userFullName: `${user.firstName} ${user.lastName}`,
            email: user.email
          },
          process.env.JWT_SECRET,
          {
            expiresIn: '1w'
          }
        );
  
        res.send({
          message: "Log in successful!",
          token: token,
          userId: user.id
        });
      } else {
        next({
          name: "IncorrectCredentialsError",
          message: "Email or password is incorrect."
        });
      }
    } catch (e) {
    next(e);
  }
});

usersRouter.patch('/:userId', async (req: any, res:any, next:NextFunction) => {
  const { userId } = req.params;
  const { firstName, lastName, email, password, profilePicture, isActive } = req.body;

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
      message: "Your account was successfully updated!",
      user: updatedUser
    })
  } catch (e) {
    next(e);
  }
});

usersRouter.patch('/:userId', async (req:any, res:any, next:NextFunction) => {
  const { userId } = req.params;

  try {
    const deactivatedUser = await deactivateUser(userId);
    res.send({
      message: "The account has been successfully deactivated.",
      deactivatedUser: deactivatedUser
    })
  } catch (e) {
    next(e);
  }
})

usersRouter.delete('/:userId', async (req:any, res:any, next:NextFunction) => {
  const { userId } = req.params;

  try {
    const deletedUser = await deleteUser(userId);
    res.send({
      message: "User was successfully deleted",
      deletedUser: deletedUser
    })
  } catch (e) {
    next(e);
  }
});

module.exports = usersRouter;