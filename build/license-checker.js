const fs = require('fs-extra');
var checker = require('license-checker');
const path = require('path');
 
checker.init({
  start: process.cwd(),
  out: '../NOTICE',
  // customPath: './customFormatExample.json',
  relativeLicensePath: true,
  production: true
}, function(err, packages) {
    if (err) {
      console.log(err)
        //Handle error
    } else {
        //The sorted package data
        //as an Object
        const licensePath = path.resolve( __dirname, '../NOTICE')
        //console.log(packages)
        Object.keys(packages).forEach( key => {
          delete packages[key].email;
          delete packages[key].publisher;
          delete packages[key].url;
          let pathIndex = packages[key].path.indexOf("node_modules");
          packages[key].path = packages[key].path.slice(pathIndex);
        })
       fs.writeFileSync(licensePath, JSON.stringify(packages, null, 2), { encoding: "utf8" });
        
    }
});
