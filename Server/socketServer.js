let users = [];

module.exports = (server)=>{
    server.on("connection", (socket)=>{
        console.log("socket connected: " + socket.id);
        console.table(users)

        //validate nickname
        socket.on("registerNickname", (nickname)=>{
            const data = { user: nickname, socketID: socket.id }
            users.push(data);

            console.table(users)
        });
    });
}