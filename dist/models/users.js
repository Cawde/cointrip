"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const bcrypt = __importStar(require("bcrypt"));
const SALT_COUNT = 10;
function createUser({ firstName, lastName, email, password, profilePicture, isActive }) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const hashedPassword = yield bcrypt.hash(password, SALT_COUNT);
            const { rows: [user] } = yield client.query(`
      INSERT INTO users("firstName", "lastName", email, password, "profilePicture", "isActive")
      VALUES($1, $2, $3, $4, $5, $6)
      RETURNING *;
      `, [firstName, lastName, email, hashedPassword, profilePicture, isActive]);
            delete user.password;
            return user;
        }
        catch (e) {
            throw e;
        }
    });
}
function getUser({ email, password }) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield getUserByEmail(email);
            const hashedPassword = user.password;
            const passwordsMatch = yield bcrypt.compare(password, hashedPassword);
            if (passwordsMatch === true) {
                delete user.password;
                return user;
            }
        }
        catch (e) {
            throw e;
        }
    });
}
function getUserByEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { rows: [user] } = yield client.query(`
      SELECT * FROM users
      WHERE email=$1;
    `, [email]);
            return user;
        }
        catch (e) {
            console.log(e);
            throw e;
        }
    });
}
function getUserById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { rows: [user] } = yield client.query(`
      SELECT * FROM users
      WHERE id=$1,
      `, [id]);
            if (!user) {
                return null;
            }
            return user;
        }
        catch (e) {
            throw e;
        }
    });
}
function getAllUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { rows } = yield client.query(`
      SELECT *
      FROM users;
      `);
            for (const user of rows) {
                delete user.password;
            }
            return rows;
        }
        catch (e) {
            throw e;
        }
    });
}
function updateUser({ id, firstName, lastName, email, password, profilePicture, isActive }) {
    return __awaiter(this, void 0, void 0, function* () {
        const fields = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            profilePicture: profilePicture,
            isActive: isActive
        };
        if (firstName === undefined || firstName === null)
            delete fields.firstName;
        if (lastName === undefined || lastName === null)
            delete fields.lastName;
        if (email === undefined || email === null)
            delete fields.email;
        if (password === undefined || password === null)
            delete fields.password;
        if (profilePicture === undefined || profilePicture === null)
            delete fields.profilePicture;
        if (isActive === undefined || isActive === null)
            delete fields.isActive;
        const setString = Object.keys(fields).map((key, index) => `"${key}"=$${index + 1}`).join(", ");
        if (setString.length === 0) {
            return;
        }
        try {
            const { rows: [users] } = yield client.query(`
      UPDATE users
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
    `, Object.values(fields));
            return users;
        }
        catch (e) {
            throw e;
        }
    });
}
function deactivateUser(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.query(`
      UPDATE users
      SET "isActive"=false
      WHERE id=$1
      RETURNING *;
    `, [id]);
        }
        catch (e) {
        }
    });
}
//This function is here as proof of concept however I believe deleting financial information is not the best option so I opted
//to write a deactivate function instead. The user will be hidden but all their data will be still present in the database in case it is needed at a later date.
function deleteUser(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.query(`
      DELETE FROM transactions
      WHERE "initiateId"=$1 OR "recipientId"=$1
    `, [id]);
            const { rows: [user] } = yield client.query(`
      DELETE FROM users
      WHERE id=$1
      RETURNING *;
    `, [id]);
            return user;
        }
        catch (e) {
            throw e;
        }
    });
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
};
