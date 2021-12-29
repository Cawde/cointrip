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
const { createUser, createTransaction } = require('./index');
function dropTables() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("Dropping all tables...");
            yield client.query(`
      DROP TABLE IF EXISTS users;
      DROP TABLE IF EXISTS transactions;
    `);
            console.log("Finished dropping tables!");
        }
        catch (e) {
            console.error("Error dropping tables");
            throw e;
        }
    });
}
function createTables() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        "firstName" VARCHAR(255) NOT NULL,
        "lastName" VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        "profilePicture" VARCHAR(255),
        "isActive" BOOLEAN DEFAULT TRUE
      );

      CREATE TABLE transactions (
        id SERIAL PRIMARY KEY,
        "initiateId" INTEGER NOT NULL,
        amount FLOAT NOT NULL,
        "recipientId" INTEGER NOT NULL,
        date DATE NOT NULL,
        notes TEXT
      );
    `);
        }
        catch (e) {
            console.log("Error building tables");
            throw e;
        }
    });
}
function createInitialUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Starting to create users...");
        try {
            const usersToCreate = [
                {
                    firstName: "Peter",
                    lastName: "Parker",
                    email: "spiderman@cointrip.com",
                    password: "ilovemj",
                    profilePicture: "https://imgur.com/hiMYaVp",
                    isActive: true
                },
                {
                    firstName: "Tony",
                    lastName: "Stark",
                    email: "ironman@cointrip.com",
                    password: "everyonelovesironman",
                    profilePicture: "https://imgur.com/Dke5JJt",
                    isActive: true
                },
                {
                    firstName: "Steven",
                    lastName: "Strange",
                    email: "drstrange@cointrip.com",
                    password: "sorcerysupreme",
                    profilePicture: "https://imgur.com/Jkx1AwX",
                    isActive: true
                },
                {
                    firstName: "Steve",
                    lastName: "Rogers",
                    email: "captainamerica@cointrip.com",
                    password: "americasass",
                    profilePicture: "https://imgur.com/jIaMyqg",
                    isActive: true
                }
            ];
            const users = yield Promise.all(usersToCreate.map((user) => createUser(user)));
            console.log("Users created: ");
            console.log(users);
            console.log("Finished creating users");
        }
        catch (e) {
            console.log("Error creating users =/");
            throw e;
        }
    });
}
function createInitialTransactions() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("Starting to create transactions");
            const transactionsToCreate = [
                {
                    initiateId: 3,
                    amount: 15000,
                    recipientId: 2,
                    date: "2016-01-14",
                    notes: "Thank you for the suit Mr. Stark"
                },
                {
                    initiateId: 1,
                    amount: 2000,
                    recipientId: 2,
                    date: "2018-05-21",
                    notes: "The new machine works great Tony"
                },
                {
                    initiateId: 4,
                    amount: 30,
                    recipientId: 1,
                    date: "2018-06-30",
                    notes: "I appreciate you showing me magic"
                },
                {
                    initiateId: 2,
                    amount: 2000,
                    recipientId: 1,
                    date: "2018-05-22",
                    notes: "I don't need the money Mr. Wizard"
                },
                {
                    initiateId: 3,
                    amount: 8,
                    recipientId: 1,
                    date: "2021-12-20",
                    notes: "My split for the pizza, sir!"
                },
                {
                    initiateId: 3,
                    amount: 2,
                    recipientId: 1,
                    date: "2020-12-25",
                    notes: "Sorry about the spell! T.T"
                },
                {
                    initiateId: 1,
                    amount: 2,
                    recipientId: 3,
                    date: "2020-12-25",
                    notes: "Kid... just stop"
                },
            ];
            const transactions = yield Promise.all(transactionsToCreate.map((transaction) => createTransaction(transaction)));
            console.log("Transactions created: ");
            console.log(transactions);
        }
        catch (e) {
            console.log("Error creating transactions =/");
            throw e;
        }
    });
}
function rebuildDB() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            client.connect();
            yield dropTables();
            yield createTables();
            yield createInitialUsers();
            yield createInitialTransactions();
        }
        catch (e) {
            console.log("Error during rebuildDB");
            throw e;
        }
    });
}
module.exports = {
    rebuildDB,
    createInitialUsers
};
