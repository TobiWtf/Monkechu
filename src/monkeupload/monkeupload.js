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

const run = async () => {
    const realFileButton = document.getElementById("real-file");
    const customText = document.getElementById("custom-text");
    const customButton = document.getElementById("custom-button");
    const submitButton= document.getElementById("submit");

    customButton.addEventListener(
        "click",
        async () => {
            realFileButton.click();
        },
    );

    realFileButton.addEventListener(
        "change",
        async () => {
            if (realFileButton.value) {
                customText.innerText = "";
            } else {
                customText.innerText = "No file chosen yet";
            };
        },
    );

    submitButton.addEventListener(
        "click",
        async () => {
            if (realFileButton.value) {
                const config = {
                    tags: [],
                    featurable: true,
                    nsfw: false,
                    path: realFileButton.files[0].path,
                }
                let post = ipcRenderer.sendSync(
                    "client-post", 
                    config
                );

                alert("Image sent to iMonke...")
                    
                if (post.error) {
                    return alert(`Something went terribly wrong...\n\n"${post.reason}"`)
                };

                alert("Image posted!\n\n")

                ipcRenderer.send(
                    "create-window", 
                    {
                        window: "src/monkeupload/monkeupload.html"
                    }
                );
            } else {
                return alert("No file chosen")
            }
        },
    );
}
run();
css();