import { NextFunction } from "express";

const express = require('express');
const transactionsRouter = express.Router();
const {
  createTransaction,
  getAllTransactions
} = require('../database/transactions');

transactionsRouter.use((req: any, res:any, next:NextFunction) => {
  console.log('A request is being made to /transactions');
  next();
});

transactionsRouter.get('/', async (req:any, res:any, next:NextFunction) => {
  try {
   const transactions = await getAllTransactions();
   res.send({transactions});

  } catch (e) {
    next(e);
  }
});

transactionsRouter.post('/', async (req:any, res:any, next:NextFunction) => {
  const { initiateId, recipientId, amount, date, notes} = req.body;

  try {
    const transaction = await createTransaction({initiateId, amount, recipientId, date, notes});

    res.send({
      message: "Transaction successful!",
      transaction: transaction
    })
  } catch (e) {
    next(e);
  }
})

module.exports = transactionsRouter;