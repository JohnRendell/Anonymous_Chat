const socket = io();
let globalMessageCounter = 0;

socket.on("connect", ()=>{
    var socketID = document.getElementById("socketID");

    if(socketID){
        socketID.innerText = "Socket ID: " + socket.id;
    }
    socket.emit("list_users");
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
                body: JSON.stringify({ nickname: nickname })
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

        var messageContent = document.createElement("div");
        messageContent.setAttribute("class", "font-roboto text-left text-sm text-black text-wrap");
        messageContent.append(document.createTextNode(msg));
        messageWrapper.appendChild(messageContent);

        container.scrollTo(0, container.scrollHeight);
    }
});

socket.on("user_logout", ()=>{
    window.location.href = "/";
});