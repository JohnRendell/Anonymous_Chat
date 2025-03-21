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

//cookie stuff
async function deleteCookie() {
    try{
        const clearCookie = await fetch("/cookieStatus/deleteCookie", {
            method: "GET"
        });

        if(!clearCookie.ok){
            alert("Deleting cookie failed");
        }
    }
    catch(err){
        console.log(err);
    }
}

async function getCookie() {
    try{
        const readCookie = await fetch("/cookieStatus/getCookie", {
            method: "GET",
        });

        if(readCookie.ok){
            let readCookieText = await readCookie.text();
            return readCookieText;
        }
    }
    catch(err){
        console.log(err);
    }
}

async function hasCookie(){
    try{
        let text = await getCookie();

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