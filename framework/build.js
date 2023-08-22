const fs = require('fs');
const path = require('path');
const compile = require('./compile.js');
const utils = require('./utils.js');
const uglifyJs = require('uglify-js');
const template = require('art-template');
const { getSrcConfig, getScriptConfig } = require('./config.js')


const coreContent = uglifyJs.minify(
    fs.readFileSync(path.join(__dirname, "core.js"), 'utf8'), { mangle: false }
).code.replaceAll("function ", "\nfunction ");
const dataMaps = new Map();

let config = getSrcConfig();

function build() {
    fs.readdirSync("src").forEach(name => {
        // Skips directories starting with '.'
        if (name.startsWith('.')) {
            console.log(`(${new Date().toISOString()}) ${name} ignored`);
            return;
        }
        const { success, outinfo, data } = compile(name);
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
    });

    Combine();
}

function Combine() {
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
                console.warn(`(${new Date().toISOString()}) ⚠️ ${i.name} is not a valid name, please use only English letters, numbers and underscores`);
                i.name = utils.valid(i.name)
            }

            fs.writeFileSync(path.join("out", i.name + ".js"), rs);
            console.log(`(${new Date().toISOString()}) ✅ ${i.name} combined success`);
        } catch (error) {
            console.error(`(${new Date().toISOString()}) ❌ ${i.name} failed to combined`);
            console.error(error);
        }

    })
}


module.exports = {
    build: build,
    outputAll: Combine,
} 
