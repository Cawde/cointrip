export {};
const client = require('./client');

async function createTransaction({initiateId, amount, recipientId, date, notes}: any):Promise<any> {
  try {
    const { rows: [transaction] } = await client.query(
      `
        INSERT INTO transactions("initiateId", amount, "recipientId", date, notes)
        VALUES($1, $2, $3, $4, $5)
        RETURNING *;
      `, [initiateId, amount, recipientId, date, notes]
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