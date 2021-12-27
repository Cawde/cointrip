require('dotenv').config();
const PORT = process.env.PORT || 5000;

import express from 'express';
const server = express();

const morgan = require("morgan");
server.use(morgan("dev"));

const bodyParser = require("body-parser");
server.use(bodyParser.urlencoded({extended: true}));
server.use(bodyParser.json());

const cors = require('cors');
server.use(cors());

const apiRouter = require('./routes');
server.use('/api', apiRouter);

const client = require('./models/client');

server.listen(PORT, function () {
  console.log(`Server running on port: ${PORT}`);
  client.connect();
});
