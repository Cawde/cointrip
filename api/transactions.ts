import { NextFunction } from "express";

const express = require('express');
const transactionsRouter = express.Router();
const {
  createTransaction,
  getTransactionsByInitiateOrRecipientId
} = require('../database/transactions');

transactionsRouter.get('/', async (req:any, res:any, next:NextFunction) => {
  const { id } = req.body;
  try {
   const transactions = await getTransactionsByInitiateOrRecipientId(id);
   res.send(transactions);

  } catch (e) {
    next(e);
  }
});

transactionsRouter.post('/:userId', async (req:any, res:any, next:NextFunction) => {
  const { userId } = req.params;
  const { recipientId, amount, date, notes} = req.body;

  try {
    const transaction = await createTransaction({initiateId: userId, amount, recipientId, date, notes});

    res.send({
      message: "Transaction successful!",
      transaction: transaction
    })
  } catch (e) {
    next(e);
  }
})