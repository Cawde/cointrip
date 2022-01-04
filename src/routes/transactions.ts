import { NextFunction } from "express";

const express = require('express');
const transactionsRouter = express.Router();
const { getAllTransactions_get, createTransaction_post, createVerifiedCustomer_post, getFundingSourcesToken_post} = require('../controllers/transactionsController');

transactionsRouter.use((req: any, res:any, next:NextFunction) => {
  console.log('A request is being made to /transactions');
  next();
});

transactionsRouter.get('/', getAllTransactions_get);
transactionsRouter.post('/', createTransaction_post);
transactionsRouter.post('/create-customer', createVerifiedCustomer_post);
transactionsRouter.post('/funding-source-token', getFundingSourcesToken_post);

module.exports = transactionsRouter;