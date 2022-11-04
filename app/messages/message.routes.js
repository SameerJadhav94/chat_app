import express from 'express';
import { userAuth } from '../middlewares/auth.js';
import * as messageController from "./message.controller.js"
export const messageRoute = express.Router()

messageRoute.post('/send', userAuth, messageController.sendMessage)
messageRoute.get('/all/:chatId', userAuth, messageController.allMessages)