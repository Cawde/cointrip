import { Request, Response, NextFunction } from 'express';
import { Transaction } from '../models/transactions';
const { DWOLLA_KEY, DWOLLA_SECRET } = process.env;
const {
  createTransaction,
  getAllTransactions
} = require('../models/transactions');
const Client = require("dwolla-v2").Client;
const dwolla = new Client({
  key: DWOLLA_KEY,
  secret: DWOLLA_SECRET,
  environment: "sandbox"
});



async function getAllTransactions_get (req:Request, res:Response, next:NextFunction) {
  try {
   const transactions = await getAllTransactions();
   res.send({transactions});

  } catch (e) {
    next(e);
  }
}

async function createTransaction_post (req:Request, res:Response, next:NextFunction) {
  const { initiateId, initiateName, initiateEmail, amount, recipientId, recipientEmail, recipientName, date, notes, initiateBankUrl, recipientBankUrl }: Transaction = req.body;

  try {
    const requestBody = {
      _links: {
        source: {
          href:
            initiateBankUrl,
        },
        destination: {
          href:
            recipientBankUrl,
        },
      },
      amount: {
        currency: "USD",
        value: `${amount}.00`,
      },
    };

    const transfer = await dwolla.post("transfers", requestBody).then((response: any) => response.headers.get("location"));
    const transaction = await createTransaction({initiateId, initiateName, initiateEmail, amount, recipientId, recipientEmail, recipientName, date, notes, details: transfer});

    res.send({
      message: 'Transaction successful!',
      transaction: transaction,
      transferUrl: transfer
    })
  } catch (e) {
    next(e);
  }
}

async function createVerifiedCustomer_post (req: Request, res:Response, next:NextFunction) {
  const { firstName, lastName, email, address1, city, state, postalCode, dateOfBirth, ssn } = req.body;
  try {
    const customerUrl = await dwolla
      .post("customers", {
        firstName,
        lastName,
        email,
        type: "personal",
        address1,
        city,
        state,
        postalCode,
        dateOfBirth,
        ssn
      })
      .then((response: any) => response.headers.get("location"));

    next({
      name: "Success",
      message: "User Verified!",
      customerUrl
    });

  } catch (e) {
    console.log(e);
    next({message: e});
  }
}

async function getFundingSourcesToken_post(req: Request, res:Response, next: NextFunction) {
  const { customerUrl } = req.body;

  try {
    const token = await dwolla.post(`${customerUrl}/funding-sources-token`).then((response: any) => response.body.token);
    
    next({
      name: "Success",
      message: "Funding sources token created!",
      token
    });
  } catch (e) {
    next({name: "FundingSourcesTokenError", message: e});
  }
}


module.exports = {
  getAllTransactions_get,
  createTransaction_post,
  createVerifiedCustomer_post,
  getFundingSourcesToken_post,
}