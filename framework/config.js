const utils = require('./utils.js')
const path = require('path')

const defaultConfig = {
    minify: true,
    useCoreLib: true,
    keepComments: /^!/,

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
    defaultConfig,getSrcConfig,getScriptConfig
}