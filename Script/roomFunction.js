async function roomInformation(){
    let text = await getCookie("roomToken");
    let roomTitle = document.getElementById("roomTitle");

    if(roomTitle && text){
        document.title = text.roomName;
        roomTitle.innerText = text.roomName;

        //display all info
        let roomOwner = document.getElementById("roomOwner_info");
        let roomName = document.getElementById("roomTitle_info");
        let roomType = document.getElementById("roomType_info");
        let roomMax = document.getElementById("roomMax_info");
        let roomCode = document.getElementById("roomCode_info");

        if(roomName && roomType && roomMax && roomCode){
            roomOwner.innerText = "Room Owner: " + text.roomOwner;
            roomName.innerText = "Room name: " + text.roomName;
            roomType.innerText = "Type: " + text.roomType;
            roomMax.innerText = "Max: " + text.roomMax;
            roomCode.innerText = "Room Code: " + text.roomCode;
        }
    }
}

function leaveRoom(){
    deleteCookie("roomToken");
    window.location.href = "/welcome/Home/" + global_sender;
}

roomInformation();