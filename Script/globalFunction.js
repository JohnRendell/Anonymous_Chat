function textCounter(id, counterID, maxInputLength){
    var input = document.getElementById(id).value;
    document.getElementById(counterID).innerText = input.length + "/" + maxInputLength;
}