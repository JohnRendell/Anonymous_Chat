function textCounter(id, counterID, maxInputLength){
    var input = document.getElementById(id).value;
    document.getElementById(counterID).innerText = input.length + "/" + maxInputLength;
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