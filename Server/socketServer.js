let users = [];
let nickname_list = [];
let room_list = [];

module.exports = (server)=>{
    server.on("connection", (socket)=>{
        console.log("socket connected: " + socket.id);
        console.table(users);
        console.table(room_list);

        //for reloading page
        socket.on("pageRefresh", (nickname)=>{
            const data = { user: nickname, socketID: socket.id };

            users.forEach(user => {
                if(nickname == user.user){
                    user.socketID = socket.id;
                }
            });

            if(!nickname_list.includes(nickname)){
                nickname_list.push(nickname);
                users.push(data);
            }
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
        });

        //sending private messages
        socket.on("privateMessages", (sender, receiver, msg)=>{
            const userIndex = users.findIndex(user => user.user == receiver);

            if(userIndex > -1){
                let socketID = users[userIndex].socketID;

                socket.to(socketID).emit("privateMessages", sender, msg);
            }
        });

        //when searching for users
        socket.on("findingUser", (query)=>{
            let status = "";
            let findUserIndex = users.findIndex(user => user.user === query);

            if(findUserIndex > -1){
                status = "found";
            }
            else{
                status = query + " does not exist";
            }
            socket.emit("findingUser", query, status);
        });

        //when making room
        socket.on("create_room", (roomData)=>{
            const checkRoom = room_list.findIndex(room => room.roomName == roomData.roomName);
            let status = "";

            if(checkRoom > -1){
                status = roomData.roomName + " is already exist.";
            }
            else{
                status = "success";
                room_list.push(roomData);
            }
            socket.emit("create_room", status);
        });

        //displaying rooms
        socket.on("displayRoom", ()=>{
            let room_displayList = room_list.map(room=>({
                roomOwner: room.roomOwner,
                roomName: room.roomName,
                roomType: room.type,
                roomMax: room.max,
                roomCode: room.roomCode
            }));
            server.emit("displayRoom", room_displayList);
        });
    });
}