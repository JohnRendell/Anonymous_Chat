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

            console.log("Current list");
            console.table(users)

            console.log("Name list: " + nickname_list);
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
            console.log("Logged Out")
        });

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
    });
}