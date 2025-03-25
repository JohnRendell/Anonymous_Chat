function sendUserMessage(user){
    var container = document.getElementById(`${user}MessageContents`);
    var messageInput = document.getElementById(`${user}MessageInput`);
    var messageCounter = document.getElementById(`${user}InputMessageCounter`);

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

        socket.emit("privateMessages", global_sender, user, messageInput.value);

        messageInput.value = "";
        messageCounter.innerText = 0 + "/300";

        container.scrollTo(0, container.scrollHeight);
    }
}

function activateUserModal(user, id, status){
    var globalModal = document.getElementById(id);
    var clearAlert = document.getElementById(`${user}_alert`);

    if(globalModal){
        globalModal.style.display = status;
    }

    if(clearAlert){
        if(status === "none"){
            clearAlert.innerText = "";
        }
    }
}

function getUserModal(user){
    var userModal = document.getElementById(`${user}MessageModal`);

    if(userModal){
        activateUserModal(user, userModal.id, "flex");
    }
}

function createUserModal(user){
    var body = document.body;
    var userModal = document.getElementById(`${user}MessageModal`);

    if(!userModal){
        var modalBg = document.createElement("div");
        modalBg.setAttribute("class", "absolute w-screen h-screen bg-black/50 justify-center items-center hidden");
        modalBg.setAttribute("id", `${user}MessageModal`);
        body.appendChild(modalBg);

        var modalContainer = document.createElement("div");
        modalContainer.setAttribute("class", "w-[80%] h-auto bg-[#D5E5D5] rounded-lg md:w-[60%]");
        modalBg.appendChild(modalContainer);

        var modalHeader = document.createElement("div");
        modalHeader.setAttribute("class", "w-full h-auto bg-[#cafaca] p-2 flex items-center justify-between");
        modalContainer.appendChild(modalHeader);

        var modalTitle = document.createElement("h1");
        modalTitle.setAttribute("class", "w-full h-full text-center text-md text-black font-roboto font-bold");
        modalTitle.appendChild(document.createTextNode(`${user} Messages`));
        modalHeader.appendChild(modalTitle);

        var modalCloseButton = document.createElement("div");
        modalCloseButton.setAttribute("class", "p-2 w-[2rem] h-[2rem]flex justify-center items-center cursor-pointer");
        modalCloseButton.setAttribute("onclick", `activateUserModal('${user}', '${user}MessageModal', 'none')`);
        modalHeader.appendChild(modalCloseButton);

        var modalCloseButtonLabel = document.createElement("h1");
        modalCloseButtonLabel.setAttribute("class", "text-red-500 font-bold text-center text-3xl");
        modalCloseButtonLabel.appendChild(document.createTextNode('×'));
        modalCloseButton.appendChild(modalCloseButtonLabel);

        var modalContentWrapper = document.createElement("div");
        modalContentWrapper.setAttribute("class", "w-full h-auto p-2 flex flex-col gap-2");
        modalContainer.appendChild(modalContentWrapper);

        var modalContainerMessage = document.createElement("div");
        modalContainerMessage.setAttribute("class", "w-full h-[20rem] bg-[#EEF1DA] rounded-md overflow-x-hidden overflow-y-auto scroll-smooth flex flex-col gap-4 p-2 max-xsm:h-[10rem]");
        modalContainerMessage.setAttribute("id", `${user}MessageContents`);
        modalContentWrapper.appendChild(modalContainerMessage);

        var modalInputWrapper = document.createElement("div");
        modalInputWrapper.setAttribute("class", "w-full h-auto flex justify-between items-center gap-4");
        modalContentWrapper.appendChild(modalInputWrapper);

        var modalInput = document.createElement("textarea");
        modalInput.setAttribute("class", "bg-white p-4 font-roboto text-sm text-left rounded-lg w-full h-[4rem] outline-none");
        modalInput.setAttribute("id", `${user}MessageInput`)
        modalInput.setAttribute("type", "text");
        modalInput.setAttribute("placeholder", "Type Message...");
        modalInput.setAttribute("maxlength", "300");
        modalInput.setAttribute("oninput", `textCounter('${user}MessageInput', '${user}InputMessageCounter', 300)`);
        modalInputWrapper.appendChild(modalInput);

        var modalButtonWrapper = document.createElement("div");
        modalButtonWrapper.setAttribute("class", "flex flex-col gap-2 items-center");
        modalInputWrapper.appendChild(modalButtonWrapper);

        var modalSendButton = document.createElement("button");
        modalSendButton.setAttribute("class", "bg-green-500 font-roboto text-center text-white text-sm w-auto h-auto p-2 rounded-md cursor-pointer active:bg-green-700");
        modalSendButton.setAttribute("onclick", `sendUserMessage('${user}')`);
        modalSendButton.appendChild(document.createTextNode("Send"));
        modalButtonWrapper.appendChild(modalSendButton);

        var modalInputCounter = document.createElement("p");
        modalInputCounter.setAttribute("class", "font-roboto text-left text-sm text-black");
        modalInputCounter.setAttribute("id", `${user}InputMessageCounter`);
        modalInputCounter.appendChild(document.createTextNode("0/300"));
        modalButtonWrapper.appendChild(modalInputCounter);
    }
}

