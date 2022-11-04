import { responseHandler } from "../handler/response.handler.js";
import * as messageService from "./message.service.js";

export const sendMessage = async (req, res, next) => {
  try {
    const serviceResponse = await messageService.sendMessage(req.body, req.user.userId);
    return responseHandler(serviceResponse, res);
  } catch (error) {
    next(error);
  }
};

export const allMessages = async (req, res, next) => {
  try {
    const serviceResponse = await messageService.allMessages(req.params);
    return responseHandler(serviceResponse, res);
  } catch (error) {
    next(error);
  }
};
