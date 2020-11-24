const remote = require("electron").remote;
let buildpath = require("path").join
let path = remote.app.getAppPath();
const name = require(buildpath(path, "/src/monkelib/values.js")).config.name;
document.title = name + " Feed";

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
        createCss(buildpath(path, "/src/monkeshare/centered-content.css")),
        createCss(buildpath(path, "/src/monkeshare/shared-lib.css"))
    ];
    for (let value in index) {
        scripts.appendChild(await index[value]);
    };
}

css();