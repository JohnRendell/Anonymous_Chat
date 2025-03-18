const express = require("express");
const route = express.Router();
const cookieParser = require("cookie-parser");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../keys.env")});

route.use(cookieParser(process.env.COOKIE_KEY));

route.post("/setCookie", (req, res)=>{
    let nickname = req.body.nickname;
    res.cookie("token", nickname, { signed: true, secure: true, maxAge: 360000, path: "/" }).status(200).json({ message: "success" });
});

route.get("/getCookie", (req, res)=>{
    let nickname = req.signedCookies.token;

    if(nickname){
        res.status(200).send(nickname);
    }
});

route.get("/deleteCookie", (req, res)=>{
    res.status(200).clearCookie("token").send("Cookie has been cleared");
});

module.exports = route;