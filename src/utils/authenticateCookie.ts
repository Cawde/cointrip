import { Request, Response, NextFunction } from "express";
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

async function authenticateCookie(req: Request, res: Response, next: NextFunction) {
  const { cookies } = req;
  const { id } = req.body;

  jwt.verify(cookies.token, JWT_SECRET, function (decodedToken: { id: any; }) {
    if (id === decodedToken.id) {
      next();
    } else {
      res.status(403).send({
        name: "UnauthorizedUserError",
        message: "User is not authorized to visit this dashboard"
      })
    }
  })
}

module.exports = authenticateCookie;