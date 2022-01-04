export {};
const client = require('./client');
const { createUser, createTransaction } = require('./index');

async function dropTables():Promise<void> {
  try {
    console.log("Dropping all tables...");

    await client.query(`
      DROP TABLE IF EXISTS users;
      DROP TABLE IF EXISTS transactions;
    `);

    console.log("Finished dropping tables!");
  } catch (e) {
    console.error("Error dropping tables");
    throw e;
  }
}

async function createTables():Promise<void> {
  try {
    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        "firstName" VARCHAR(255) NOT NULL,
        "lastName" VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        "profilePicture" VARCHAR(255),
        "isActive" BOOLEAN DEFAULT TRUE,
        "isVerified" BOOLEAN DEFAULT FALSE,
        "hasBank" BOOLEAN DEFAULT FALSE,
        "customerUrl" VARCHAR(255),
        "fundingSource" VARCHAR(255)
      );

      CREATE TABLE transactions (
        id SERIAL PRIMARY KEY,
        "initiateId" INTEGER NOT NULL,
        "initiateName" VARCHAR(255) NOT NULL,
        "initiateEmail" VARCHAR(255) NOT NULL,
        amount FLOAT NOT NULL,
        "recipientId" INTEGER NOT NULL,
        "recipientName" VARCHAR(255) NOT NULL,
        "recipientEmail" VARCHAR(255) NOT NULL,
        date DATE NOT NULL,
        notes TEXT,
        details VARCHAR(255)
      );
    `);

  } catch (e) {
    console.log("Error building tables");
    throw e;
  }
}

async function createInitialUsers():Promise<void> {
  console.log("Starting to create users...");
  try {
    const usersToCreate = [
      {
        firstName: "Peter",
        lastName: "Parker",
        email: "spiderman@cointrip.com",
        password: "ilovemj",
        profilePicture: "https://imgur.com/hiMYaVp",
        isActive: true,
        isVerified: true,
        hasBank: true,
        customerUrl: "https://api-sandbox.dwolla.com/customers/370b36a7-8ca6-4330-934d-e77e47fa11d8",
        fundingSource: "https://api-sandbox.dwolla.com/funding-sources/78701018-133f-418f-afd9-bc4fbb0b6006"
      },
      {
        firstName: "Tony",
        lastName: "Stark",
        email: "ironman@cointrip.com",
        password: "everyonelovesironman",
        profilePicture: "https://imgur.com/Dke5JJt",
        isActive: true,
        isVerified: true,
        hasBank: true,
        customerUrl: "https://api-sandbox.dwolla.com/customers/99e4461d-347f-4b1d-9164-6f72b38035fb",
        fundingSource: "https://api-sandbox.dwolla.com/funding-sources/90cfb2d4-b104-4c40-9e79-64efd9dd8b24"
      },
      {
        firstName: "Steven",
        lastName: "Strange",
        email: "drstrange@cointrip.com",
        password: "sorcerysupreme",
        profilePicture: "https://imgur.com/Jkx1AwX",
        isActive: true,
        isVerified: false,
        hasBank: false,
        customerUrl: null,
        fundingSource: null
      },
      {
        firstName: "Steve",
        lastName: "Rogers",
        email: "captainamerica@cointrip.com",
        password: "americasass",
        profilePicture: "https://imgur.com/jIaMyqg",
        isActive: true,
        isVerified: false,
        hasBank: false,
        customerUrl: null,
        fundingSource: null
      }
    ];

    const users = await Promise.all(
      usersToCreate.map((user) => createUser(user))
    );

    console.log("Users created: ");
    console.log(users);
    console.log("Finished creating users");
  } catch (e) {
    console.log("Error creating users =/");
    throw e;
  }
}

async function createInitialTransactions(): Promise<void> {
  try {
    console.log("Starting to create transactions");
    const transactionsToCreate = [
      {
        initiateId: 3,
        initiateName: "Peter",
        initiateEmail: "spiderman@cointrip.com",
        amount: 15000,
        recipientId: 2,
        recipientName: "Tony",
        recipientEmail: "ironman@cointrip.com",
        date: "2016-01-14",
        notes: "Thank you for the suit Mr. Stark",
        details: null
      },
      {
        initiateId: 1,
        initiateName: "Steven",
        initiateEmail: "drstrange@cointrip.com",
        amount: 2000,
        recipientId: 2,
        recipientName: "Tony",
        recipientEmail: "ironman@cointrip.com",
        date: "2018-05-21",
        notes: "The new machine works great Tony",
        details: null
      },
      {
        initiateId: 4,
        initiateName: "Steve",
        initiateEmail: "captainamerica@cointrip.com",
        amount: 30,
        recipientId: 1,
        recipientName: "Steven",
        recipientEmail: "drstrange@cointrip.com",
        date: "2018-06-30",
        notes: "I appreciate you showing me magic",
        details: null
      },
      {
        initiateId: 2,
        initiateName: "Tony",
        initiateEmail: "ironman@cointrip.com",
        amount: 2000,
        recipientId: 1,
        recipientName: "Steven",
        recipientEmail: "drstrange@cointrip.com",
        date: "2018-05-22",
        notes: "I don't need the money Mr. Wizard",
        details: null
      },
      {
        initiateId: 3,
        initiateName: "Peter",
        initiateEmail: "spiderman@cointrip.com",
        amount: 8,
        recipientId: 1,
        recipientName: "Steven",
        recipientEmail: "drstrange@cointrip.com",
        date: "2021-12-20",
        notes: "My split for the pizza, sir!",
        details: null
      },
      {
        initiateId: 3,
        initiateName: "Peter",
        initiateEmail: "spiderman@cointrip.com",
        amount: 2,
        recipientId: 1,
        recipientName: "Steven",
        recipientEmail: "drstrange@cointrip.com",
        date: "2020-12-25",
        notes: "Sorry about the spell! T.T",
        details: null
      },
      {
        initiateId: 1,
        initiateName: "Steven",
        initiateEmail: "drstrange@cointrip.com",
        amount: 2,
        recipientId: 3,
        recipientName: "Peter",
        recipientEmail: "spiderman@cointrip.com",
        date: "2020-12-25",
        notes: "Kid... just stop",
        details: null
      },  
    ];

    const transactions = await Promise.all(
      transactionsToCreate.map((transaction) => createTransaction(transaction))
    );

    console.log("Transactions created: ");
    console.log(transactions);
    
  } catch (e) {
    console.log("Error creating transactions =/");
    throw e;
  }
}
async function rebuildDB(): Promise<void> {
  try {
    client.connect();
    await dropTables();
    await createTables();
    await createInitialUsers();
    await createInitialTransactions();
  } catch (e) {
    console.log("Error during rebuildDB");
    throw e;
  }
}

module.exports = {
  rebuildDB,
  createInitialUsers
};