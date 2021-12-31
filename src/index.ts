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


//CHANGE ORIGIN ON PROJECT COMPLETION!!!!!!!
const cors = require('cors');
server.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  methods: "GET, POST, PATCH, DELETE",
  headers: "Origin, Content-Type, Authorization"

}));

const apiRouter = require('./routes');
server.use('/api', apiRouter);

const client = require('./models/client');

server.listen(PORT, function () {
  console.log(`Server running on port: ${PORT}`);
  client.connect();
});
