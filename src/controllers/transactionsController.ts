import { Request, Response, NextFunction } from 'express';
import { Transaction } from '../models/transactions';
const { STRIPE_KEY, DWOLLA_KEY, DWOLLA_SECRET } = process.env;
const {
  createTransaction,
  getAllTransactions
} = require('../models/transactions');
const stripe = require('stripe')(STRIPE_KEY);
const { uuidv4 } = require('uuid');
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

async function createCardFundingSource_post(req: Request, res: Response, next: NextFunction) {
  const { customerUrl } = req.body;
  try {
    const token = await dwolla.post(`${customerUrl}/card-funding-sources-token`).then((response: any) => response.body.token);

    next({name: "Card Token Generated", message: "Card token successfully generated!", token});
  } catch (e) {
    console.log(e);
    next(e);
  }
}

async function createFundingSource_post(req: Request, res:Response, next:NextFunction) {
  const { customerUrl, routingNumber, accountNumber, bankAccountType, name } = req.body;
  try {
    const fundingSource = await dwolla
      .post(`${customerUrl}/funding-sources`, {
        routingNumber,
        accountNumber,
        bankAccountType: "checking",
        name
      })
      .then((response: any) => response.headers.get("location"));
      
    next({
      name: "Success",
      message: "Funding source created!",
      fundingSource
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

// async function checkoutStripe_post(req: Request, res: Response, next: NextFunction) {
//   const { token, name, amount, notes } = req.body;
//   try {
//     const customer = await stripe.customers.create({
//       name: name,
//       email: token.email,
//       source: token.id
//     });

//     const idempotency_key = uuidv4();

//     const charge = await stripe.charges.create({
//       amount: amount * 100,
//       currency: "usd",
//       customer: customer.id,
//       receipt_email: token.email,
//       description: notes,
//       billing_details: {
//         name: token.card.name,
//         address: {
//           city: token.card.address_city,
//           country: token.card.address_country, 
//           line1: token.card.address_line1,
//           line2: token.card.address_line2,
//           postal_code: token.card.address_zip
//         }
//       }
//     }, {
//       idempotency_key
//     });

//     console.log("Charge: ", { charge });
//     res.send({message: "Success"})

//   } catch (e) {
//     console.error(e);
//     next({message: "Charge failed"})
//   }
// }

// async function payoutStripe_post(req: Request, res: Response, next: NextFunction) {
//   const { name, email, amount, cardNumber, cardMonth, cardYear, cardCVC } = req.body;
//   try {

//     const customer = await stripe.customers.create({
//       name: name,
//       email: email
//     });
//     console.log(email);
//     console.log("Customer: ", customer)
//     // const account = await stripe.accounts.create({
//     //   type: 'custom',
//     //   country: 'US',
//     //   email: email,
//     //   capabilities: {
//     //     card_payments: {requested: true},
//     //     transfers: {requested: true},
//     //   },
//     // });

//     const token = await stripe.tokens.create({
//       card: {
//         number: cardNumber,
//         exp_month: cardMonth,
//         exp_year: cardYear,
//         cvc: cardCVC
//       },
//     });

//     console.log("Token: ", token);

//     const card = await stripe.customers.createSource(
//       customer.id,
//       {source: token.id}
//     );

//     console.log("Card: ", card)

//     const payout = await stripe.payouts.create({
//       amount: amount,
//       currency: "usd",
//       destination: token.card.id
//     });
    
//     console.log("Token: ", { token });
//     console.log("Payout: ", { payout });
//   } catch (e) {
//     console.error(e);
//     next({message: "Payout failed"});
//   }

// }

module.exports = {
  getAllTransactions_get,
  createTransaction_post,
  createVerifiedCustomer_post,
  createFundingSource_post,
  getFundingSourcesToken_post,
  createCardFundingSource_post
  // checkoutStripe_post,
  // payoutStripe_post
}