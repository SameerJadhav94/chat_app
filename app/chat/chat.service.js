import User from "../auth/user.model.js";
import { BadRequestError } from "../errors/index.js";
import Chat from "./chat.model.js";
import {logger} from '../../logger/logger.js'

export const getChat = async (body, id) => {
  try {
    const { userId } = body;
    if (!userId) {
      throw new BadRequestError("No user Exists");
    }
    let chat = await Chat.find({
      isGroupChat: false,
      $and: [{ users: id }, { users: userId }],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    chat = await User.populate(chat, {
      path: "latestMessage.sender",
      select: "username email avatar bio _id",
    });

    if (chat.length > 0) {
      return chat[0];
    } else {
      const createChat = await Chat.create({
        chatName: "sender",
        isGroupChat: false,
        users: [id, userId],
      });

      const fullChat = await Chat.findOne({ _id: createChat._id }).populate(
        "users",
        "-password"
      );
      return fullChat;
    }
  } catch (error) {
    logger.error(error)
    return error;
  }
};

export const getChats = async (id) => {
  try {
    const chat = await Chat.find({ users: { $elemMatch: { $eq: id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    const user = await User.populate(chat, {
      path: "latestMessage.sender",
      select: "username avatar email _id",
    });

    return user;
  } catch (error) {
    logger.error(error)
    return error;
  }
};

export const createGroup = async (body, id) => {
  try {
    const { users, name } = body;
    if (!users || !name) {
      throw new BadRequestError("Please enter all fields");
    }

    if (users.length < 2) {
      throw new BadRequestError(
        "More than two users is required to create a group"
      );
    }

    users.push(id);

    const groupChat = await Chat.create({
      chatName: name,
      users,
      isGroupChat: true,
      groupAdmin: id,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    return fullGroupChat;
  } catch (error) {
    logger.error(error)
    return error;
  }
};

export const renameGroup = async (body) => {
  try {
    const { chatName, chatId } = body;
    if (!chatName || !chatId) {
      throw new BadRequestError("Please enter all fields");
    }

    const updatedGroup = await Chat.findByIdAndUpdate(
      { _id: chatId },
      { chatName },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedChat) {
      throw new BadRequestError("Chat Not Found");
    } else {
      return updatedGroup;
    }
  } catch (error) {
    logger.error(error)
    return error;
  }
};

export const addToGroup = async (body) => {
  try {
    const { chatId, userId } = body;

    const addUser = await Chat.findByIdAndUpdate(
      chatId,
      { $push:{users: userId} },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!addUser) {
      throw new BadRequestError("Chat Not Found");
    } else {
      return addUser;
    }
  } catch (error) {
    logger.error(error)
    return error;
  }
};

export const removeFromGroup = async (body) => {
  try {
    const { chatId, userId } = body;

    const addUser = await Chat.findByIdAndUpdate(
      chatId,
      { $pull:{users: userId} },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!addUser) {
      throw new BadRequestError("Chat Not Found");
    } else {
      return addUser;
    }
  } catch (error) {
    logger.error(error)
    return error;
  }
};

