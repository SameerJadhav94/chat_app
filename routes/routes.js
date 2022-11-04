import express from "express";
const router = express.Router();
import {userRoute}from "../app/auth/user.routes.js"
import { chatRoute } from "../app/chat/chat.routes.js";
import { messageRoute } from "../app/messages/message.routes.js";


const routes = () => {
  // define a route
  router.get("/", (req, res) => {
    res.json({ message: "Welcome To Chat App" });
  });
  router.use("/user", userRoute);
  router.use("/message", messageRoute);
  router.use("/chat", chatRoute);
  return router;
};
export default routes;
