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
}

async function createTransaction({initiateId, initiateName, initiateEmail, amount, recipientId, recipientName, recipientEmail, date, notes}: Transaction):Promise<any> {
  try {
    const { rows: [transaction] } = await client.query(`
      INSERT INTO transactions("initiateId", "initiateName", "initiateEmail", amount, "recipientId", "recipientName", "recipientEmail", date, notes)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
      `, [initiateId, initiateName, initiateEmail, amount, recipientId, recipientName, recipientEmail, date, notes]
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