import { Request, Response, NextFunction } from "express";

function authenticateCookie(req: Request, res: Response, next: NextFunction) {
  const { cookies } = req;
  const { token } = req.body;
  if (cookies.token === token) {
    next();
  } else {
    res.status(403).send({
      name: "UnauthorizedUserError",
      message: "User is not authorized to visit this dashboard"
    })
  }
}

module.exports = authenticateCookie;