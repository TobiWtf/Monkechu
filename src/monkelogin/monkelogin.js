const remote = require("electron").remote;

let buildpath = require("path").join;

let path = remote.app.getAppPath();

let imonke = require("imonke");

const name = require(
    buildpath(
        path, 
        "src/monkelib/values.js",
    ),
).config.name;

document.title = name + " Login";

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

const login = async () => {
    email = document.getElementById("email-input").value;
    password = document.getElementById("password-input").value;
    console.log(email);
    console.log(password);
};

css();