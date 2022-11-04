import { responseHandler } from "../handler/response.handler.js";
import * as chatService from "./chat.service.js";

export const getChat = async (req, res, next) => {
  try {
    const serviceResponse = await chatService.getChat(req.body, req.user.userId);
    return responseHandler(serviceResponse, res);
  } catch (error) {
    next(error);
  }
};

export const getChats = async (req, res, next) => {
  try {
    const serviceResponse = await chatService.getChats(req.user.userId);
    return responseHandler(serviceResponse, res);
  } catch (error) {
    next(error);
  }
};

export const createGroup = async (req, res, next) => {
  try {
    const serviceResponse = await chatService.createGroup(req.body, req.user.userId)
    return responseHandler(serviceResponse, res);
  } catch (error) {
    next(error);
  }
}

export const renameGroup = async (req, res, next) => {
  try {
    const serviceResponse = await chatService.renameGroup(req.body)
    return responseHandler(serviceResponse, res);
  } catch (error) {
    next(error);
  }
}
export const addToGroup = async (req, res, next) => {
  try {
    const serviceResponse = await chatService.addToGroup(req.body)
    return responseHandler(serviceResponse, res);
  } catch (error) {
    next(error);
  }
}
export const removeFromGroup = async (req, res, next) => {
  try {
    const serviceResponse = await chatService.removeFromGroup(req.body)
    return responseHandler(serviceResponse, res);
  } catch (error) {
    next(error);
  }
}