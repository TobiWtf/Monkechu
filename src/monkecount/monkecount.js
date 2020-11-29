const { ipcRenderer, remote } = require('electron')

let buildpath = require("path").join;

let path = remote.app.getAppPath();

const name = require(buildpath(path, "src/monkelib/values.js")).config.name;
document.title = name + " profile";

const storageModule = require(
    buildpath(
        path,
        "src/monkelib/storage.js",
    ),
);

const makeBold = async (text) => {
    let b = document.createElement("b");

    b.innerText = text;
    
    return b;
};

const makeDiv = async () => {
    div =  document.createElement("div");
    
    return div
};

const makeStat = async (title, value) => {
    let div = await makeDiv();

    let b = await makeBold(title);
    
    let br = document.createElement("br");
    
    div.appendChild(b);
    
    div.appendChild(br);
    
    let p = document.createElement("p");
    
    p.innerText = value;
    
    div.appendChild(p);
    
    return div;
};
const imonke = require("imonke");

const accountObject = async () => {
    let client;

    client = ipcRenderer.sendSync("get-client");
    
    console.log(client)
    //let user = await client.data;

    let user = ipcRenderer.sendSync("get-client-data");

    let profileBox = await makeDiv();
    
    profileBox.className += "Profile MonkeText";
    
    let pfpAndName = await makeDiv();

    pfp = document.createElement('img');
    
    pfp.className += "MonkeBigPFP";
    
    pfp.src = buildpath(
        path,
        "src/monkeshare/dump/imonke.ico",
    );

    let usernameOuter = document.createElement("span");
    
    usernameOuter.className += "newLine centered-content";
    
    usernameOuter.style = "width: 320px; margin-left: 10px";
    
    let username = document.createElement('b');
    
    username.innerText = user.nick;
    
    usernameOuter.appendChild(username);

    pfpAndName.appendChild(pfp);
    
    pfpAndName.appendChild(usernameOuter);

    stats = await makeDiv();
    
    stats.className += "ProfileStats";
    
    let posts = await makeStat("Posts",  user.post_count);
    
    let subs = await makeStat("Subscribers", user.subscriber_count);
    
    let subbed = await makeStat("Subscription", user.subscription_count);

    stats.appendChild(posts);
    
    stats.appendChild(subs);
    
    stats.appendChild(subbed);

    profileBox.appendChild(pfpAndName);
    
    profileBox.appendChild(stats);
    
    return profileBox;
}; // Makes the account box itself. No posts/feed

const account = async () =>{
    document.title = "Profile"
    
    let field = document.getElementById("account");
    
    let accountData = await accountObject();
    
    field.appendChild(accountData);

}; // Generates the account html

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
};

css();

account();
