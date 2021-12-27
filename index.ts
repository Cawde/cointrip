require('dotenv').config();
const { PORT = 3000 } = process.env;

import express, {Application, Request, Response, NextFunction } from 'express';
const server = express();

const morgan = require("morgan");
server.use(morgan("dev"));

const bodyParser = require("body-parser");
server.use(bodyParser.urlencoded({extended: true}));
server.use(bodyParser.json());

const cors = require('cors');
server.use(cors());

const apiRouter = require('./api');
server.use('/api', apiRouter);

const client = require('./database/client');


// server.use((error:any, req:Request, res:any, next:NextFunction) => {
//   console.error("SERVER ERROR: ", error);
//   if (res.statusCode < 400) res.status(500);
//   res.send({
//     error: error.message,
//     name: error.name,
//     message: error.message,
//     table: error.table,
//   });
// });

server.listen(PORT, function () {
  console.log(`Server running on port: ${PORT}`);
  client.connect();
});
