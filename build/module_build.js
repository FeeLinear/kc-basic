const moduleList = require("../modules.json");

const inquirer = require("inquirer");

const { spawnSync } = require("child_process");

const path = require("path");
const fs = require("fs");

// 第一步：问询用户想要打包的模块
// 第二步：将用户不需要打包的模块移动到临时文件夹
// 第三步：child_process调用打包任务
// 第四步：还原不需要打包的模块
// !!!!!: 第二，三，四步必须同步进行

// views 下文件目录
const viewsDir = path.join(__dirname, "/src/views");
const viewsDir_tmp = path.join(__dirname, "viewstmp");

// external文件目录
const externalFilesDir = path.join(__dirname, "/public/external");
const externalFilesDir_tmp = path.join(__dirname, "externaltmp");

/**
 * 移动文件夹
 * @param {*} fromDir 检查需移动的工作目录
 * @param {*} toDir  暂时保存移动文件的目录
 * @param {*} selected_modules 不需移动的文件目录
 */
function moveModules (fromDir, toDir, selected_modules, move_all = false) {
  const files = fs.readdirSync(fromDir);
  let fileNameToMove = [];
  if (!move_all) {
    files.forEach(fileName => {
      let modules = path.join(fromDir, fileName);
      let stat = fs.lstatSync(modules);
      if (stat.isDirectory() === true) {
        if (selected_modules.every(sm => moduleList[sm].root.lastIndexOf(fileName) === -1)) {
          // 筛选不存在用户选择的模块 的目录
          fileNameToMove.push(fileName);
        }
      }
    });
  } else {
    fileNameToMove = files;
  }

  // 将用户没有选择的模块移动保存
  if (fileNameToMove.length) {
    fileNameToMove.forEach(fileName => {
      let originModules = path.join(fromDir, fileName);
      let newModules = path.join(toDir, fileName);
      fs.renameSync(originModules, newModules, function (err) {
        if (err) {
          console.log(err);
        }
      });
    });
  }
}

async function exec () {
  const prompList = Object.keys(moduleList)
    .filter(key => key.toUpperCase() !== "FRAMEWORK")
    .map(key => ({ name: key.toUpperCase() + ":" + moduleList[key].desc, value: key }));

  const ret = await inquirer.prompt([
    {
      type: "checkbox",
      name: "selected_modules",
      message: "Which modules do you want to build??",
      choices: prompList
    }
  ]);

  try {
    fs.statSync(viewsDir_tmp);
    moveModules(viewsDir, viewsDir_tmp, ret.selected_modules);
  } catch (_err) {
    try {
      fs.mkdirSync(viewsDir_tmp);
      moveModules(viewsDir, viewsDir_tmp, ret.selected_modules);
    } catch (err) {
      console.error(err);
    }
  }

  try {
    fs.statSync(externalFilesDir_tmp);
    moveModules(externalFilesDir, externalFilesDir_tmp, ret.selected_modules);
  } catch (_err) {
    try {
      fs.mkdirSync(externalFilesDir_tmp);
      moveModules(externalFilesDir, externalFilesDir_tmp, ret.selected_modules);
    } catch (err) {
      console.error(err);
    }
  }

  /* console.log("Build modules: " + ret.selected_modules.join(" ")); */

  // 移动文件
  console.log("Build modules……");
  let build = spawnSync(/^win/.test(process.platform) ? "vue-cli-service.cmd" : "vue-cli-service", ["build"]);

  console.log(String(build.stdout));

  /* build.stdout.pipe(process.stdout); */
  moveModules(viewsDir_tmp, viewsDir, [], true);
  moveModules(externalFilesDir_tmp, externalFilesDir, [], true);

  try {
    fs.rmdirSync(viewsDir_tmp);
    fs.rmdirSync(externalFilesDir_tmp);
  } catch (error) {
    console.error(error);
  }
};

exec();
