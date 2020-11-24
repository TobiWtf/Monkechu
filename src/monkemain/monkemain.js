const remote = require("electron").remote;
let path = remote.app.getAppPath();
const monkelib = require("imonke");
let buildpath = require("path").join
const name = require(buildpath(path, "/monkelib/values.js")).config.name;
document.title = name + " Home";


const createCss = async (path) => {
    let myCss = document.createElement("link");
    myCss.type = "text/css";
    myCss.rel = "stylesheet";
    myCss.href = path;
    return myCss;
};

const css = async () => {
    let scripts = document.getElementById("scripts");
    let index = [
        createCss(buildpath(path, "/monkeshare/shared-lib.css"))
    ];
    for (let value in index) {
        scripts.appendChild(await index[value]);
    };
}

css();