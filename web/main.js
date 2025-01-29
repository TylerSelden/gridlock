import * as Engine from "./engine/main.js";

window.onerror = function(msg, url, linenumber) {
    alert('Error message: '+msg+'\nURL: '+url+'\nLine Number: '+linenumber);
    return true;
}

window.onload = Engine.init;
