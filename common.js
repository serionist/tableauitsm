function setError(id, msg) {
    if (msg) {
        document.getElementById(id).innerText = msg;
        document.getElementById(id).style.display = "block";
    } else {
        document.getElementById(id).innerText = "";
        document.getElementById(id).style.display = "none";
    }
}
