import { Request, Response, NextFunction } from 'express';
import { Transaction } from "../models/transactions";
const {
  createTransaction,
  getAllTransactions
} = require('../models/transactions');


async function getAllTransactions_get (req:Request, res:Response, next:NextFunction) {
  try {
   const transactions = await getAllTransactions();
   res.send({transactions});

  } catch (e) {
    next(e);
  }
}

async function createTransaction_post (req:Request, res:Response, next:NextFunction) {
  const { initiateId, initiateName, initiateEmail, amount, recipientId, recipientEmail, recipientName, date, notes }: Transaction = req.body;

  try {
    const transaction = await createTransaction({initiateId, initiateName, initiateEmail, amount, recipientId, recipientEmail, recipientName, date, notes});

    res.send({
      message: 'Transaction successful!',
      transaction: transaction
    })
  } catch (e) {
    next(e);
  }
}

module.exports = {
  getAllTransactions_get,
  createTransaction_post
}