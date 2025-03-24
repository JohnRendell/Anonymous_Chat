const express = require("express");
const route = express.Router();
const path = require("path");

route.get("/Home/:userid", (req, res)=>{
    res.status(200).sendFile(path.join(__dirname, "../View/welcomePage.html"));
});

route.get("/Room/:roomid", (req, res)=>{
    res.status(200).sendFile(path.join(__dirname, "../View/room.html"));
});

module.exports = route;