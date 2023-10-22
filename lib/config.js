const utils = require('./utils.js')
const path = require('path')

const defaultConfig = {
  minify: true,
  useCoreLib: true,
  keepComments: /^!/,

  beta: false,
  runat: 'document-idle',
  /* 
  TODO: 计划在一个脚本中支持多个runat
  ! 详见以下内容

let runAt = "document-idle"; 

if(runAt === "document-start") {
  // 代码立即执行
  console.log("Running at document-start");
}

if(runAt === "document-body") {
  const checkBody = () => {
    if(document.body) {
      // body存在时运行代码
      console.log("Running at document-body");
      document.removeEventListener("DOMNodeInserted", checkBody); 
    } 
  };
  
  document.addEventListener("DOMContentLoaded", () => {
    if(document.body) {
      checkBody();
    } else {
      document.addEventListener("DOMNodeInserted", checkBody);  
    }
  });
}

if(runAt === "document-end") {
  document.addEventListener("DOMContentLoaded", () => {
    // DOM加载完成后运行代码
    console.log("Running at document-end"); 
  });
}

if(runAt === "document-idle") {
  let idleState = false;
  
  const setIdleState = () => {
    window.requestIdleCallback(() => {
      idleState = true;
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    if(idleState) {
      // 页面空闲后运行代码
      console.log("Running at document-idle");
    } else {
      setIdleState();
      window.addEventListener("idle", () => {
        // 监听空闲状态改变  
        console.log("Running at document-idle");
      });
    }
  });
}
  */

  author: 'Author',
  version: '0.0.0',
  properties: {},

  combined: [
    {
      "name": "all",
      "header": "",
      "script": "*"
    }
  ]
}

function getSrcConfig() {
  return { ...defaultConfig, ...utils.readConfig(path.join("src", 'config.json')) }
}
function getScriptConfig(currentName) {
  return {
    ...defaultConfig,
    ...utils.readConfig(path.join("src", 'config.json')),
    ...utils.readConfig(path.join("src", currentName, 'config.json')),
  }
}

module.exports = {
  defaultConfig, getSrcConfig, getScriptConfig
}