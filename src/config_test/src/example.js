name: 本地测试
match: '*'
    ,
{
    已关闭$off: null,
    已开启$on: () => {
        unsafeWindow.useNewConfig = true;
        window.ConfigWeb = false

        unsafeWindow.run = () => {
            // React 
            const reactScript = document.createElement('script');
            reactScript.src = 'https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js';
            unsafeWindow.document.head.appendChild(reactScript);

            const reactDOMScript = document.createElement('script');
            reactDOMScript.src = 'https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.production.min.js';
            unsafeWindow.document.head.appendChild(reactDOMScript);

            // const pre = 'https://cdn.jsdelivr.net/gh/Yuhanawa/UserScript@releases/config-component/dist'
            const pre = '/config-component/dist'
            const indexModuleUrl = pre + "/assets/js/index.js"
            const indexModulePreloadUrl = pre + "/assets/js/index.js"
            const commonModulePreloadUrl = pre + "/assets/js/common.js"
            const vendorModulePreloadUrl = pre + "/assets/js/vendor.js"
            const commonStylesUrl = pre + "/assets/css/common.css"
            const vendorStylesUrl = pre + "/assets/css/vendor.css"
            const indexStylesUrl = pre + "/assets/css/index.css"

            const addscript = (root) => {

                // 应用脚本
                const indexModule = document.createElement('script');
                indexModule.type = 'module';
                indexModule.crossOrigin = true;
                indexModule.src = indexModuleUrl;
                root.appendChild(indexModule);

                const indexModulePreload = document.createElement('script');
                indexModulePreload.type = 'module';
                indexModulePreload.crossOrigin = true;
                indexModulePreload.src = indexModulePreloadUrl;
                root.appendChild(indexModulePreload);

                // 预加载模块
                const commonModulePreload = document.createElement('link');
                commonModulePreload.rel = 'modulepreload';
                commonModulePreload.crossOrigin = true;
                commonModulePreload.href = commonModulePreloadUrl;
                root.appendChild(commonModulePreload);

                const vendorModulePreload = document.createElement('link');
                vendorModulePreload.rel = 'modulepreload';
                vendorModulePreload.crossOrigin = true;
                vendorModulePreload.href = vendorModulePreloadUrl;
                root.appendChild(vendorModulePreload);

                // 样式表
                const commonStyles = document.createElement('link');
                commonStyles.rel = 'stylesheet';
                commonStyles.href = commonStylesUrl;
                root.appendChild(commonStyles);

                const vendorStyles = document.createElement('link');
                vendorStyles.rel = 'stylesheet';
                vendorStyles.href = vendorStylesUrl;
                root.appendChild(vendorStyles);

                const indexStyles = document.createElement('link');
                indexStyles.rel = 'stylesheet';
                indexStyles.href = indexStylesUrl;
                root.appendChild(indexStyles);

                const roote = document.getElementById('config-component-root');
                const configComponent = document.createElement('config-component');
                roote.appendChild(configComponent);
            }


            const shadow = document.createElement('div');
            shadow.id = 'config-component-shadow';
            document.body.appendChild(shadow);
            // shadow.attachShadow({ mode: "open" });

            const root = document.createElement('div');
            root.id = 'config-component-root';
            shadow.appendChild(root);

            reactScript.onload = () => reactDOMScript.onload = () => addscript(unsafeWindow.document.head);
        }
    },
}