export {};
const client = require('./client');
import * as bcrypt from "bcrypt";
const SALT_COUNT:number = 10;

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profilePicture: string;
  isActive: boolean;
}

async function createUser({ firstName, lastName, email, password, profilePicture, isActive }: User):Promise<any> {
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
    const { rows: [user] } = await client.query(`
      INSERT INTO users("firstName", "lastName", email, password, "profilePicture", "isActive")
      VALUES($1, $2, $3, $4, $5, $6)
      RETURNING *;
      `, [firstName, lastName, email, hashedPassword, profilePicture, isActive]);

    delete user.password;
    return user;
  } catch (e) {
    throw e;
  }
}

async function getUser({email, password}: User):Promise<any> {
  try {
    const user = await getUserByEmail(email);
    const hashedPassword = user.password;
    const passwordsMatch = await bcrypt.compare(password, hashedPassword);

    if (passwordsMatch === true) {
      delete user.password;
      return user;
    }
  } catch (e) {
    throw e;
  }
}

async function getUserByEmail(email:string):Promise<any> {
  try {
    const { rows: [user] } = await client.query(`
      SELECT * FROM users
      WHERE email=$1;
    `, [email]
    );
    
    return user;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

async function getUserById(id:number):Promise<any> {
  try {
    const {rows: [user]} = await client.query(`
      SELECT * FROM users
      WHERE id=$1,
      `,[id]
      );

    if(!user) {
      return null;
    }

    return user;
  } catch (e) {
    throw e;
  }
}

async function getAllUsers():Promise<any> {
  try {
    const { rows } = await client.query(`
      SELECT *
      FROM users;
      `);
    
    for (const user of rows) {
      delete user.password
    }
    return rows;
  } catch (e) {
    throw e;
  }
}

async function updateUser({ id, firstName, lastName, email, password, profilePicture, isActive}: any):Promise<any> {
  const fields = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: password,
    profilePicture: profilePicture,
    isActive: isActive
  }

  if (firstName === undefined || firstName === null) delete fields.firstName;
  if (lastName === undefined || lastName === null) delete fields.lastName;
  if (email === undefined || email === null) delete fields.email;
  if (password === undefined || password === null) delete fields.password;
  if (profilePicture === undefined || profilePicture === null) delete fields.profilePicture;
  if (isActive === undefined || isActive === null) delete fields.isActive;

  const setString = Object.keys(fields).map((key, index) => `"${key}"=$${index + 1}`).join(", ");

  if (setString.length === 0) {
    return;
  }

  try {
    const { rows: [users] } = await client.query(`
      UPDATE users
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
    `, Object.values(fields)
    );
    
    return users;
  } catch (e) {
    throw e;
  }
}

async function deactivateUser(id:number):Promise<any> {
  try {
    await client.query(`
      UPDATE users
      SET "isActive"=false
      WHERE id=$1
      RETURNING *;
    `,[id])
    
  } catch (e) {
    
  }
}

//This function is here as proof of concept however I believe deleting financial information is not the best option so I opted
//to write a deactivate function instead. The user will be hidden but all their data will be still present in the database in case it is needed at a later date.
async function deleteUser(id:number):Promise<any> {
  try {
    await client.query(`
      DELETE FROM transactions
      WHERE "initiateId"=$1 OR "recipientId"=$1
    `,[id]);

    const { rows: [user] } = await client.query (`
      DELETE FROM users
      WHERE id=$1
      RETURNING *;
    `,[id]);

    return user;
  } catch (e) {
    throw e;
  }
}

module.exports = {
  createUser,
  getUser,
  getUserByEmail,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  deactivateUser
}