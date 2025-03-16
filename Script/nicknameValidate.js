function submitNickname(){
    var input = document.getElementById("nicknameInputID");
    var warningText = document.getElementById("nicknameWarningTextID");

    if(!input.value){
        input.style.borderStyle = "solid";
        input.style.borderWidth = "2px";
        input.style.borderColor = "red";
        warningText.innerText = "Nickname should not be empty.";
    }
    else if(input.value.length <= 4){
        input.style.borderStyle = "solid";
        input.style.borderWidth = "2px";
        input.style.borderColor = "red";
        warningText.innerText = "Nickname should not equal or below 4 characters.";
    }
    else{
        document.getElementById("nicknameDivPopUp").remove();
        document.getElementById("displayUserName").innerText = "Welcome " + input.value;
    }
}