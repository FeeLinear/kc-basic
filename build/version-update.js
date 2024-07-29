const path = require("path");
const fs = require("fs");

function genVersion(newVersion){
  if(newVersion){
    const fileContent = {
      VERSION: newVersion
    }
    const versionFilePath = path.join(process.cwd(), '/public/version.json');
    fs.writeFileSync(versionFilePath, JSON.stringify(fileContent), { encoding: 'utf-8'});
    console.log('generate version:', newVersion)
  }
  
}

module.exports.genVersion = genVersion;


// genVersion();
