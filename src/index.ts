require('dotenv').config();
import express from 'express';
const PORT = process.env.PORT || 5000;

const server = express();

const cookieParser = require('cookie-parser');
server.use(cookieParser());

const morgan = require("morgan");
server.use(morgan("dev"));

const bodyParser = require("body-parser");
server.use(bodyParser.urlencoded({extended: true}));
server.use(bodyParser.json());

const cors = require('cors');
server.use(cors({
  origin: "https://fierce-sea-46269.herokuapp.com",
  credentials: true
}));

const apiRouter = require('./routes');
server.use('/api', apiRouter);

const client = require('./models/client');

server.listen(PORT, function () {
  console.log(`Server running on port: ${PORT}`);
  client.connect();
});
