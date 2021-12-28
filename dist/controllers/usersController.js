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
const jwt = require('jsonwebtoken');
const { createUser, getUser, getUserByEmail, getAllUsers, updateUser, deleteUser, deactivateUser } = require('../models/users');
function getAllUsers_get(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const users = yield getAllUsers();
            res.send({
                users,
            });
        }
        catch (e) {
            console.log(e);
        }
    });
}
function registerUser_post(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { firstName, lastName, email, password } = req.body;
        try {
            const _user = yield getUserByEmail(email);
            console.log(_user);
            if (_user) {
                next({
                    name: "UserExistsError",
                    message: "This email has already been used to register with Cointrip."
                });
            }
            else {
                let profilePicture = 'https://imgur.com/uW4gXnS';
                const user = yield createUser({
                    firstName,
                    lastName,
                    email,
                    password,
                    profilePicture,
                    isActive: true
                });
                const token = jwt.sign({
                    id: user.id,
                    userFullName: `${user.firstName} ${user.lastName}`,
                    email: user.email
                }, process.env.JWT_SECRET, {
                    expiresIn: '1w'
                });
                res.send({
                    message: "Thank you for registering with Cointrip!",
                    token,
                    userId: user.id
                });
            }
        }
        catch ({ name, message }) {
            next({ name, message });
        }
    });
}
function loginUser_post(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        if (!email || !password) {
            next({
                name: "MissingCredentialsError",
                message: "Please supply both a valid email and password"
            });
        }
        try {
            const user = yield getUser({ email, password });
            if (user && password) {
                const token = jwt.sign({
                    id: user.id,
                    userFullName: `${user.firstName} ${user.lastName}`,
                    email: user.email
                }, process.env.JWT_SECRET, {
                    expiresIn: '1w'
                });
                res.send({
                    message: "Log in successful!",
                    token: token,
                    userId: user.id
                });
            }
            else {
                next({
                    name: "IncorrectCredentialsError",
                    message: "Email or password is incorrect."
                });
            }
        }
        catch (e) {
            next(e);
        }
    });
}
function updateUser_patch(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId } = req.params;
        const { firstName, lastName, email, password, profilePicture, isActive } = req.body;
        try {
            const updatedUser = yield updateUser({
                id: userId,
                firstName,
                lastName,
                email,
                password,
                profilePicture,
                isActive
            });
            res.send({
                message: "Your account was successfully updated!",
                user: updatedUser
            });
        }
        catch (e) {
            next(e);
        }
    });
}
function deactivateUser_patch(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId } = req.params;
        try {
            const deactivatedUser = yield deactivateUser(userId);
            res.send({
                message: "The account has been successfully deactivated.",
                deactivatedUser: deactivatedUser
            });
        }
        catch (e) {
            next(e);
        }
    });
}
function deleteUser_delete(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId } = req.params;
        try {
            const deletedUser = yield deleteUser(userId);
            res.send({
                message: "User was successfully deleted",
                deletedUser: deletedUser
            });
        }
        catch (e) {
            next(e);
        }
    });
}
module.exports = {
    getAllUsers_get,
    registerUser_post,
    loginUser_post,
    updateUser_patch,
    deactivateUser_patch,
    deleteUser_delete
};
