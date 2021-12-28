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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const apiRouter = express_1.default.Router();
const { getUserById } = require('../models/users');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
apiRouter.use((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const prefix = 'Bearer ';
    const auth = req.header('Authorization');
    if (!auth) {
        next();
    }
    else if (auth.startsWith(prefix)) {
        const token = auth.slice(prefix.length);
        try {
            const { id } = jwt.verify(token, JWT_SECRET);
            if (id) {
                req.user = yield getUserById(id);
                next();
            }
        }
        catch ({ name, message }) {
            next({ name, message });
        }
    }
    else {
        next({
            name: 'AuthorizationHeaderError',
            message: `Authorization token must start with ${prefix}`
        });
    }
}));
apiRouter.use((req, res, next) => {
    if (req.user) {
        console.log('User is set as: ', req.user);
    }
    next();
});
const usersRouter = require('./users');
apiRouter.use('/users', usersRouter);
const transactionsRouter = require('./transactions');
apiRouter.use('/transactions', transactionsRouter);
apiRouter.use((error, req, res, next) => {
    res.send(error);
});
module.exports = apiRouter;
