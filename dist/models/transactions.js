"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client = require('./client');
function createTransaction({ initiateId, amount, recipientId, date, notes }) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { rows: [transaction] } = yield client.query(`
        INSERT INTO transactions("initiateId", amount, "recipientId", date, notes)
        VALUES($1, $2, $3, $4, $5)
        RETURNING *;
      `, [initiateId, amount, recipientId, date, notes]);
            return transaction;
        }
        catch (e) {
            throw e;
        }
    });
}
function getAllTransactions() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { rows } = yield client.query(`
      SELECT * 
      FROM transactions;
    `);
            return rows;
        }
        catch (e) {
            throw e;
        }
    });
}
module.exports = {
    createTransaction,
    getAllTransactions
};