//displaying all active users
socket.on("list_users", (activeUsers)=>{
    var container = document.getElementById("stuffContainer");

    if(container){
        activeUsers.forEach(user => {
            if(user.username !== global_sender){
                createUserModal(user.username);
                
                var messageUser = document.getElementById(user.username + "_message");

                if(!messageUser){
                    var wrapper = document.createElement("div");
                    wrapper.setAttribute("class", "w-full h-[2rem] bg-transparent flex justify-between items-center p-2 cursor-pointer hover:bg-[#ADB2D4] group");
                    wrapper.setAttribute("id", user.username + "_message");
                    wrapper.setAttribute("onclick", `getUserModal('${user.username}')`);
                    container.appendChild(wrapper);

                    var title = document.createElement("p");
                    title.setAttribute("class", "group-hover:text-white text-center text-sm text-black font-roboto");
                    title.appendChild(document.createTextNode(user.username));
                    wrapper.appendChild(title);

                    var alertMsg = document.createElement("p");
                    alertMsg.setAttribute("class", "text-center text-sm text-red-500 font-roboto");
                    alertMsg.setAttribute("id", `${user.username}_alert`);
                    wrapper.appendChild(alertMsg);
                }
            }
        });
    }
});

//when user receive a message
socket.on("privateMessages", (receiver, msg)=>{
    var container = document.getElementById(`${receiver}MessageContents`);
    
    if(container){
        var getAlert = document.getElementById(`${receiver}_alert`);

        if(getAlert){
            getAlert.innerText = "New Messages";
        }

        var wrapper = document.createElement("div");
        wrapper.setAttribute("class", "w-full h-auto flex justify-start");
        container.appendChild(wrapper);

        var contentWrapper = document.createElement("div");
        contentWrapper.setAttribute("class", "flex flex-col");
        wrapper.appendChild(contentWrapper);

        var senderP = document.createElement("h1");
        senderP.setAttribute("class", "font-roboto text-left text-black text-sm");
        senderP.append(document.createTextNode(receiver));
        contentWrapper.appendChild(senderP);

        var messageWrapper = document.createElement("div");
        messageWrapper.setAttribute("class", "w-[10rem] h-auto bg-[#ffc936] p-2 rounded-md");
        contentWrapper.appendChild(messageWrapper);

        var messageContent = document.createElement("p");
        messageContent.setAttribute("class", "font-roboto text-left text-sm text-black text-wrap break-words");
        messageContent.append(document.createTextNode(msg));
        messageWrapper.appendChild(messageContent);

        container.scrollTo(0, container.scrollHeight);
    }
});

//when user leave
socket.on("user_leave", (user)=>{
    var messageUser = document.getElementById(user + "_message");

    if(messageUser){
        messageUser.remove();
    }
});

