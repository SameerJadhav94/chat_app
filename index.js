import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { databaseConnection } from "./config/database.config.js";
import { logger } from "./logger/logger.js";
import routes from "./routes/routes.js";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
app.disable("x-powered-by");
const { PORT } = process.env;

app.use(cors());
app.use(express.json());

databaseConnection();
app.use("/api/", routes());

app.use(function (err, req, res, next) {
  // err is error from next(e) function
  res
    .status(500)
    .send({ status: 500, message: err.message || "Internal Server Error" });
});

let server = createServer(app);

// connect to the server
server.listen(PORT, () => {
  logger.info(`Listening to the server`);
});

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log('User Connected',socket.id, );
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join-chat", (room) => {
    socket.join(room);
  });

  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });

  socket.on("stop-typing", (room) => {
    socket.in(room).emit("stop-typing");
  });

  socket.on("new-message", (newMessageReceived) => {
    let chat = newMessageReceived.chat;

    if (!chat.users) {
      return logger.error("chat.users is not defined");
    }

    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) {
        return;
      }
      socket.in(user._id).emit("message-received", newMessageReceived);
    });
  });

  socket.off("setup", () => {
    socket.leave(userData._id);
  });
});

export default app;
