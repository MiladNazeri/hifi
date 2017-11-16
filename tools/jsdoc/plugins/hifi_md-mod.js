var pathTool = require('path');

function endsWith(path, exts) {
    var result = false;
    exts.forEach(function(ext) {
        if (path.endsWith(ext)) {
            result = true;
        }
    });
    return result;
}

exports.handlers = {
    beforeParse: function(e) {
        console.log("Scanning hifi source for jsdoc comments...");

        // directories to scan for jsdoc comments
        var dirList = [
            '../../interface/src',
            '../../interface/src/avatar',
            '../../interface/src/scripting',
            '../../interface/src/ui/overlays',
            '../../libraries/animation/src',
            '../../libraries/avatars/src',
            '../../libraries/controllers/src/controllers/',
            '../../libraries/entities/src',
            '../../libraries/networking/src',
            '../../libraries/shared/src',
            '../../libraries/shared/src/shared',
            '../../libraries/script-engine/src',
        ];
        var exts = ['.h', '.cpp'];

        const fs = require('fs');
        dirList.forEach(function (dir) {
            var files = fs.readdirSync(dir)
            files.forEach(function (file) {
                var path = dir + "/" + file;
                if (fs.lstatSync(path).isFile() && endsWith(path, exts)) {
                    var data = fs.readFileSync(path, "utf8");
                    var reg = /(\/\*\*jsdoc(.|[\r\n])*?\*\/)/gm;
                    var matches = data.match(reg);

                    if (matches) {
                        e.source += matches.map(function (s) { return s.replace('/**jsdoc', '/**'); }).join('\n');
                        var fileSource = matches.map(function (s) { return s.replace('/**jsdoc', '/**'); }).join('\n');
                        var fileName = pathTool.join(__dirname,'..','js', file + '.js' );
                        fs.writeFileSync(fileName, fileSource);
                    }
                }
            });
        });
        var globalFile = pathTool.join(__dirname,'..','js', "global" + '.js' );
        fs.writeFileSync(globalFile, e.source);
    }
};
