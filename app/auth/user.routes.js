import express from "express";
import * as authController from "./user.controller.js"
import {userAuth} from "../middlewares/auth.js"
export const userRoute = express.Router()

userRoute.post('/register', authController.register)
userRoute.post('/login', authController.login)
userRoute.get('/users', userAuth, authController.searchUser)

