export {};
const client = require('./client');

export interface Transaction {
  initiateId: number;
  initiateName: string;
  initiateEmail: string;
  amount: number;
  recipientId: number;
  recipientName: string;
  recipientEmail: string;
  date: Date;
  notes: string;
  initiateBankUrl: string;
  recipientBankUrl: string;
  details: string;
}

async function createTransaction({initiateId, initiateName, initiateEmail, amount, recipientId, recipientName, recipientEmail, date, notes, details}: Transaction):Promise<any> {
  try {
    const { rows: [transaction] } = await client.query(`
      INSERT INTO transactions("initiateId", "initiateName", "initiateEmail", amount, "recipientId", "recipientName", "recipientEmail", date, notes, details)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
      `, [initiateId, initiateName, initiateEmail, amount, recipientId, recipientName, recipientEmail, date, notes, details]
    );

    return transaction;
  } catch (e) {
    throw e;
  }
}

async function getAllTransactions():Promise<any> {
  try {
    const { rows } = await client.query(`
      SELECT * 
      FROM transactions;
    `)
  return rows;
  } catch (e) {
    throw e;
  }
}

module.exports = {
  createTransaction,
  getAllTransactions
}