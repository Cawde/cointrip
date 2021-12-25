require('dotenv').config();
const { PORT = 3000 } = process.env;

import express, {Application, Request, Response, NextFunction } from 'express';
const server: Application = express();

const morgan = require("morgan");
server.use(morgan("dev"));

const bodyParser = require("body-parser");
server.use(bodyParser.json());

const cors = require('cors');
server.use(cors());

const apiRouter = require('./api');
server.use('/api', apiRouter);

const client = require('./db/client');

server.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('Hello');
});


server.listen(PORT, (): void => console.log('Server running'));
