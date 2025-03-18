const socket = io();

socket.on("connect", ()=>{
    var socketID = document.getElementById("socketID");

    if(socketID){
        socketID.innerText = "Socket ID: " + socket.id;
    }
});