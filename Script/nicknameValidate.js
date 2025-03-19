let divPopUpCount = 0;

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
        socket.emit("registerNickname", input.value);
    }
}