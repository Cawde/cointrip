import { Request, Response, NextFunction } from 'express';
import { Transaction } from '../models/transactions';
const { STRIPE_KEY } = process.env;
const {
  createTransaction,
  getAllTransactions
} = require('../models/transactions');
const stripe = require('stripe')( STRIPE_KEY );
const { uuidv4 } = require('uuid');



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

async function checkout_post(req: Request, res: Response, next: NextFunction) {
  const { token, name, amount, notes } = req.body
  try {
    const customer = await stripe.customers.create({
      name: name,
      email: token.email,
      source: token.id
    });

    const idempotency_key = uuidv4();

    const charge = await stripe.charges.create({
      amount: amount * 100,
      currency: "usd",
      customer: customer.id,
      receipt_email: token.email,
      description: notes,
      shipping: {
        name: token.card.name,
        address: {
          line1: token.card.address_line1,
          line2: token.card.address_line2,
          city: token.card.address_city,
          country: token.card.address_country, 
          postal_code: token.card.address_zip
        }
      }
    }, {
      idempotency_key
    });

    console.log("Charge: ", { charge });
    res.send({message: "Success"})

  } catch (e) {
    console.error(e);
    next({message: "Failure"})
  }
}

module.exports = {
  getAllTransactions_get,
  createTransaction_post,
  checkout_post
}