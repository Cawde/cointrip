"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { Client } = require('pg');
const client = new Client({
    connectionString: process.env.DATABASE_URL || "postgres://localhost:5432/cointrip",
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : require("dotenv").config(),
});
module.exports = client;
