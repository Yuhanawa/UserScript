const logger = require('./logger.js');
const fs = require('fs');
const path = require('path');
const utils = require('./utils.js');
const uglifyJs = require('uglify-js');
const template = require('art-template');
const { getSrcConfig, getScriptConfig } = require('./config.js')
const { userscript } = require('./userscript.js');


const coreContent = uglifyJs.minify(
    fs.readFileSync(path.join(__dirname, "core.js"), 'utf8')+"\n"+fs.readFileSync(path.join(__dirname, "config_core.js"), 'utf8'), { mangle: false }
).code.replaceAll("function ", "\nfunction ");
const dataMaps = new Map();

let config = getSrcConfig();

let userscripts = new Map();


function build() {
    // fold in src
    fs.readdirSync("src").filter(name => fs.statSync(path.join("src", name)).isDirectory()).forEach(name => {
        // Skips directories starting with '.'
        if (name.startsWith('.')) {
            console.log(`(${new Date().toISOString()}) ${name} ignored`);
            return;
        }
        const { success, outinfo } = buildScript(name);
        // success: true false or undefined
        if (success) {
            logger.success(`${name} build success`);
        } else if (success === false) {
            logger.err(`${name} failed to build`,outinfo)
        }
    });

    Combine();
}

function buildScript(name) {

    let script;
    if (userscripts.has(name)) {
        script = userscripts.get(name);
    } else {
        script = new userscript(name);
        userscripts.set(name, script);
    }

    const { success, outinfo, data } = script.compile();
    if (success) {
        config.combined.forEach(i => {
            if (i.script === undefined) return;
            if (i.script === '*' || i.script.indexOf(name) !== -1) {
                if (!dataMaps.has(i.name))
                    dataMaps.set(i.name, new Map())
                dataMaps.get(i.name).set(name, data)
            }
        })
    }
    return { success, outinfo };
}

function Combine(log = true) {
    config.combined.forEach(i => {
        try {
            const dataMap = dataMaps.get(i.name)
            if (!dataMap) return;

            let rs = template(path.join(__dirname, 'template', 'Combined.art'), {
                DataList: [...dataMap.values()],
                CoreLib: coreContent,
                Header: i.header == undefined || i.header == null || i.header.trim() == ''
                    ? " " : fs.readFileSync(i.header, 'utf-8')
            });

            if (!utils.isValid(i.name)) {
                logger.warn(`${i.name} is not a valid name, please use only English letters, numbers and underscores`);
                i.name = utils.valid(i.name)
            }

            fs.writeFileSync(path.join("out", i.name + ".js"), rs);
            if (log)
                logger.success(`${i.name} combined success`);
        } catch (error) {
            logger.log(`${i.name} failed to combined`);
        }
    })
}


module.exports = {
    build: build,
    buildScript: buildScript,
    outputAll: Combine,
} 
