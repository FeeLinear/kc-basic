/* eslint-disable */
// @ts-check
const path = require("path");
const fs = require("fs");

/**
 * 遍历出 src/projects/${module}/views/**.vue 文件
 * 注意：views页面的路径规则由变化时需要做相应的调整．
 *
 * @param {string} root_dir src/projects
 * @param {string} current_dir 当前目录
 * @param {string} views 页面目录
 * @returns {string[]}
 */
function walk_dir(root_dir, views, current_dir) {
  /** @type {string[]} */
  const results = [];
  const files = fs.readdirSync(path.join(root_dir, current_dir));
  files.forEach((file) => {
    file = current_dir + '/' + file;
    const stat = fs.statSync(path.join(root_dir, file));
    if (stat && stat.isDirectory()) {
      /* Recurse into a subdirectory */
      results.push(...walk_dir(root_dir, views, file));
    } else if (file.includes(views) && file.endsWith(".vue")) {
      /* /${module}/views/**.vue file */
      results.push(file);
    }
  });
  return results;
}

/**
 * 生成projects下模块的路由映射: src/projects/routes.ts
 * @param {string} views 页面目录
 * @param {string[]} excludes 排除模块
 */
function generate_projects_routes(views, excludes = [], excludeAll = false) {
  const projects = path.resolve(process.cwd(), "src/projects");
  const projects_exist = fs.existsSync(projects);
  const files = projects_exist ? walk_dir(projects, views, ".") : [];
  const projects_routes_file = path.resolve(process.cwd(), "src/router/projects.ts");

  // make sure directory exist
  const dir = path.dirname(projects_routes_file);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  const projects_routes = [
    '/* eslint-disable */',
    'export const projects_routes = [',
  ]
  views = views.replace(/\//g, "")

  if(!excludeAll){
    files.forEach(file => {
      // './admin-basic/views/param/Dict.vue' => '/admin-basic/views/param/Dict'
      const route_path = file.slice(1, -4);
      // 按目录打包
      const module_name = file.split("/").slice(1, -1).filter(dir => dir !== views).join("_");
      const componentName = getComponentName(file)
      if (!excludes.some(exclude => file.includes(exclude))) {
        const comment = `/* webpackChunkName: "${module_name}" */`;
        projects_routes.push(
          `  { path: "${route_path}", component: () => import(${comment} "@/projects${file.slice(1)}"), name: "${componentName}" },`,
        );
      }
    });
  }


  projects_routes.push('];');
  projects_routes.push('');
  fs.writeFileSync(projects_routes_file, projects_routes.join("\n"));
}

/**
 * 生成projects/app_name下模块的路由映射: src/router/app_name.ts
 * @param {string} app_name 应用名称
 * @param {string} views 页面目录
 */
function generate_app_routes(app_name, views) {
  // clear projects routes
  const projects_routes = [
    '/* eslint-disable */',
    'export const projects_routes = [',
  ];
  projects_routes.push('];');
  projects_routes.push('');
  const projects_routes_file = path.resolve(process.cwd(), "src/router/projects.ts");
  fs.writeFileSync(projects_routes_file, projects_routes.join("\n"));

  // generate app routes
  const app = path.resolve(process.cwd(), "src/projects", app_name);
  const app_exist = fs.existsSync(app);
  const files = app_exist ? walk_dir(app, views, ".") : [];
  const app_routes_file = path.resolve(process.cwd(), "src/router/" + app_name + ".ts");

  // make sure directory exist
  const dir = path.dirname(app_routes_file);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  const app_routes = [
    '/* eslint-disable */',
    'export const app_routes = [',
  ]

  views = views.replace(/\//g, "")
  files.forEach(file => {
    // './views/param/Dict.vue' => `/${app_name}/views/param/Dict`
    const route_path = "/" + app_name + file.slice(1, -4);
    // 按目录打包
    const module_name = app_name.replace("/", "-") + "_" + file.split("/").slice(1, -1).filter(dir => dir !== views).join("_");
    const comment = `/* webpackChunkName: "${module_name}" */`;
    app_routes.push(
      `  { path: "${route_path}", component: () => import(${comment} "@/projects/${app_name}${file.slice(1)}") },`,
    );
  });

  app_routes.push('];');
  app_routes.push('');
  fs.writeFileSync(app_routes_file, app_routes.join("\n"));
}

function getComponentName(path) {
  const pathList = path.split("/");
  if(pathList[pathList.length -1] === "index.vue") {
    return pathList[pathList.length -2]
  }
  return  pathList[pathList.length -1].slice(0, -4)
}

// test: node build/projects_routes.js
// generate_projects_routes("/views/");

// 生成应用路由:
//    1. node build/projects_routes.js --app admin-basic /views/
// or 2. yarn approutes admin-basic /views/
let app_name = "";
let views = "";
if (process.argv.length >= 4 && process.argv[2] === "--app") {
  if (process.argv.length === 4) {
    app_name = process.argv[3];
  } else if (process.argv.length === 5) {
    app_name = process.argv[3];
    views = process.argv[4];
  }

  if (app_name) {
    generate_app_routes(app_name, views);
  }
} else if (process.argv.length >= 3 && process.argv[2] === "--main") {
  let excludes = [];
  if (process.argv.length === 4) {
    views = process.argv[3];
  } if (process.argv.length === 5) {
    views = process.argv[3];
    excludes = process.argv[4].split(",");
  }
  generate_projects_routes(views, excludes);
}

module.exports.generate_projects_routes = generate_projects_routes;
module.exports.generate_app_routes = generate_app_routes;
