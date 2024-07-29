import hookInstance from "szkingdom.yf.koca-template/lib/logics/hook";
// 需要给kocaHooks注册一些钩子函数
// 使用单点登录
hookInstance.registry("ssoLogin", () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("获取到了token");
      resolve(null);
    }, 2000);
  });
});

