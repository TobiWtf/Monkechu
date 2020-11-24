const path = require('path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  electron.app.quit();
}

const electron = require("electron");

state = {};

const CreateWindow = async (path) => {
    if (state.mainWindow == undefined) {
        let window = new electron.BrowserWindow(
            {
                width: 800,
                height: 600,
                webPreferences: {
                    nodeIntegration: true,
                    enableRemoteModule: true,
                },
            },
        );
        menu();
        state.mainWindow = window;
        window.loadFile(path);
        } else {
            state.mainWindow.loadFile(path)
        }
};

electron.app.on(
    "ready",
    async () => {
        CreateWindow("src/monkemain/monkemain.html");
    },
);

electron.app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    electron.app.quit();
  }
});


electron.app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (electron.BrowserWindow.getAllWindows().length === 0) {
    createWindow("src/monkemain/monkemain.html");
  }
});

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
                        CreateWindow("src/monkemain/monkemain.html");
                    }
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
            ]
        },
    ];
    const newMenu = electron.Menu.buildFromTemplate(template);
    electron.Menu.setApplicationMenu(newMenu);
};

