const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const socket = require("socket.io");
const messageController = require("./controllers/messageController"); 
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL)
  .then(async () => {
    console.log("DB Connection Successful");
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

io.on("connection", (socket) => {
  global.chatSocket = socket;

  socket.on("send-msg", (data) => {
    socket.to(data.to).emit("msg-recieve", data);
  });
});