//for searching user
socket.on("findingUser", (query, status)=>{
    var container = document.getElementById("stuffContainer");
    var label = document.getElementById("notFoundLabel");

    if(container && label){
        var containerChild = Array.from(container.children);

        for(let child of containerChild){
            if(query){
                child.style.display = "none";

                if(status == "found"){
                    if(child.id == (query + "_message")){
                        child.style.display = "flex";
                        label.style.display = "hidden";
                    }
                }
                else{
                    label.style.display = "block";
                    label.innerText = status;
                }
            }
            else{
                label.style.display = "none";
                child.style.display = "flex";
            }
        }

        if(query.length == 0){
            label.style.display = "none";
        }
    }
});

//for room display
socket.on("displayRoom", (roomList)=>{
    var roomContainer = document.getElementById("roomContainer"); 

    if(roomContainer){
        roomList.forEach(room => {
            let roomOwner = room.roomOwner;
            let roomName = room.roomName;
            let roomType = room.roomType;
            let roomMax = room.roomMax;
            let roomCode = room.roomCode;
            var checkRoom = document.getElementById(roomName + "_room");

            if(!checkRoom){
                var roomWrapper = document.createElement("div");
                roomWrapper.setAttribute("class", "w-full h-[2rem] bg-transparent flex justify-between items-center p-2 cursor-pointer");
                roomWrapper.setAttribute("id", roomName + "_room");
                roomContainer.appendChild(roomWrapper);

                var roomLabel = document.createElement("p");
                roomLabel.setAttribute("class", "text-center text-sm text-black font-roboto");
                roomLabel.appendChild(document.createTextNode(roomType == "private" ? roomName + " (Private)" : roomName));
                roomWrapper.appendChild(roomLabel);

                var joinButton = document.createElement("button");
                joinButton.setAttribute("class", "bg-[#ADB2D4] w-auto h-auto p-2 rounded-lg font-roboto text-center text-sm text-white cursor-pointer text-nowrap active:bg-[#8f98db]");
                joinButton.setAttribute("onclick", `getRoomData('${roomOwner}', '${roomName}', '${roomType}', '${roomMax}', '${roomCode}')`);
                joinButton.appendChild(document.createTextNode("Join Room"));
                roomWrapper.appendChild(joinButton);
            }
        });
    }
});

//for removing room
socket.on("remove_room", (roomName)=>{
    var checkRoom = document.getElementById(roomName + "_room");

    if(checkRoom){
        checkRoom.remove();
    }
    else{
        alert("Room has been deleted by the owner. Click OK to continue.");
        
        setTimeout(() => {
            window.location.href = "/Welcome/Home/" + global_sender;
        }, 500);
    }
});

socket.on("create_room", async (status, roomList)=>{
    var validationDiv = document.getElementById("loadingValidate");

    if(validationDiv){
        validationDiv.style.display = "none";
    }

    if(status === "success"){
        socket.emit("displayRoom");
        redirectToRoom(roomList);

        //clear the inputs
        var roomCodeDiv = document.getElementById("roomCreationPrivateCode");
        var roomName = document.getElementById("roomCreationInput");
        var maxRoomCount = document.getElementById("maxRoomUser");
        var privateRoomType = document.getElementById("privateRoom");
        var publicRoomType = document.getElementById("publicRoom");
        var roomCodeID = document.getElementById("roomCreationCodeInput");
        var roomNameCounter = document.getElementById("roomCreationInputCounter")

        if(roomCodeDiv && roomName && roomNameCounter && maxRoomCount && privateRoomType && publicRoomType && roomCodeID){
            roomName.value = "";
            maxRoomCount.value = "5";
            privateRoomType.checked = false;
            publicRoomType.checked = true;
            roomCodeID.value = "";
            roomCodeDiv.style.display = "none";
            roomNameCounter.innerText = "0/20";
        }
        modalStatus('roomCreationModal', 'none');
    }
    else{
        let text = await getCookie("roomToken");

        if(text === "No Cookie"){
            div_popUp(status);
            divPopUpCount++;
        }
    }
})