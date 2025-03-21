var global_sender;

async function readCookie() {
    let text = await getCookie();
    var welcomeHeader = document.getElementById("welcomeHeader");

    if(text && welcomeHeader){
        welcomeHeader.innerText = "Welcome " + text;
        global_sender = text;
    }
}

async function user_pageRefresh() {
    try{
        let text = await getCookie();

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
    deleteCookie();
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
    var roomCode = document.getElementById("roomCreationPrivateCode");

    if(roomCode){
        if(roomType.value == "Private" && roomType.checked){
            roomCode.style.display = "flex";
        }
        else{
            roomCode.style.display = "none";
        }
    }
}

readCookie();
user_pageRefresh();