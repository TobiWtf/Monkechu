const electron = require("electron");

const imonke = require("imonke");

let buildpath = require("path").join;

let toolSet = true;

let path = electron.app.getAppPath();

const storageModule = require(
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
                    devTools: true,
                    nodeIntegration: true,
                    enableRemoteModule: true,
                    nativeWindowOpen: true
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

        //await storage.clear();

        let client = new imonke.Client();

        state.Client = client;

        let createNotLoggedinWindow = async () => {
            menu(
                {
                    needsLogin: true,
                    dev_tools: toolSet,
                },
            );

            CreateWindow(
                "src/monkelogin/monkelogin.html",
            );
        };

        let createLoggedinWindow = async () => {
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

        let isLoggedIn = await storage.IsLoggedIn();
        let loginDetails = await storage.GetLogin();

        if (isLoggedIn == false) {
            createNotLoggedinWindow();
        } else {
            let promisedLogin = await client.login(
                {
                    email: loginDetails.email,
                    secret: loginDetails.secret,
                },
            );

            if (promisedLogin == true) {
                storage.SetLogin(
                    await client._email,
                    await client._secret,
                    await client._token,
                );

                createLoggedinWindow();
            } else {
                createNotLoggedinWindow();
            };
        };
    },
);

electron.app.on(
    'window-all-closed', 
    () => {
        if (process.platform !== 'darwin') {
            electron.app.quit();
        };
    },
);


electron.app.on(
    'activate', 
    () => {
        if (electron.BrowserWindow.getAllWindows().length === 0) {
            CreateWindow(
                "src/monkemain/monkemain.html",
            );
        };
    },
);

electron.ipcMain.on(
    "get-client",
    async (event, opts={}) => {
        event.returnValue = state.Client || null;
    },
);

electron.ipcMain.on(
    "get-client-data",
    async (event, opts={}) => {
        event.returnValue = await state.Client.data;
    },
);

electron.ipcMain.on(
    "login",
    async (event, opts={}) => {
        event.returnValue = await state.Client.login(
            {
                email: opts.email,
                secret: opts.secret || undefined,
                password: opts.password || undefined,
            },
        );
    },
);

electron.ipcMain.on(
    "signup",
    async (event, opts={}) => {

        let nick = opts.nick;
        let email = opts.email;
        let password = opts.password;

        let NickExists = state.Client.nick_exists(nick,);
        let EmailExists = state.Client.email_exists(email,);

        if (await NickExists == true) {
            event.returnValue = {
                error: true,
                reason: `${nick} is taken.`,
            };
            return;
        };

        if (await EmailExists == true) {
            event.returnValue = {
                error: true,
                reason: `${email} is taken`,
            };
            return;
        };

        event.returnValue = {
            login: await state.Client.create(
                {
                    email: email,
                    password: password,
                    nick: nick,
                },
            ),
            error: false,
        };
    },
);


electron.ipcMain.on(
    "create-window", 
    async (event, opts={}) => {
        needsLogin = opts.needsLogin || false;

        menu(
            {
                needsLogin: needsLogin,
                dev_tools: toolSet,
            },
        );

        CreateWindow(
            opts.window,
        );

    },
);

const createSeparators = (listOfLabels) => {

    let separator = {
        type: "separator",
    };

    let finalMenu = [];

    finalMenu.push(
        separator,
    );

    for (let index in listOfLabels) {

        finalMenu.push(
            listOfLabels[index],
        );
        
        finalMenu.push(
            separator,
        );
    };

    finalMenu.push(
        separator,
    );

    return finalMenu
};

const menu = (opts={needsLogin:false, dev_tools:true}) => {

    let MonkeMenuLoggedIn = {
        label: "Monke",
        submenu: createSeparators(
            [
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
                    label: "profile", 
                    click() {
                        CreateWindow("src/monkecount/monkecount.html")
                    },
                },
                {
                    label: "update", 
                    click() {
                        state.mainWindow.loadURL("https://github.com/TobiWtf/Monkechu/releases")
                    },
                },
                {
                    label: "exit", 
                    click() {
                        electron.app.quit();
                    },
                },
            ],
        ),
    };

    let MonkeMenuNotLoggedIn = {
        label: "Monke",
        submenu: createSeparators(
            [
                {
                    label: "login", 
                    click() {
                        CreateWindow("src/monkelogin/monkelogin.html")
                    },
                },
                {
                    label: "signup", 
                    click() {
                        CreateWindow("src/monkesignup/monkesignup.html")
                    },
                },
                {
                    label: "update", 
                    click() {
                        state.mainWindow.loadURL("https://github.com/TobiWtf/Monkechu/releases")
                    },
                },
                {
                    label: "exit", 
                    click() {
                        electron.app.quit();
                    },
                },
            ],
        ),
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

