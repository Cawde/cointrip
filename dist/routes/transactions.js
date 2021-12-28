"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const transactionsRouter = express.Router();
const { getAllTransactions_get, createTransaction_post } = require('../controllers/transactionsController');
transactionsRouter.use((req, res, next) => {
    console.log('A request is being made to /transactions');
    next();
});
transactionsRouter.get('/', getAllTransactions_get);
transactionsRouter.post('/', createTransaction_post);
module.exports = transactionsRouter;
