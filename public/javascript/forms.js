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

function commentBoxEditForm(index) {
    var formElement = "comment-form-" + index;

    var x = document.getElementById(formElement);
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
}

function closeCommentBox() {
    document.getElementById("row-override").style.display = "none";
}

document.getElementById("routeToLogin").onclick = function () {
    location.href = "/users/login";
};