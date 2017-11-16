// Run jsdoc conversion
// run jsdox on new files created

const path = require('path');
const fs = require('fs');
const jsPath = path.join(__dirname, 'js', '.');
const { execFile } = require('child_process');

if (fs.existsSync(jsPath)){
  console.log('js path exists');
} else {
  console.log('js path is being created');
  fs.mkdirSync(jsPath);
}

var filesToRead = fs.readdirSync(jsPath);

console.log("running Jsdoc");
execFile('jsdoc . -c config_md-mod.json', (err, stdout, stderr)=>{
  console.log(stdout);
  filesToRead.forEach(file => {
    execFile(`jsdoc2md ${path.join(jsPath,file)}`, (err, stdout, stderr) => {
      console.log("err", err);
      console.log("stdout:", stdout);
      fs.writeFileSync(`${path.join(jsPath, file + 'md')}`, stdout);
    });
  })
});
