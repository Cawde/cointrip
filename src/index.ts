require('dotenv').config();
import express from 'express';
const { PORT = 5000, NODE_ENV } = process.env;

const server = express();

const cookieParser = require('cookie-parser');
server.use(cookieParser());

const morgan = require('morgan');
server.use(morgan('dev'));

const bodyParser = require('body-parser');
server.use(bodyParser.urlencoded({extended: true}));
server.use(bodyParser.json());


//CHANGE ORIGIN ON PROJECT COMPLETION FROM TEST TO PRODUCTION!!!!!!!
const cors = require('cors');
const corsOptions = {
  origin: NODE_ENV === 'production' ? 'https://fierce-sea-46269.herokuapp.com/' : 'http://localhost:3000',
  credentials: true,
  methods: 'GET, POST, PATCH, DELETE',
  headers: 'Origin, Content-Type, Authorization'
}
server.use(cors(corsOptions));

const apiRouter = require('./routes');
server.use('/api', apiRouter);

const client = require('./models/client');

server.listen(PORT, function () {
  console.log(`Server running on port: ${PORT}`);
  client.connect();
});
