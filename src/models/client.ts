export {};
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL || "postgres://localhost:5432/cointrip"
})

module.exports = client;