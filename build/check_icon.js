const path = require("path");
const fs = require("fs");

function recursiveReadFile(fileName, arr) {
  // 去除node_modules文件夹
  if (!fs.existsSync(fileName) || fileName.match(/node_modules/)) return;
  if (isFile(fileName)) {
    check(fileName, arr);
  }
  if (isDirectory(fileName)) {
    const files = fs.readdirSync(fileName);
    files.forEach((val) => {
      const temp = path.join(fileName, val);
      if (isDirectory(temp)) recursiveReadFile(temp, arr);
      if (isFile(temp)) check(temp, arr);
    });
  }
}

function check_libicon(fileName, arr) {
  const data = readFile(fileName);
  const res = data.match(/kui-icon-\S*(:)/g);
  if (res && res.length) {
    res.forEach((item) => {
      arr.push(item.replace(/:/, ""));
    });
  }
}

function check(fileName, arr) {
  // 只检查.vue文件
  if(!fileName.match(/\.vue$/gi)) return;
  const data = readFile(fileName);
  const res = data.match(/kui-icon-(\w|-)*("|')/g);
  if (res && res.length) {
    const iconlist = [];
    res.forEach((item) => {
      iconlist.push(item.replace(/["|']/g, ""));
    });
    arr.push({"path":fileName,"icon_name": new Set(iconlist)});
  }
}

function isDirectory(fileName) {
  if (fs.existsSync(fileName)) return fs.statSync(fileName).isDirectory();
}

function isFile(fileName) {
  if (fs.existsSync(fileName)) return fs.statSync(fileName).isFile();
}

function readFile(fileName) {
  if (fs.existsSync(fileName)) return fs.readFileSync(fileName, "utf-8");
}

/**
 * 获取图库的icon集合
 */
function getLibIcons() {
  const arr = [];
  const libPath = path.join(process.cwd(), "node_modules/szkingdom.yf.koca-ui/packages/theme-chalk/src/fonts/iconfont.scss");
  check_libicon(libPath, arr);
  return new Set(arr);
}

/**
 * 获取安装的组件库的版本
 * @returns 
 */
function getKuiVersion(){
  const libPath = path.join(process.cwd(), "node_modules/szkingdom.yf.koca-ui/package.json");
  return require(libPath).version;
}
/**
 * 获取项目使用的icon集合
 */
function getProjectIcons() {
  const arr = [];
  const proPath = path.join(process.cwd());
  recursiveReadFile(proPath, arr);
  return arr;
}
/**
 *  获取项目使用icon集合和图库icon集合的差集
 */
function getNoSearchInLibIcons(libIconsSet, projectIconsSet) {
  const result = [];
  projectIconsSet.forEach((icon) => {
    const icons = [];
    icon.icon_name.forEach((per_icon)=>{
      if (!libIconsSet.has(per_icon)) {
        icons.push(per_icon);
      }
    });
    if(icons.length !== 0){
      result.push({"path":icon.path,"icon_name":icons});
    }
  });
  return result;
}
function main() {
  console.log("检索中...");
  const libIconsSet = getLibIcons();
  const projectIconsSet = getProjectIcons();
  const result = getNoSearchInLibIcons(libIconsSet, projectIconsSet);
  const uiVersion = getKuiVersion();
  console.log("当前安装的KOCA-UI版本为：", uiVersion);
  if(result.length > 0){
    console.warn('项目中有以下图标未在'+ uiVersion +'组件库版本里面检查到, 请参考指导文档进行修正')
    console.log(result);
  }else{
    console.log("项目中所引用的图标均在图标库中匹配到，图标可正常显示")
  }
}
main();
