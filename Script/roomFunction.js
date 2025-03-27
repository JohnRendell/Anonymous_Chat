let global_roomName;
let user_join_count = 0;

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

            socket.emit("join_room", text.roomName, global_sender);
        }
        global_roomName = text.roomName;
    }
}

function sendMessageRoom(){
    var container = document.getElementById("roomContainerMsg");
    var messageInput = document.getElementById("roomMessageInput");
    var messageCounter = document.getElementById("roomInputMessageCounter");

    if(container && messageInput && messageCounter && messageInput.value){
        var wrapper = document.createElement("div");
        wrapper.setAttribute("class", "w-full h-auto flex justify-end");
        container.appendChild(wrapper);

        var contentWrapper = document.createElement("div");
        contentWrapper.setAttribute("class", "flex flex-col");
        wrapper.appendChild(contentWrapper);

        var senderP = document.createElement("h1");
        senderP.setAttribute("class", "font-roboto text-left text-black text-sm");
        senderP.append(document.createTextNode(global_sender + " (You)"));
        contentWrapper.appendChild(senderP);

        var messageWrapper = document.createElement("div");
        messageWrapper.setAttribute("class", "w-[10rem] h-auto bg-[#ffd76b] p-2 rounded-md");
        contentWrapper.appendChild(messageWrapper);

        var messageContent = document.createElement("p");
        messageContent.setAttribute("class", "font-roboto text-left text-sm text-black text-wrap break-words");
        messageContent.append(document.createTextNode(messageInput.value));
        messageWrapper.appendChild(messageContent);

        socket.emit("send_message_room", global_roomName, global_sender, messageInput.value);

        messageInput.value = "";
        messageCounter.innerText = 0 + "/300";

        container.scrollTo(0, container.scrollHeight);
    }
}

function leaveRoom(){
    deleteCookie("roomToken");
    socket.emit("leave_room", global_roomName, global_sender);
    window.location.href = "/welcome/Home/" + global_sender;
}

function joined_room_notif(){
    user_join_count++;

    var body = document.body;
    var divWrapper = document.createElement("div");
    divWrapper.setAttribute("class", "absolute opacity-0 top-[-1rem] w-[30vw] h-auto p-4 rounded-lg bg-[#EEF1DA]");
    divWrapper.setAttribute("id", "notifPopUp_" + user_join_count);
    body.appendChild(divWrapper);

    var content = document.createElement("p");
    content.setAttribute("class", "font-roboto text-sm text-green-500 text-center");
    content.appendChild(document.createTextNode(`You joined the room.`));
    divWrapper.appendChild(content);

    var divPop = document.getElementById("notifPopUp_" + user_join_count);

    if(divPop){
        divPop.style.animation = "popUp 1s forwards, popUp 1s forwards reverse 2s";

        setTimeout(() => {
            divPop.addEventListener("animationend", (event)=>{
                divPop.remove();
            });
        }, 2500);
    }
}

joined_room_notif();
roomInformation();