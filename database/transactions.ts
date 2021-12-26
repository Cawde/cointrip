export {};
const client = require('./client');

async function createTransaction({initiateId, amount, recipientId, date, notes}: any) {
  try {
    const { rows: [transaction] } = await client.query(
      `
        INSERT INTO transactions(initiateId, amount, recipientId, date, notes)
        VALUES($1, $2, $3, $4, $5)
        RETURNING *;
      `, [initiateId, amount, recipientId, date, notes]
    );
    return transaction;
  } catch (e) {
    throw e;
  }
}

async function getTransactionsByInitiateOrRecipientId(id:number) {
  try {
    const { rows } = await client.query(`
      SELECT * FROM transactions
      WHERE "initiateId"=$1
      OR "recipientId"=$1;
    `,[id])

    return rows;
  } catch (e) {
    throw e;
  }
}

module.exports = {
  createTransaction,
  getTransactionsByInitiateOrRecipientId
}