const socket = io();

socket.on("connect", ()=>{
    var socketID = document.getElementById("socketID");

    if(socketID){
        socketID.innerText = "Socket ID: " + socket.id;
    }
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

socket.on("user_logout", ()=>{
    window.location.href = "/";
});