import jwt from "jsonwebtoken";
import User from "../auth/user.model.js";
import { logger } from "../../logger/logger.js";
import { UnauthenticatedError, NotFoundError } from "../errors/index.js";

export const userAuth = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token)
      throw new UnauthenticatedError("Authorization token is required");
    else {
      token = token.split(" ")[1];

      const user = jwt.verify(token, process.env.SECRET_KEY);
      req.user = user;
      res.locals.user = user;
      res.locals.token = token;
      const data = await User.findById(req.user.userId);
      if (!data) {
        throw new NotFoundError("User Not Found");
      } else {
        next();
      }
    }
  } catch (error) {
    logger.error(error);
    res
      .status(error.statusCode || 500)
      .json({
        status: error.statusCode || 500,
        message: error.statusCode ? error.message : error.name,
      });
  }
};
