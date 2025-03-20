//displaying all active users
socket.on("list_users", (activeUsers)=>{
    var container = document.getElementById("stuffContainer");

    if(container){
        activeUsers.forEach(user => {
            if(user.username !== global_sender){
                var messageUser = document.getElementById(user.username + "_message");

                if(!messageUser){
                    var wrapper = document.createElement("div");
                    wrapper.setAttribute("class", "w-full h-[2rem] bg-transparent flex justify-between items-center p-2 cursor-pointer hover:bg-[#ADB2D4] group");
                    wrapper.setAttribute("id", user.username + "_message");
                    wrapper.setAttribute("onclick", "modal_type_func('" + user.username + " message'); toggleRoom('messagePanel')");
                    container.appendChild(wrapper);

                    var title = document.createElement("p");
                    title.setAttribute("class", "group-hover:text-white text-center text-sm text-black font-roboto");
                    title.appendChild(document.createTextNode(user.username));
                    wrapper.appendChild(title);

                    var counter = document.createElement("p");
                    counter.setAttribute("class", "text-center text-sm text-red-500 font-roboto");
                    counter.appendChild(document.createTextNode("99+"));
                    wrapper.appendChild(counter);
                }
            }
        });
    }
});