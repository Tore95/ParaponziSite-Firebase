function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    $('#cookie-policy').remove();
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie(name) {
    var user = getCookie("username");
    if (user !== "") {
        alert("Welcome again " + user);
    } else {
        user = prompt("Please enter your name:", "");
        if (user !== "" && user != null) {
            setCookie("username", user, 365);
        }
    }
}

$(document).ready(function () {
    let user = getCookie("policy");
    if (user === "") {
        $("body").append(`
            <div id="cookie-policy" style="position: fixed; bottom: 0; width: 100vw; background-color: #000000; z-index: 100">
            <div class="container ptb-25">
                <h1>Cookie Policy</h1>
                <p>Questo necessita dei cookie per il suo corretto funzionamento, continuando a navigare accetterai implicitamente la cookie policy.</p>
                <input class="butn" type="button" value="Ok" onclick="setCookie('policy','true',30)">
            </div>
            </div>
        `);
    }
});