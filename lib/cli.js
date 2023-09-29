#!/usr/bin/env node

const program = require('commander');
const fs = require('fs');
const path = require('path');
const template = require('art-template');


program
    .version('0.1.0')
    .description('description')

program.command('build').action(() => {
    require("./build").build()
})
program.command('dev').action(() => {
    require('./dev.js')();
})
program.command('new')
    .argument('<name>', 'name')
    .argument('[sub]', 'name')
    .action((name, sub, options) => {
        console.log(name, sub, options);
        if (fs.existsSync(`src/${name}`)) {
            if (sub) {
                fs.copyFileSync(path.join(__dirname, 'example', 'example.js'), `src/${name}/src/${sub}.js`);
                console.log(`(${new Date().toISOString()}) ${name}/${sub} created success`);
            } else {
                console.error(`(${new Date().toISOString()}) ${name} already exists`);
            }
        } else {
            fs.mkdirSync(`src/${name}`);
            fs.mkdirSync(`src/${name}/src`);
            fs.mkdirSync(`src/${name}/style`);

            const data = {
                name: name,
                sub: sub
            }

            fs.writeFileSync(`src/${name}/header`, template(path.join(__dirname, 'template', 'example', 'header.art'), data));
            fs.writeFileSync(`src/${name}/config.json`, template(path.join(__dirname, 'template', 'example', 'config.json.art'), data));
            fs.writeFileSync(`src/${name}/src/example.js`, template(path.join(__dirname, 'template', 'example', 'example.js.art'), data));
            fs.writeFileSync(`src/${name}/style/example.sass`, template(path.join(__dirname, 'template', 'example', 'example.sass.art'), data));

            if (sub) {
                fs.writeFileSync(`src/${name}/src/${sub}.js`, template(path.join(__dirname, 'template', 'example', 'example.js.art'), data));
            }

            console.log(`(${new Date().toISOString()}) ${name} created success`);
        }
    });

program.parse(process.argv);
