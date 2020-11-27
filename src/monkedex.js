
const electron = require("electron");

let buildpath = require("path").join;

let toolSet = true

let path = electron.app.getAppPath();

const storageModule =require(
    buildpath(
        path,
        "src/monkelib/storage.js",
    ),
);

storage = new storageModule();

if (require('electron-squirrel-startup')) {
    electron.app.quit();
};


let state = {};

const CreateWindow = async (path, callback=null) => {
    let call = async (arg) => {

        if (callback == null) {
            return;
        } else {
            callback(arg);
        };
    };
    if (state.mainWindow == undefined) {

        let window = new electron.BrowserWindow(
            {
                width: 800,
                height: 600,
                resizable: false,
                icon: buildpath(electron.app.getAppPath(), "src/monkeshare/dump/imonke-new-leaning-padded-large.png"),
                webPreferences: {
                    //devTools: true,
                    nodeIntegration: true,
                    enableRemoteModule: true,
                },
            },
        );

        state.mainWindow = window;

        window.loadFile(path);

        call();

        } else {
            state.mainWindow.loadFile(path);
            call();
        };
};

electron.app.on(
    "ready",
    async () => {
        await storage.clear()
        let isLoggedIn = await storage.IsLoggedIn();
        if (isLoggedIn == false) {
            menu(
                {
                    needsLogin: true,
                    dev_tools: toolSet,
                },
            );

            CreateWindow(
                "src/monkelogin/monkelogin.html",
            );

        } else {
            menu(
                {
                    needsLogin: false,
                    dev_tools: toolSet,
                },
            );

            CreateWindow(
                "src/monkefeed/monkefeed.html",
            );

        };
    },
);

electron.app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            electron.app.quit();
        };
    },
);


electron.app.on('activate', () => {
        if (electron.BrowserWindow.getAllWindows().length === 0) {
            CreateWindow(
                "src/monkemain/monkemain.html",
            );
        };
    },
);

electron.ipcMain.on("create-window", async (event, arg) => {

        menu(
            {
                needsLogin: false,
                dev_tools: toolSet,
            },
        );

        CreateWindow(
            arg,
        );
    },
);

const menu = (opts={needsLogin:false, dev_tools:true}) => {

    let MonkeMenuLoggedIn = {
        label: "Monke",
        submenu: [
            {
                type: "separator",
            },
            {
                label: "home",
                click(){
                    CreateWindow("src/monkemain/monkemain.html");
                }
            },
            {
                type: "separator",
            },
            {
                label: "feed", 
                click() {
                    CreateWindow("src/monkefeed/monkefeed.html");
                },
            },
            {
                type: "separator",
            },
            {
                label: "profile (Not working)", 
                click() {
                    CreateWindow("src/monkecount/monkecount.html")
                },
            },
            {
                type: "separator",
            },
            {
                label: "exit", 
                click() {
                    electron.app.quit();
                },
            },
            {
                type: "separator",
            },
        ],
    };

    let MonkeMenuNotLoggedIn = {
        label: "Monke",
        submenu: [
            {
                label: "login", 
                click() {
                    CreateWindow("src/monkelogin/monkelogin.html")
                },
            },
            {
                type: "separator",
            },
            {
                label: "exit", 
                click() {
                    electron.app.quit();
                },
            },
        ],
    };
    
    let DevMenu = {
        label: "Dev",
        submenu: [
            {
                label: "console",
                click() {
                    state.mainWindow.webContents.openDevTools();
                },
            },
        ],
    }

    let template = [];
    if (opts.needsLogin == true) {
        template.push(MonkeMenuNotLoggedIn,);
    };
    if (opts.needsLogin == false) {
        template.push(MonkeMenuLoggedIn,);
    };
    if (opts.dev_tools == true) {
        template.push(DevMenu,);
    };
    const newMenu = electron.Menu.buildFromTemplate(template);
    electron.Menu.setApplicationMenu(newMenu);
};

