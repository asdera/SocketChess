const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + "/static"));

function onConnection(socket){
  console.log("User connected");
  socket.on("chess move", function(str) {
    io.emit("chess move", str);
  });
  socket.on("chess promotion", function(str) {
    io.emit("chess promotion", str);
  });
  socket.on("switch promotion", function(str) {
    io.emit("switch promotion", str);
  });
  socket.on("chat message", function(str) {
    io.emit("chat message", str);
  });
  socket.on("disconnect", function(){
    console.log("user disconnected");
  });
}

io.on("connection", onConnection);

http.listen(port, () => console.log("listening on port " + port));