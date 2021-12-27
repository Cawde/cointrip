import { Request, Response, NextFunction } from "express";

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
}

module.exports = {
  getAllTransactions_get,
  createTransaction_post
}