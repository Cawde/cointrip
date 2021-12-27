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
const { createTransaction, getAllTransactions } = require('../models/transactions');
function getAllTransactions_get(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const transactions = yield getAllTransactions();
            res.send({ transactions });
        }
        catch (e) {
            next(e);
        }
    });
}
function createTransaction_post(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { initiateId, recipientId, amount, date, notes } = req.body;
        try {
            const transaction = yield createTransaction({ initiateId, amount, recipientId, date, notes });
            res.send({
                message: "Transaction successful!",
                transaction: transaction
            });
        }
        catch (e) {
            next(e);
        }
    });
}
module.exports = {
    getAllTransactions_get,
    createTransaction_post
};
