import { Request, Response, NextFunction } from "express";
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

async function authenticateCookie(req: Request, res: Response, next: NextFunction) {
  const { userId } = req.params;
  const token = req.cookies.token;
  console.log(userId);
  console.log("Attempt to see cookie token: ", token, req.cookies);
  if (!token) {
    return res.status(403);
  }
  try {
    const info = jwt.verify(token, JWT_SECRET);
    console.log("Attempt to see info from jwt verify: ", info);
    if (userId === info.id) {
      next({
        message: "cookie stored."
      })
    }
  } catch {
    return res.status(403);
  }

  }
  // jwt.verify(token, JWT_SECRET, function (err: any, decodedToken: { id: any; }) {
  //   console.log(decodedToken);
  //   if (id !== decodedToken.id) {
  //     res.status(500).send({
  //       message: err.message});
  //   } else {
  //     next({
  //       name: "Cookie successfully stored"
  //     });
  //   }


module.exports = authenticateCookie;