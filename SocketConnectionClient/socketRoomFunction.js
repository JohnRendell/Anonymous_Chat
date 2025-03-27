socket.on("send_message_room", (receiver, msg)=>{
    var container = document.getElementById("roomContainerMsg");
    var divType = document.getElementById(receiver + "_typingID");
    
    if(container){
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

let join_count = 0;
socket.on("join_room", (user)=>{
    join_count++;

    var body = document.body;
    var divWrapper = document.createElement("div");
    divWrapper.setAttribute("class", "absolute opacity-0 top-[-1rem] w-[30vw] h-auto p-4 rounded-lg bg-[#EEF1DA]");
    divWrapper.setAttribute("id", "divPopUp_" + join_count);
    body.appendChild(divWrapper);

    var content = document.createElement("p");
    content.setAttribute("class", "font-roboto text-sm text-green-500 text-center");
    content.appendChild(document.createTextNode(`${user} joined the room.`));
    divWrapper.appendChild(content);

    var divPop = document.getElementById("divPopUp_" + join_count);

    if(divPop){
        divPop.style.animation = "popUp 1s forwards, popUp 1s forwards reverse 2s";

        setTimeout(() => {
            divPop.addEventListener("animationend", (event)=>{
                divPop.remove();
            });
        }, 2500);
    }
});
