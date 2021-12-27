"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const { PORT = 3000 } = process.env;
const express_1 = __importDefault(require("express"));
const server = (0, express_1.default)();
const morgan = require("morgan");
server.use(morgan("dev"));
const bodyParser = require("body-parser");
server.use(bodyParser.urlencoded({ extended: true }));
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
