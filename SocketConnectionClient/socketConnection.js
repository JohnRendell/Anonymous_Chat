const socket = io();
let globalMessageCounter = 0;

socket.on("connect", ()=>{
    var socketID = document.getElementById("socketID");

    if(socketID){
        socketID.innerText = "Socket ID: " + socket.id;
    }
    socket.emit("list_users");
    socket.emit("displayRoom");
});

socket.on("registerNickname", async (nickname, status)=>{
    var loadingValidate = document.getElementById("loadingValidate");

    if(loadingValidate){
        loadingValidate.style.display = "none";
    }

    if(status === "success"){
        try{
            const setCookie = await fetch("/cookieStatus/setCookie", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ data: nickname, cookieType: "token" })
            });

            const setCookie_data = await setCookie.json();

            if(setCookie_data.message === "success"){
                window.location.href = "/Welcome/Home/" + nickname;
            }
        }
        catch(err){
            console.log(err);
        }
    }
    else{
        div_popUp(status);
    }
});

socket.on("globalMessages", (receiver, msg)=>{
    globalMessageCounter++;
    var container = document.getElementById("globalMessageContainer");
    var divType = document.getElementById(receiver + "_typingID");

    if(container){
        var globalMessageCounterDiv = document.getElementById("globalMessageCounter");

        if(globalMessageCounterDiv){
            globalMessageCounterDiv.innerText = globalMessageCounter >= 0 ? (globalMessageCounter >= 10 ? "10+" : globalMessageCounter) : "";
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

    if(divType){
        divType.remove();
    }

});

socket.on("while_typing", (containerID, receiver, inputLength)=>{
    var container = document.getElementById(containerID);
    var divType = document.getElementById(receiver + "_typingID");

    if(container && !divType){
        var typingDiv = document.createElement("p");
        typingDiv.setAttribute("class", "w-full h-fit p-2 font-roboto text-sm text-center text-black");
        typingDiv.setAttribute("id", receiver + "_typingID");
        typingDiv.appendChild(document.createTextNode(`${receiver} typing...`));
        container.appendChild(typingDiv);
        
        container.scrollTo(0, container.scrollHeight);
    }

    if(divType){
        divType.style.animation = "typingAnim 1s infinite alternate";
    }

    if(inputLength <= 0 && divType){
        divType.remove();
    }
});

socket.on("user_logout", ()=>{
    window.location.href = "/";
});