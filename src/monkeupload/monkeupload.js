let buildpath = require("path").join;

const { ipcRenderer, remote } = require('electron')

let path = remote.app.getAppPath();

const createCss = async (path) => {
    let myCss = document.createElement("link");
    myCss.type = "text/css";
    myCss.rel = "stylesheet";
    myCss.href = path;
    return myCss;
}; // Creates a css element

const css = async () => {
    let scripts = document.getElementById("scripts");
    let index = [
        createCss(
            buildpath(
                path, 
                "src/monkeshare/centered-content.css"
            ),
        ),
        createCss(
            buildpath(
                path, 
                "src/monkeshare/shared-lib.css"
            ),
        ),
    ];
    for (let value in index) {
        scripts.appendChild(
            await index[value],
        );
    };
}; // Adds some css scripts to an element


function showFileName() {
    var fil = document.getElementById("myFile");
    alert(fil.value);
}

css();