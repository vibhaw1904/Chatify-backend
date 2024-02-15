const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ path: __dirname + '/.env' });
const cors = require('cors');
const app = express();
const connectDb = require('./db/connect');
const userRoutes = require('./Routes/userRoutes');
const chatRoutes = require('./Routes/chatRoutes');
const messageRoutes = require('./Routes/messageRoutes');
const { Socket } = require('socket.io');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

connectDb();

app.get("/", (req, res) => {
    res.send("API is running123");
});

app.use("/user", userRoutes);
app.use("/chat", chatRoutes);
app.use("/message", messageRoutes);

const port = process.env.PORT;

const server = app.listen(port, () => console.log(`app is running on port ${port}`));

const io = require("socket.io")(server, {
    cors: {
        origin: "*"
    },
    pingTimeout: 60000
});

io.on('connection', (socket) => {
    console.log("New connection:", socket.id);

    socket.on('error', (error) => {
        console.error('Socket.IO error:', error);
    });

    socket.on("setup", (user) => {
        socket.join(user.data._id);
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        socket.join(room);
    });

    socket.on("new message", (newMessageStatus) => {
      var chat = newMessageStatus.chat;
      if (!chat.users) {
          return console.log("chat users are not defined");
      }
      chat.users.forEach(user => {
          if (user._id == newMessageStatus.sender._id) return;
         
          newMessageStatus.sender = user; 
          socket.in(user._id).emit("message received", newMessageStatus);
      });
  });
});
