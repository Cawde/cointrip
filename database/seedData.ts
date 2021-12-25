export {};
const client = require('./client');

const dropTables = async ():Promise<void> => {
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

const createTables = async():Promise<void> => {
  try {
    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        firstName VARCHAR(255) NOT NULL,
        lastName VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        profilePicture VARCHAR(255),
        isActive BOOLEAN DEFAULT TRUE
      );

      CREATE TABLE transactions (
        id SERIAL PRIMARY KEY,
        initiateId INTEGER NOT NULL,
        amount FLOAT NOT NULL,
        recipientId INTEGER NOT NULL,
        date DATE NOT NULL,
        notes TEXT
      );
    `);

  } catch (e) {
    console.log("Error building tables");
    throw e;
  }
}

// const createInitialUsers = async ():Promise<void> {
//   console.log("Starting to create users...");
//   try {
//     const usersToCreate = [
//       {
//         firstName: "Peter",
//         lastName: "Parker",
//         email: "spiderman@cointrip.com",
//         password: "ilovemaryjane",
//         profilePicture: "https://en.wikipedia.org/wiki/Peter_Parker_(Sam_Raimi_film_series)#/media/File:Toby-maguire-Spider-Man.jpg",
//         isActive: true
//       }
//     ]

//   }
// }

const rebuildDB = async () => {
  try {
    client.connect();
    await dropTables();
    await createTables();
  } catch (e) {
    console.log("Error during rebuildDB");
    throw e;
  }
}

module.exports = {
  rebuildDB
};