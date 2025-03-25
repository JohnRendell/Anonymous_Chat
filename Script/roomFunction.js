let global_roomName;

async function roomInformation(){
    let text = await getCookie("roomToken");
    let roomTitle = document.getElementById("roomTitle");

    if(roomTitle && text){
        document.title = text.roomName;
        roomTitle.innerText = text.roomName;

        socket.emit("create_room", text);

        //display all info
        let roomOwner = document.getElementById("roomOwner_info");
        let roomName = document.getElementById("roomTitle_info");
        let roomType = document.getElementById("roomType_info");
        let roomMax = document.getElementById("roomMax_info");
        let roomCode = document.getElementById("roomCode_info");

        if(roomName && roomType && roomMax && roomCode){
            roomOwner.innerText = "Room Owner: " + text.roomOwner;
            roomName.innerText = "Room name: " + text.roomName;
            roomType.innerText = "Type: " + text.type;
            roomMax.innerText = "Max: " + text.max;
            roomCode.innerText = "Room Code: " + text.roomCode;
        }
        global_roomName = text.roomName;
    }
}

function leaveRoom(){
    deleteCookie("roomToken");
    socket.emit("leave_room", global_roomName, global_sender);
    window.location.href = "/welcome/Home/" + global_sender;
}

roomInformation();