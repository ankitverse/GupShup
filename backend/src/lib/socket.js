import { Server } from "socket.io";
import http from "http";
import express from "express";
import dotenv from 'dotenv';
import fetch from 'node-fetch';

const app = express();
const server = http.createServer(app);

dotenv.config();

const TOKEN = process.env.TOKEN;

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// used to store online users
const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);
  // console.log(`https://api.telegram.org/bot${TOKEN}/sendMessage?chat_id=1721734458&text=She+is+online+boss`);
  fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage?chat_id=1721734458&text=SomeOne+Joined`).then(
    console.log("message sent to telegram")
  );
  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  // io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage?chat_id=1721734458&text=Oops+Someone+Left!!!!`);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
