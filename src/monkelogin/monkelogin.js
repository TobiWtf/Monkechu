const remote = require("electron").remote;
const { ipcRenderer } = require('electron')

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

const storageModule =require(
    buildpath(
        path,
        "src/monkelib/storage.js",
    ),
);

const storage = new storageModule();

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
    let email = document.getElementById("email-input").value;
    let password = document.getElementById("password-input").value;
    
    if (email === "") {
        return alert("Please add a value for field 'email'");
    };

    if (password === "") {
        return alert("Please add a value for field 'password'");
    };

    client = new imonke.Client();

    Login= await client.login(
        {
            email: email,
            password: password,
        },
    );
    
    if (Login == false) {
        return alert("Something went wrong logging in...");
    };

    if (Login == true) {
        storage.SetLogin(
            client._email,
            client._secret,
            client._token,
        );
        ipcRenderer.send(
            "create-window", 
            {
                window: "src/monkefeed/monkefeed.html",
                needsLogin: false,
            },
        );
    };
};

css();