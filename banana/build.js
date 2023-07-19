const sass = require('sass');
const csso = require('csso');
const uglifyJs = require('uglify-js');

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const srcDir = path.join('src');


const coreContent = uglify(
    fs.readFileSync(path.join(__dirname, "core.js"), 'utf8')
).replaceAll("function ", "\nfunction ");
const codes = new Map();

function build() {
    // 遍历src目录
    fs.readdirSync(srcDir).forEach(dir => {
        try {
            if (_build(dir))
                console.log(`(${new Date().toISOString()}) ✅ ${dir} build success`);
        } catch (error) {
            console.error(`(${new Date().toISOString()}) ❌ ${dir} failed to build`);
            console.error(error);
        }

    });

    outputAll()
}

function outputAll() {
    let all = coreContent;
    codes.forEach((code, path) => { all += `\n// --~ ${path} ~--\n try {\n${code}\n} catch (e) {console.error(\`${path}: \${e}\`)}\n` })
    fs.writeFileSync(path.join("out", "all.js"), all);
}


function _build(dir) {
    const dirPath = path.join(srcDir, dir);
    // 检查路径是否为文件夹
    if (!fs.statSync(dirPath).isDirectory()) return;

    // 读取文件夹中的header文件
    const headerPath = path.join(dirPath, 'header');
    if (!fs.existsSync(headerPath)) return;
    const headerContent = fs.readFileSync(headerPath, 'utf8');

    let files = glob.sync(`${dirPath.replace(/\\/g, '/')}/**/*.js`, { ignore: ['**/main.js'], nodir: true });
    let featuresContent = files.map(
        jsfile => processingFeatures(fs.readFileSync(jsfile, 'utf8').trim(), jsfile, dir)
    ).join(' ');

    const featuresName = `features_${path.basename(dirPath)}_${Math.floor(Math.random() * 10000)}`;

    let code = '\n';

    const MainJsPath = path.join(dirPath, 'main.js');
    if (fs.existsSync(MainJsPath)) code += fs.readFileSync(MainJsPath, 'utf8') + '\n';

    code += uglify(` let ${featuresName} = {${featuresContent}} `)
        .replaceAll("={", "={\n\t")
        .replaceAll("}},", "}},\n\t")
        .replaceAll("};", "\n};");
    code += `\n\nrun(${featuresName});\n`;

    if (!fs.existsSync("out")) fs.mkdirSync("out");

    const outpath = path.join("out", path.basename(dirPath) + ".js")

    fs.writeFileSync(outpath, headerContent + coreContent + code);
    codes.set(outpath, code)

    return true;
}



function processingFeatures(js, selfpath, dir) {
    const key = getFileName(selfpath);

    // 正则表达式匹配$CSS(xxx)
    const regex_CSS = /\$CSS\((.+?)\)/g;
    js = js.replace(regex_CSS, (match, fileName) => {
        fileName = fileName.replaceAll(' ', '').replaceAll('"', '').replaceAll("'", '');
        if (!fileName.endsWith('.css')) fileName += '.css';
        const fullPath = path.join(srcDir,dir,'style', fileName);
        const content = fs.readFileSync(fullPath, 'utf8');
        const minified = csso.minify(content).css;
        return `"${minified}"`;
    });

    const regex_SASS = /\$SASS\((.+?)\)/g;
    js = js.replace(regex_SASS, (match, fileName) => {
        fileName = fileName.replaceAll(' ', '').replaceAll('"', '').replaceAll("'", '');
        if (!fileName.endsWith('.sass')) fileName += '.sass';
        fullPath = path.join(srcDir,dir,'style', fileName)
        let replaces = "";
        const result = `'${csso.minify(sass.compile(fullPath).css).css}'`
            .replace(/(\"\s*\$get\([^)\n]+\)\s*\")/gi, (match) => {
                const key = getRandomKey();
                replaces += `.replace('${key}',${match.substring(1, match.length - 1).trim()})`

                return key;
            })
            .replace(/(\$get\([^)\n]+\))/gi, (match) => {
                const key = getRandomKey();
                replaces += `.replace('${key}',${match})`

                return key;
            })

        return result + replaces;
    });

    js = `${dir}_${key}: \{ name:'${js.replace(',', "',match:").replace(/]\s*,/, "],values:")} \},`
        .replaceAll('"⬅️', '').replaceAll('➡️"', '')
    return js;
}

function uglify(js) {
    const result = uglifyJs.minify(js, {
        mangle: false,
        output: {
            comments: /^!/,  // 保留以!开头的注释
        },
    });

    if (result.error) throw new Error(result.error);

    return result.code;
}

function getFileName(path) {
    return path.match(/[^/\\]+(?=\.\w+)/)[0];
}

function getRandomKey() {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const charactersLength = characters.length;
    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return '🔑' + result;
}

module.exports = {
    build: build,
    _build: _build,
    outputAll: outputAll
} 
