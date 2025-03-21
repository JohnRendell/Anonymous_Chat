let users = [];
let nickname_list = [];

module.exports = (server)=>{
    server.on("connection", (socket)=>{
        console.log("socket connected: " + socket.id);
        console.table(users);
        console.log(nickname_list);

        //for reloading page
        socket.on("pageRefresh", (nickname)=>{
            users.forEach(user => {
                if(nickname == user.user){
                    user.socketID = socket.id;
                }
            });
        });

        //for listing active users
        socket.on("list_users", ()=>{
            let activeUsers = users.map(user=>({
                username: user.user,
                socketID: user.socketID
            }));

            server.emit("list_users", activeUsers);
        });

        //for user logout
        socket.on("user_logout", (id, type)=>{
            const findID = users.findIndex(user => user.socketID == id);

            if(findID > -1){
                const nickname = users[findID].user;
                const nickname_index = nickname_list.indexOf(nickname);

                if (nickname_index > -1) {
                    nickname_list.splice(nickname_index, 1);
                }
                users.splice(findID, 1);
            }
            
            if(type === "welcomePage"){
                socket.emit("user_logout");
            }
        });

        socket.on("user_leave", (user)=>{
            socket.broadcast.emit("user_leave", user);
        })

        //validate nickname
        socket.on("registerNickname", (nickname)=>{
            const data = { user: nickname, socketID: socket.id };
            let status = "";
            
            if(nickname_list.includes(nickname)){
                status = nickname + " already Taken";
            }
            else{
                status = "success";
                nickname_list.push(nickname);
                users.push(data);
            }
            socket.emit("registerNickname", nickname, status);
            console.table(users);
        });

        //sending global messages
        socket.on("globalMessages", (user, msg)=>{
            socket.broadcast.emit("globalMessages", user, msg);
        })
    });
}