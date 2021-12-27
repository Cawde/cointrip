import express, {Request, Response, NextFunction } from 'express';
const apiRouter = express.Router();
const { getUserById } = require('../database/users');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

apiRouter.use(async (req:any, res: Response, next:NextFunction) => {
  const prefix = 'Bearer ';
  const auth = req.header('Authorization');

  if(!auth) {
    next();
  } else if (auth.startsWith(prefix)) {
    
    const token = auth.slice(prefix.length);

    try {
      const { id } = jwt.verify(token, JWT_SECRET);
      
      if (id) {
        req.user = await getUserById(id);
        next();
      }
    } catch ({name, message}) {
      next({name, message})
    }
  } else {
    next({
      name: 'AuthorizationHeaderError',
      message: `Authorization token must start with ${prefix}`
    });
  }
});

apiRouter.use((req: any, res: Response, next: NextFunction) => {
  if (req.user) {
    console.log('User is set as: ', req.user);
  }

  next();
});

const usersRouter = require('./users');
apiRouter.use('/users', usersRouter);

const transactionsRouter = require('./transactions');
apiRouter.use('/transactions', transactionsRouter);

apiRouter.use((error:Error, req:Request, res:Response, next:NextFunction) => {
  res.send(error);
})

module.exports = apiRouter;