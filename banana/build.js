const sass = require('sass');
const csso = require('csso');
const uglifyJs = require('uglify-js');

const fs = require('fs');
const path = require('path');

const coreContent = uglify(
    fs.readFileSync(path.join(__dirname, "core.js"), 'utf8')
).replaceAll("function ", "\nfunction ");
const codes = new Map();

function build() {
    // 获取src目录路径
    const srcDir = path.join('src');

    // 遍历src目录
    fs.readdirSync(srcDir).forEach(dir => {
        // 拼接每个文件夹的完整路径
        const dirPath = path.join(srcDir, dir);
        _build(dirPath);
    });

    outputAll()
}

function outputAll() {
    let all = coreContent;
    codes.forEach((code, path) => { all += `\n// --~ ${path} ~--\n${code}` })
    fs.writeFileSync(path.join("out", "all.js"), all);
}


function _build(dirPath) {
    // 检查路径是否为文件夹
    if (!fs.statSync(dirPath).isDirectory()) return;

    // 读取文件夹中的header文件
    const headerPath = path.join(dirPath, 'header');
    if (!fs.existsSync(headerPath)) return

    const headerContent = fs.readFileSync(headerPath, 'utf8');

    let contents = new Map();
    fs.readdirSync(dirPath).forEach(js => {
        const jsPath = path.join(dirPath, js);
        if (!jsPath.endsWith(".js") || !fs.statSync(jsPath).isFile()) return

        const content = fs.readFileSync(jsPath, 'utf8');
        contents.set(jsPath, content)
    });


    let code = "\n";

    if (contents.has('main.js')) code += contents.get('main.js');

    code += "\n";

    const featuresName = `features_${path.basename(dirPath)}_${Math.floor(Math.random() * 10000)}`;
    code += uglify(
        ` let ${featuresName} = {${Array.from(contents.keys())
            .filter((key) => getFileName(key) !== 'main')
            .map(key => processingFeatures(contents.get(key), key))
            .join(' ')} \} `)
        .replaceAll("={", "={\n\t")
        .replaceAll("}},", "}},\n\t")
        .replaceAll("};", "\n};");


    code += `\n\n\nrun(${featuresName});\n`;

    if (!fs.existsSync("out")) {
        fs.mkdirSync("out");
    }

    const outpath = path.join("out", path.basename(dirPath) + ".js")

    fs.writeFileSync(outpath, headerContent + coreContent + code);
    codes.set(outpath, code)
}



function processingFeatures(js, selfpath) {
    const key = getFileName(selfpath);

    // 正则表达式匹配$CSS(xxx)
    const regex_CSS = /\$CSS\((.+?)\)/g;
    js = js.replace(regex_CSS, (match, filePath) => {
        const fullPath = path.join(path.dirname(selfpath), filePath)
        const content = fs.readFileSync(fullPath, 'utf8');
        const minified = csso.minify(content).css;
        return `"${minified}"`;
    });

    const regex_SASS = /\$SASS\((.+?)\)/g;
    js = js.replace(regex_SASS, (match, filePath) => {
        fullPath = path.join(path.dirname(selfpath), filePath)
        return `"${csso.minify(sass.compile(fullPath).css).css}"`;
    });

    js = `${key}: \{ name:'${js.replace(',', "',match:").replace(/]\s*,/, "],values:")} \},`
    return js;
}

function uglify(js) {
    const result = uglifyJs.minify(js, {
        mangle: false,
        output: {
            comments: /^!/,  // 保留以!开头的注释
        },
    });

    return result.code;
}

function getFileName(path) {
    return path.match(/[^/\\]+(?=\.\w+)/)[0];
}

module.exports = {
    build: build,
    _build: _build,
    outputAll: outputAll
} 
