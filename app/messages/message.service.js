import { BadRequestError } from "../errors/index.js";
import User from "../auth/user.model.js";
import Message from "./message.model.js";
import Chat from "../chat/chat.model.js";
import { logger } from "../../logger/logger.js";

export const sendMessage = async (body, id) => {
  try {
    const { chatId, message } = body;
    if (!chatId || !message) {
      throw new BadRequestError("Please Provide All Values");
    }

    let newMessage = await Message.create({
      sender: id,
      message,
      chat: chatId,
    });

    newMessage = await newMessage.populate("sender", "username avatar");
    newMessage = await newMessage.populate("chat");
    newMessage = await User.populate(newMessage, {
      path: "chat.users",
      select: "username, avatar, email bio _id",
    });

    await Chat.findByIdAndUpdate(
      chatId,
      { latestMessage: newMessage },
      { new: true }
    );

    return newMessage;
  } catch (error) {
    logger.error(error)
    return error;
  }
};

export const allMessages = async (params) => {
  try {
    const { chatId } = params;
    if (!chatId) {
      throw new BadRequestError("Please Provide All Values");
    }

    let allMessages = await Message.find({ chat: chatId })
      .populate("sender", "username avatar email _id")
      .populate("chat");

    return allMessages;
  } catch (error) {
    logger.error(error)
    return error;
  }
};
