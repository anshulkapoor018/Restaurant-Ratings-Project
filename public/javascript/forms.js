function openForm() {
    document.getElementById("myForm").style.display = "block";
}

function closeForm() {
    document.getElementById("myForm").style.display = "none";
}

function openLoginForm() {
    document.getElementById("myLoginForm").style.display = "block";
}

function closeLoginForm() {
    document.getElementById("myLoginForm").style.display = "none";
}

function openAlert() {
    document.getElementById("myAlert").style.display = "block";
}

function closeAlert() {
    document.getElementById("myAlert").style.display = "none";
}

function openCommentBox() {
    document.getElementById("row-override").style.display = "block";
}

function closeCommentBox() {
    document.getElementById("row-override").style.display = "none";
}

document.getElementById("routeToLogin").onclick = function () {
    location.href = "/users/login";
};