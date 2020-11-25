const path = require('path');

if (require('electron-squirrel-startup')) {
    electron.app.quit();
};

const electron = require("electron");

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
                webPreferences: {
                    //devTools: true,
                    nodeIntegration: true,
                    enableRemoteModule: true,
                },
            },
        );

        state.mainWindow = window;

        //window.webContents.openDevTools();

        window.loadFile(path);

        menu();

        call();

        } else {
            state.mainWindow.loadFile(path);
            call();
        };
};

electron.app.on(
    "ready",
    async () => {
        CreateWindow(
            "./monkemain/monkemain.html",
        );
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
            createWindow(
                "/monkemain/monkemain.html",
            );
        };
    },
);

const menu = () => {
    let template = [
        {
            label: "Monke",
            submenu: [
                {
                    type: "separator",
                },
                {
                    label: "home",
                    click(){
                        CreateWindow("monkemain/monkemain.html");
                    }
                },
                {
                    type: "separator",
                },
                {
                    label: "feed", 
                    click() {
                        CreateWindow("monkefeed/monkefeed.html");
                    },
                },
                {
                    type: "separator",
                },
                {
                    label: "profile (Not working)", 
                    click() {
                        CreateWindow("monkecount/monkecount.html")
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
        },
    ];
    const newMenu = electron.Menu.buildFromTemplate(template);
    electron.Menu.setApplicationMenu(newMenu);
};

