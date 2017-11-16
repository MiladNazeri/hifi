// Run jsdoc conversion
// run jsdox on new files created

const path = require('path');
const fs = require('fs');
const jsPath = path.join(__dirname, 'js', '.');
const { execSync } = require('child_process');

if (fs.existsSync(jsPath)){
  console.log('js path exists');
} else {
  console.log('js path is being created');
  fs.mkdirSync(jsPath);
}

console.log("running Jsdoc");
execSync('jsdoc . -c config_md-mod.json');
console.log("converting to markdown");
execSync(`jsdox ${jsPath} --output jsDocs folder`);
