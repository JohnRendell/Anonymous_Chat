const express = require("express");
const app = express();
const expressServer = require("http").createServer(app);
const socketServer = require("socket.io")(expressServer);
const path = require("path");
const bodyParser = require('body-parser');

//for env file
require("dotenv").config({ path: path.resolve(__dirname, "../keys.env")});

app.use(bodyParser.json());

//serve folders
app.use(express.static(path.join(__dirname, "../Public")));
app.use(express.static(path.join(__dirname, "../View")));
app.use(express.static(path.join(__dirname, "../SocketConnectionClient")));
app.use(express.static(path.join(__dirname, "../Style")));
app.use(express.static(path.join(__dirname, "../Script")));

//for routes
app.use("/Welcome", require("./routePage.js"));

//cookies
app.use("/cookieStatus", require("./cookieStatus.js"));

//for root page
app.get("/", (req, res)=>{
    res.status(200).sendFile(path.join(__dirname, "../Public/index.html"));
});

//404 pages
app.get("*", (req, res)=>{
    res.status(404).sendFile(path.join(__dirname, "../Public/404page.html"));
});;

//for socket servers
require("./socketServer")(socketServer);

const PORT = process.env.PORT || 1000;

expressServer.listen(PORT, ()=>{
    console.log(`Listening to port ${PORT}`);
})