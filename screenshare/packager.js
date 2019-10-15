var packager = require('electron-packager');
var options = {
    dir: __dirname,
    name: "screenshare",
    version: "0.1.0",
    overwrite: true,
    prune: true,
    arch: "x64",
    platform: "win32",
    CompanyName: "High Fidelity, Inc.",
    FileDescription: "High Fidelity Screenshare",
    OriginalFilename: "screenshare.exe"
};


// call the packager to produce the executable
packager(options, function(error, appPath) {
    if (error) {
        console.error("There was an error writing the packaged console: " + error.message);
        process.exit(1);
    } else {
        console.log("Wrote new app to " + appPath);
    }
});
