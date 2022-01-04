import { NextFunction } from "express";

const express = require('express');
const transactionsRouter = express.Router();
const { getAllTransactions_get, createTransaction_post, createVerifiedCustomer_post, createFundingSource_post, getFundingSourcesToken_post, createCardFundingSource_post, checkoutStripe_post, payoutStripe_post } = require('../controllers/transactionsController');

transactionsRouter.use((req: any, res:any, next:NextFunction) => {
  console.log('A request is being made to /transactions');
  next();
});

transactionsRouter.get('/', getAllTransactions_get);
transactionsRouter.post('/', createTransaction_post);
transactionsRouter.post('/create-customer', createVerifiedCustomer_post);
transactionsRouter.post('/create-funding-source', createFundingSource_post);
transactionsRouter.post('/funding-source-token', getFundingSourcesToken_post);
transactionsRouter.post('/add-card', createCardFundingSource_post);
// transactionsRouter.post('/checkout', checkoutStripe_post);
// transactionsRouter.post('/payout', payoutStripe_post)
module.exports = transactionsRouter;