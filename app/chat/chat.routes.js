import express from 'express'
import { userAuth } from '../middlewares/auth.js'
import * as chatController from "./chat.controller.js"
export const chatRoute = express.Router()

chatRoute.post('/', userAuth, chatController.getChat)
chatRoute.get('/', userAuth, chatController.getChats)
chatRoute.post('/createGroup', userAuth, chatController.createGroup)
chatRoute.patch('/renameGroup', userAuth, chatController.renameGroup)
chatRoute.patch('/addToGroup', userAuth, chatController.addToGroup)
chatRoute.patch('/removeFromGroup', userAuth, chatController.removeFromGroup)