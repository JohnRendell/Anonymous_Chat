const express = require("express");
const route = express.Router();
const cookieParser = require("cookie-parser");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../keys.env")});

route.use(cookieParser(process.env.COOKIE_KEY));

route.post("/setCookie", (req, res)=>{
    let cookieType = req.body.cookieType;
    let cookieData = req.body.data;

    if(cookieData && cookieType){
        res.cookie(cookieType, cookieData, { signed: true, secure: true, maxAge: 360000, path: "/" }).status(200).json({ message: "success" });
    }
});

route.post("/getCookie", (req, res)=>{
    let nickname = req.signedCookies.token;
    let room = req.signedCookies.roomToken;
    let cookieType = req.body.cookieType;
    let cookieData = "No Cookie";

    if(cookieType === "token" && nickname){
        cookieData = nickname;   
    }

    if(cookieType === "roomToken" && room){
        cookieData = room;
    }
    
    res.status(200).json({ message: "success" , data: cookieData });
});

route.post("/deleteCookie", (req, res)=>{
    try{
        let cookieType = req.body.cookieType;    
        res.status(200).clearCookie(cookieType).json({ message: "success" });
    }
    catch(err){
        res.status(200).json({ message: "failed" });
    }
});

module.exports = route;