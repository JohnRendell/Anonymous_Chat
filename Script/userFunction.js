var global_sender;
let tempRoomData = {};

async function readTokenCookie() {
    let text = await getCookie("token");
    var welcomeHeader = document.getElementById("welcomeHeader");

    if(text && welcomeHeader){
        welcomeHeader.innerText = "Welcome " + text;
        global_sender = text;
    }
}

async function user_pageRefresh() {
    try{
        let text = await getCookie("token");

        if(text === "No Cookie"){
            socket.emit("user_leave", global_sender);
            window.location.href = "/";
        }
        else{
            reloadPage(socket, text);
        }
    }
    catch(err){
        alert("Error reading socket");
        console.log(err);
    }
}

async function logout() {
    var loadingValidate = document.getElementById("loadingValidate");

    if(loadingValidate){
        loadingValidate.style.display = "flex";
    }
    socket.emit("user_logout", socket.id, "welcomePage");
    socket.emit("user_leave", global_sender);
    deleteCookie("token");
    deleteCookie("roomToken");
}

function sendMessage(){
    var container = document.getElementById("globalMessageContainer");
    var messageInput = document.getElementById("globalMessageInput");
    var messageCounter = document.getElementById("globalInputMessageCounter");

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

        socket.emit("globalMessages", global_sender, messageInput.value);

        messageInput.value = "";
        messageCounter.innerText = 0 + "/300";

        container.scrollTo(0, container.scrollHeight);
    }
}

function modalStatus(id, status){
    var modal = document.getElementById(id);

    if(modal){
        modal.style.display = status;
    }
}

function searchUser(){
    var query = document.getElementById("searchUser");

    if(query){
        socket.emit("findingUser", query.value);
    }
}

function generateRoomCode() {
    var inputCode = document.getElementById("roomCreationCodeInput");
    
    if (inputCode) {
        let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let generatedCode = "";

        for (let i = 0; i < 5; i++) {
            generatedCode += characters.charAt(Math.floor(Math.random() * characters.length));
        }

        inputCode.value = generatedCode;
    }
}

function pickRoomType(id){
    var roomType = document.getElementById(id);
    var roomCodeDiv = document.getElementById("roomCreationPrivateCode");

    if(roomCodeDiv){
        if(roomType.value == "Private" && roomType.checked){
            roomCodeDiv.style.display = "flex";
        }
        else{
            roomCodeDiv.style.display = "none";
        }
    }
}

function createRoom(){
    var roomName = document.getElementById("roomCreationInput");
    var maxRoomCount = document.getElementById("maxRoomUser");
    var privateRoomType = document.getElementById("privateRoom");
    var publicRoomType = document.getElementById("publicRoom");
    var roomCodeID = document.getElementById("roomCreationCodeInput");

    if(roomName && maxRoomCount && privateRoomType && publicRoomType && roomCodeID){
        if(!roomName.value){
            div_popUp("Room name is empty.");
            divPopUpCount++;
        }
        else if (!maxRoomCount.value.trim() || isNaN(maxRoomCount.value) || parseInt(maxRoomCount.value) != maxRoomCount.value) {
            div_popUp("Room count must be a number and it should not be empty.");
            divPopUpCount++;
        } 
        else if (parseInt(maxRoomCount.value) < 5 || parseInt(maxRoomCount.value) > 20) {
            div_popUp("Room should be between five and twenty.");
            divPopUpCount++;
        }
        else if(roomName.value.length <= 3){
            div_popUp("Room name is too short, minimum of four characters.");
            divPopUpCount++;
        }
        else if(privateRoomType.checked && !roomCodeID.value){
            div_popUp("Room code cannot be empty if the type is set to private.");
            divPopUpCount++;
        }
        else if(privateRoomType.checked && roomCodeID.value.length <= 4){
            div_popUp("Room code should be max at five characters.");
            divPopUpCount++;
        }
        else{
            let roomData = { roomOwner: global_sender, roomName: roomName.value, max: maxRoomCount.value, type: privateRoomType.checked ? "private" : "public", roomCode: privateRoomType.checked ? roomCodeID.value : "none" };

            var validationDiv = document.getElementById("loadingValidate");

            if(validationDiv){
                validationDiv.style.display = "flex";
            }

            socket.emit("create_room", roomData);
        }
    }
}

async function getRoomData(roomOwner, roomName, roomType, roomMax, roomCode){
    var validate = document.getElementById("loadingValidate");
    var roomTitle = document.getElementById("roomTitle");

    if(validate){
        validate.style.display = "flex";
    }

    if(roomTitle){
        roomTitle.innerText = roomName;
        tempRoomData = roomCode;
    }

    let cookieData = {
        roomOwner: roomOwner,
        roomName: roomName,
        type: roomType,
        max: roomMax,
        roomCode: roomCode
    }

    tempRoomData = cookieData;

    if(roomType == "private"){
        if(validate){
            validate.style.display = "none";
        }
        modalStatus("roomCodeModal", "flex");
    }
    else{
        redirectToRoom(tempRoomData);
    }
}

async function redirectToRoom(roomData) {
    try{
        const setRoomCookie = await fetch("/cookieStatus/setCookie", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ data: roomData, cookieType: "roomToken" })
        });

        const setRoomCookie_data = await setRoomCookie.json();

        if(setRoomCookie_data.message === "success"){
            window.location.href = "/Welcome/Room/" + roomData.roomName;
        }
    }
    catch(err){
        console.log(err)
    }
}

async function validateRoomCode() {
    var roomCodeInput = document.getElementById("roomCodeInput");

    if(roomCodeInput){
        if(roomCodeInput.value == tempRoomData.roomCode){
            redirectToRoom(tempRoomData);
        }
        else{
            div_popUp("Wrong room code");
            divPopUpCount++;
        }
    }
}

readTokenCookie();
user_pageRefresh();