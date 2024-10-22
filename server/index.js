const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const socket = require("socket.io");
const messageController = require("./controllers/messageController"); // Import message controller
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL)
  .then(async () => {
    console.log("DB Connection Successful");

    // Option 1: Delete all messages when the server starts (uncomment if needed)
    // await messageController.deleteAllMessages();
    // console.log("All messages have been deleted on server start.");
    
  })
  .catch((err) => {
    console.error("DB Connection Error:", err.message);
  });

app.get("/ping", (_req, res) => {
  return res.json({ msg: "Ping Successful" });
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.get("/health", (req, res) => {
  return res.json({ health: "GOOD" });
});

// Option 2: Add a route to manually delete all messages from backend
//  curl to run in postman
  // curl --location --request DELETE 'http://localhost:5000/api/messages/deleteAll'
app.delete("/api/messages/deleteAll", async (req, res) => {
  try {
    await messageController.deleteAllMessages();
    res.status(200).json({ msg: "All messages deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete messages." });
  }
});

const server = app.listen(process.env.PORT, () =>
  console.log(`Server started on ${process.env.PORT}`)
);

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});
