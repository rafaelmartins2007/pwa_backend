const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const path = require("path")
const socketIo = require("socket.io");
const cors = require('cors');
require('dotenv').config();
const config = require('./config');
const hostname = "0.0.0.0";
const port = Number(process.env.PORT || 3000);
let router = require('./router');
var app = express();
app.set('trust proxy', 1);

const allowedOrigins = [process.env.FRONTEND_URL, 'http://localhost:5173'].filter(Boolean);
const corsOptions = { origin: allowedOrigins, credentials: true };

mongoose
  .connect(config.db)
  .then(() => console.log('Conection successful!'))
  .catch((err) => console.error(err));

const server = http.createServer(app);
const io = socketIo(server, {
  cors: corsOptions,
});

io.on("connection", (socket) => {
  console.log("Socket, new connection: ", socket.id);

  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");
    socket.disconnect();
  });
});

app.use(cors(corsOptions));
app.get('/health', (req, res) => res.json({ ok: true }));
app.use(router.init(io));

app.get('/health', (req, res) => res.json({ ok: true }));
app.use(router.init(io));
app.use('/images', express.static(path.join(__dirname, 'images')));

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});