import User from "./user.model.js";
import {
  BadRequestError,
  ConflictError,
} from "../errors/index.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {logger} from "../../logger/logger.js"

export const registeration = async (body) => {
  const { username, email, password, avatar, bio } = body;
  try {
    if (!username || !email || !password) {
      throw new BadRequestError("Please Provide All Values");
    }
    const isUser = await User.findOne({ email });
    if (isUser) {
      throw new ConflictError("Email Already Exists");
    } else {
      const newUser = new User({
        username,
        email,
        password,
        avatar,
        bio,
      });
      const userData = await newUser.save();
      return {
        data: userData,
        message: "User registration successfull.",
      };
    }
  } catch (error) {
    logger.error(error);
    return error;
  }
};

export const login = async (body) => {
  try {
    const { email, password, username } = body;
    if ((!email && !password) || (!username && !password)) {
      throw new BadRequestError("Please Provide All Values");
    }
    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (!user) {
      throw new BadRequestError("User Does Not Exist");
    }

    const comparePasswords = await bcrypt.compare(password, user.password);

    if (!comparePasswords) {
      throw new BadRequestError("Wrong Password");
    } else {
      const {_id, username, email, avatar} = user
      const payload = {
        userId: _id,
        userEmail: email,
        userName: username,
      };
      const token = jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: process.env.JWT_LIFETIME,
      });
      return {_id, username, email, avatar, token, message: "Login successfull" };
    }
  } catch (error) {
    logger.error(error);
    return error;
  }
};

export const search = async (search) => {
  try {
    return User.find({username:{$regex:search, $options: "i"}}).select("username _id avatar email bio")
  } catch (error) {
    logger.error(error);
    return error;
  }

}