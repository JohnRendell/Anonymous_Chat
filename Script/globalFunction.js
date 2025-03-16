function textCounter(id, counterID){
    var input = document.getElementById(id).value;
    document.getElementById(counterID).innerText = input.length + "/20";
}