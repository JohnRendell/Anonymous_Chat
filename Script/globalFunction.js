let divPopUpCount = 0;

function textCounter(inputID, counterID, maxInputLength){
    var input = document.getElementById(inputID).value;
    document.getElementById(counterID).innerText = input.length + "/" + maxInputLength;
}

function reloadPage(socket, nickname){
    socket.emit("pageRefresh", nickname);
}

function div_popUp(text){
    var body = document.body;
    var divWrapper = document.createElement("div");
    divWrapper.setAttribute("class", "absolute opacity-0 top-[-1rem] w-[30vw] h-auto p-4 rounded-lg bg-[#EEF1DA]");
    divWrapper.setAttribute("id", "divPopUp_" + divPopUpCount);
    body.appendChild(divWrapper);

    var content = document.createElement("p");
    content.setAttribute("class", "font-roboto text-sm text-red-500 text-center");
    content.appendChild(document.createTextNode(text));
    divWrapper.appendChild(content);

    var divPop = document.getElementById("divPopUp_" + divPopUpCount);

    if(divPop){
        divPop.style.animation = "popUp 1s forwards, popUp 1s forwards reverse 2s";

        setTimeout(() => {
            divPop.addEventListener("animationend", (event)=>{
                divPop.remove();
            });
        }, 2500);
    }
}

//while typing
function whileTyping(containerID, inputID){
    var divType = document.getElementById(inputID);

    if(divType){
        socket.emit("while_typing", containerID, global_sender, divType.value.length);
    }
}

//cookie stuff
async function deleteCookie(cookieType) {
    try{
        const clearCookie = await fetch("/cookieStatus/deleteCookie", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ cookieType: cookieType })
        });

        const clearCookie_data = await clearCookie.json();

        if(clearCookie_data.message !== "success"){
            alert("Deleting cookie failed");
        }
    }
    catch(err){
        console.log(err);
    }
}

async function getCookie(cookieType) {
    try{
        const readCookie = await fetch("/cookieStatus/getCookie", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ cookieType: cookieType })
        });

        const readCookie_data = await readCookie.json();

        if(readCookie_data.message === "success"){
            let readCookieText = readCookie_data.data;
            return readCookieText;
        }
    }
    catch(err){
        console.log(err);
    }
}

async function hasCookie(cookieType){
    try{
        let text = await getCookie(cookieType);

        if(text === "No Cookie"){
            socket.emit("user_logout", socket.id, "index_page");
        }
        else{
            window.location.href = "/Welcome/Home/" + text;
        }
    }
    catch(err){
        console.log(err);
    }
}