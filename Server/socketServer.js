module.exports = (server)=>{
    server.on("connection", (socket)=>{
        console.log("socket connected: " + socket.id);

        //validate nickname
        socket.on("registerNickname", (nickname)=>{
            socket.emit("registerNickname", nickname);
        });
    });
}