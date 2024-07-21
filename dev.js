// ==UserScript==
// @name         User Script 开发使用
// @description  热更新
// @namespace    http://github.com/yuhanawa/
// @version      dev
// @author       Yuhanawa
// @match        *://*/*
// @require      file:///{PATH}
// !例如@require  file:///E://UserScript/example.js
// @run-at       document-start
// @connect      *
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_getTab
// @grant        GM_saveTab
// @grant        GM_getTabs
// @grant        GM_notification
// @grant        GM_setClipboard
// @grant        GM_info
// ==/UserScript==

(function() {
    // !!! 实现热更新的两种方法
    // !1.(推荐)
    // 通过修改@require中 {PATH} 为脚本文件的绝对路径, 将此脚本添加到脚本管理器(如:Tampermonkey)中
    // 访问`chrome://extensions/`找到你的脚本管理器插件(Tampermonkey),点击`详情`, 打开`允许访问文件网址`选项  !!!
    // firefox 无法使用此方法
    // !2.
    // 删除此文件中的@require, 取消下面代码注释, 修改YOUR_SCRIPT_URL, 将此脚本添加到脚本管理器(如:Tampermonkey)中
    /*
    const YOUR_SCRIPT_URL = 'https://127.0.0.1:8080/script.js';

    function loadAndExecuteScript(url) {
        return new Promise((resolve, reject) => {
          GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function(response) {
              eval(response.responseText);
              resolve();
            },
            onerror: function(error) {
              reject(error);
            },
          });
        });
      }

      loadAndExecuteScript(YOUR_SCRIPT_URL)
        .then(() => {
          console.log('Script executed successfully');
        })
        .catch((error) => {
          console.error('Failed to load or execute script:', error);
        });
        */
})();