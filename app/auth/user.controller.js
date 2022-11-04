import * as userService from "./user.service.js";
import {responseHandler} from "../handler/response.handler.js"

export const register = async (req, res, next) => {
  try {
    const serviceResponse = await userService.registeration(req.body);
    return responseHandler(serviceResponse, res)
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
    try {
        const serviceResponse = await userService.login(req.body)
        return responseHandler(serviceResponse, res)
    } catch (error) {
        next(error);
    }
}

export const searchUser = async (req, res, next) => {
  try {
    const {search} = req.query
    const serviceResponse = await userService.search(search)
    return responseHandler(serviceResponse, res)
  } catch (error) {
    next(error);
  }
}