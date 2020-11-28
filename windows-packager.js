const electronInstaller = require('electron-winstaller');

const runInstaller = async () => {
    try {
        await electronInstaller.createWindowsInstaller({
                appDirectory: 'builds/windows/iMonke',
                outputDirectory: 'builds/WindowsFull/',
                authors: "Tobi, MakeShiftArtist",
                exe: 'iMonke.exe',
                owners: "Tobi, MakeShiftArtist, Zero",
                description: "imagine if ifunny was good?",
                version: "1.2.8",
                title: "iMonke",
                name: "iMonke",
                setupIcon: "src/monkeshare/dump/imonke-new-leaning-padded-large.ico",
                setupExe: "iMonke.exe",
                setupMsi: "iMonke.msi"
            },
        );
        console.log('It worked!');
    } catch (e) {
        console.log(`No dice: ${e.message}`);
    };
};

runInstaller();