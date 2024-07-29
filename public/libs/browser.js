// 要求的最低浏览器版本
const browserList = [
  {
    browser: "IE",
    version: 8,
  },
  {
    browser: "Edge",
    version: 79
  },
  {
    browser: "Firefox",
    version: 78
  },
  {
    browser: "Chrome",
    version: 60
  },
  {
    browser: "Safari",
    version: 12
  }
];

/**
 * 获取浏览器版本
*/
function getBrowserVersion(browserType, UserAgent) {
  let version = "";
  switch (browserType) {
    case "IE":
      version = UserAgent.match(/(msie\s|trident.*rv:)([\w.]+)/)[2];
      break;
    case "Chrome":
      version = UserAgent.match(/chrome\/([\d.]+)/)[1];
      break;
    case "Firefox":
      version = UserAgent.match(/firefox\/([\d.]+)/)[1];
      break;
    case "Safari":
      version = UserAgent.match(/version\/([\d.]+)/)[1];
      break;
    case "Edge":
      version = UserAgent.match(/edge\/([\d.]+)/)[1];
      break;
  }
  return parseInt(version);
}

/**
 * 获取当前浏览器类型
*/
function getBrowser() {
  const UserAgent = navigator.userAgent.toLowerCase();
  const browserInfo = {
    browser: "",
    version: 0
  };
  const browserObj = {
    IE: window.ActiveXObject || "ActiveXObject" in window,
    Chrome: UserAgent.indexOf("chrome") > -1 && UserAgent.indexOf("safari") > -1,
    Firefox: UserAgent.indexOf("firefox") > -1,
    Safari: UserAgent.indexOf("safari") > -1 && UserAgent.indexOf("chrome") == -1,
    Edge: UserAgent.indexOf("edge") > -1,
  };

  for (const key in browserObj) {
    if (browserObj.hasOwnProperty(key) && browserObj[key]) {
      browserInfo.browser = key;
      browserInfo.version = getBrowserVersion(key, UserAgent);
      break;
    }
  }
  console.log("browserInfo", browserInfo);
  return browserInfo;
}

// 是否需要升级浏览器版本
!function isUpgradeBrowser() {
  const { browser, version } = getBrowser();
  for (const objKey of browserList) {
    if (objKey.browser === browser && version < objKey.version) {
      window.location.href = "/update.html";
    }
  }
}()
