async function readCookie() {
    let text = await getCookie();
    var welcomeHeader = document.getElementById("welcomeHeader");

    if(text && welcomeHeader){
        welcomeHeader.innerText = "Welcome " + text;
    }
}

readCookie();