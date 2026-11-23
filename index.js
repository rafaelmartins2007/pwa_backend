const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const path = require("path")
const socketIo = require("socket.io");
require('dotenv').config();
const config = require('./config');
const hostname = "0.0.0.0";
const port = Number(process.env.PORT || 3000);
let router = require('./router');
var app = express();

mongoose
  .connect(config.db)
  .then(() => console.log('Conection successful!'))
  .catch((err) => console.error(err));

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://*:*", //allow all IPs and All ports
  },
});

io.on("connection", (socket) => {
  console.log("Socket, new connection: ", socket.id);

  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");
    socket.disconnect();
  });
});


app.get('/health', (req, res) => res.json({ ok: true }));
app.use(router.init(io));
app.use('/images', express.static(path.join(__dirname, 'images')));

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});