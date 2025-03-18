let divPopUpCount = 0;

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

async function submitNickname(){
    var input = document.getElementById("nicknameInputID");
    var loadingValidate = document.getElementById("loadingValidate");

    if(!input.value){
        div_popUp("Nickname should not be empty.");
        divPopUpCount++;
    }
    else if(input.value.length <= 4){
        div_popUp("Nickname should not equal or below 4 characters.");
        divPopUpCount++;
    }
    else{
        if(loadingValidate){
            loadingValidate.style.display = "flex";
        }
        try{
            const setCookie = await fetch("/cookieStatus/setCookie", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ nickname: input.value })
            });

            const setCookie_data = await setCookie.json();

            if(setCookie_data.message === "success"){
                if(loadingValidate){
                    loadingValidate.style.display = "none";
                }
                window.location.href = "/Welcome/Home/" + input.value;
                socket.emit("registerNickname", input.value);
            }
        }
        catch(err){
            console.log(err);
        }
    }
}