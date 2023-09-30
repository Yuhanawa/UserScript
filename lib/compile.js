const sass = require('sass');
const csso = require('csso');
const uglifyJs = require('uglify-js');

const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');
const glob = require('glob');
const template = require('art-template');
const utils = require('./utils.js');
const { getSrcConfig, getScriptConfig } = require('./config.js')


const coreContent = uglifyJs.minify(
    fs.readFileSync(path.join(__dirname, "core.js"), 'utf8'), { mangle: false }
).code.replaceAll("function ", "\nfunction ");

let currentName;
let dirPath;


let config = {}

/**
 * Compiles the code for a given name.
 * 
 * @param {string} name - The name of the directory to compile.
 * @returns {Object} - An object with the success status, output information, and data.
 */
function compile(name) {
    dirPath = path.join("src", name);

    // Check if the directory exists
    if (!fs.statSync(dirPath).isDirectory()) return { success: undefined };

    if (!utils.isValid(name)) {
        console.warn(`(${new Date().toISOString()}) ⚠️ ${name} is not a valid name, please use only English letters, numbers and underscores`);
        name = utils.valid(name)
    }

    currentName = name;

    try {
        config = getScriptConfig(currentName)

        const data = getData(currentName);
        const outinfo = output2file(getContent(data));

        return { success: true, outinfo, data }
    } catch (error) {
        return { success: false, outinfo: error }
    }
}


/**
 * Retrieves data by finding all JavaScript files in a given directory and its subdirectories, excluding 'main.js'. 
 * It processes the features in each file and concatenates the results. A unique name for the features object is generated.
 * The path to the 'main.js' file is constructed. The features content is formatted and code minification is applied.
 * The contents of the 'main.js' file, if it exists, are read. Finally, an object containing various data is returned.
 *
 * @return {Object} data - An object containing the following properties:
 *   - name: The current name.
 *   - FeaturesName: A unique name for the features object.
 *   - CoreLib: The core content.
 *   - MainJs: The contents of the 'main.js' file, if it exists.
 *   - FeaturesContent: The formatted and minified features content.
 */
function getData() {

    // 读取文件夹中的header文件
    const headerPath = path.join(dirPath, 'header');
    if (!fs.existsSync(headerPath)) return;
    let headerContent = fs.readFileSync(headerPath, 'utf8')
        .replace(/\/\/\s*==\/UserScript==/g, '// @match\t*://yuhan-script-config.netlify.app/*\n// @match\t*://user-script-config-form.vercel.app/*\n// @grant\tunsafeWindow\n// ==/UserScript==')

    // 处理 config and header
    if (config.version != undefined) {
        headerContent = headerContent.replace(/\/\/\s*@version\s*(.*)/gi, (match, version) => {
            return match.replace(version, config.version);
        });
    }

    // TODO 重构 全新的 config properties
    // load config
    const properties = config.properties ? `loadConfig('${currentName}', ${JSON.stringify(config.properties)})\n` : '';


    // Find all JavaScript files in the directory and its subdirectories, excluding 'main.js'
    const files = glob.sync(`${dirPath.replace(/\\/g, '/')}/**/*.js`, { ignore: ['**/main.js'], nodir: true });

    // Process the features in each file and concatenate the results
    let featuresContent = ''
    if (config.beta) {
        featuresContent = files
            .map(jsfile => beta_processingFeatures(fs.readFileSync(jsfile, 'utf8').trim(), jsfile))
            .join(' ');
    } else {
        featuresContent = files
            .map(jsfile => processingFeatures(fs.readFileSync(jsfile, 'utf8').trim(), jsfile))
            .join(' ');
    }

    // Generate a unique name for the features object
    const featuresName = `features_${currentName}_${Math.abs(hashcode(featuresContent))}`;

    // Construct the path to the 'main.js' file
    const MainJsPath = path.join(dirPath, 'main.js');

    // Format the features content and apply code minification
    const featuresContentFormatted = uglify(` let ${featuresName} = {${featuresContent}} `)
        .replace("{", "{\n\t")
        .replaceAll("}},", "}},\n\t")
        .replaceAll("};", "\n};");

    // Read the contents of the 'main.js' file, if it exists
    const MainJs = (fs.existsSync(MainJsPath)) ? fs.readFileSync(MainJsPath, 'utf8') + '\n' : '';

    const data = {
        Name: currentName,
        Config: config,
        FeaturesName: featuresName,
        Header: headerContent,
        CoreLib: coreContent,
        Body: {
            FeaturesName: featuresName,
            MainJs: MainJs,
            FeaturesContent: featuresContentFormatted,
            LoadProperties: properties
        },
    }

    return data;
}
/**
 * Returns the content generated by applying the data to the userScript.art template.
 *
 * @param data - The data to apply to the template.
 * @return {string} The generated content.
 */
function getContent(data) {
    return template(path.join(__dirname, 'template', 'Main.art'), data);
}
/**
 * Writes the output to a file and returns the file path and output.
 *
 * @param {string} output - The output to be written to the file.
 * @return {{outpath,output}} An object containing the file path and output.
 */
function output2file(output) {
    if (!fs.existsSync("out")) fs.mkdirSync("out");

    const outpath = path.join("out", currentName + ".js");

    fs.writeFileSync(outpath, output);
    return { outpath, output }
}

/**
 * Process the features in the given JavaScript code.
 *
 * @param {string} js - The JavaScript code to process.
 * @param {string} selfpath - The path to the current file.
 */
function processingFeatures(js, selfpath) {
    if (js === "") return "";

    const key = path.basename(selfpath, '.js');

    // Replace all occurrences of $CSS(...) with the minified CSS content
    const regex_CSS = /\$CSS\((.+?)\)/g;
    js = js.replace(regex_CSS, (_match, fileName) => {
        // Remove any spaces, double quotes, and single quotes from the file name
        fileName = fileName.replaceAll(' ', '').replaceAll('"', '').replaceAll("'", '');
        // If the file name does not end with .css, add the extension
        if (!fileName.endsWith('.css')) fileName += '.css';
        // Get the full path to the CSS file
        const fullPath = path.join("src", currentName, 'style', fileName);
        // Read the content of the file
        const content = fs.readFileSync(fullPath, 'utf8');
        // Minify the CSS content using csso
        const minified = csso.minify(content).css;

        return `"${minified}"`;
    });

    // Replace all occurrences of $SASS(...) with the minified SASS content
    const regex_SASS = /\$SASS\((.+?)\)/g;
    js = js.replace(regex_SASS, (_match, fileName) => {
        // Remove any spaces, double quotes, and single quotes from the file name
        fileName = fileName.replaceAll(' ', '').replaceAll('"', '').replaceAll("'", '');
        // If the file name does not end with .sass, add the extension
        if (!fileName.endsWith('.sass')) fileName += '.sass';
        // Get the full path to the SASS file
        fullPath = path.join("src", currentName, 'style', fileName);
        let replaces = "";
        // Minify the SASS content and replace $get(...) functions
        const result = `'${csso.minify(sass.compile(fullPath).css).css}'`
            .replace(/(\"\s*\$get\([^)\n]+\)\s*\")/gi, (match) => {
                const key = getRandomKey();
                replaces += `.replace('${key}',${match.substring(1, match.length - 1).trim()})`;
                return key;
            })
            .replace(/(\$get\([^)\n]+\))/gi, (match) => {
                const key = getRandomKey();
                replaces += `.replace('${key}',${match})`;
                return key;
            });

        return result + replaces;
    });

    // Return the processed JavaScript code
    return `${currentName}_${key}: { name:'${js.replace(',', "',match:").replace(/]\s*,/, "],values:")} },`;
}
function beta_processingFeatures(fileContent, selfpath) {
    if (fileContent === "") return "";

    const key = path.basename(selfpath, '.js');

    const splits = fileContent.split('\n,')
    const info = yaml.load(splits[0])
    let js = splits.slice(1).join('\n,')


    // Replace all occurrences of $CSS(...) with the minified CSS content
    const regex_CSS = /\$CSS\((.+?)\)/g;
    js = js.replace(regex_CSS, (_match, fileName) => {
        // Remove any spaces, double quotes, and single quotes from the file name
        fileName = fileName.replaceAll(' ', '').replaceAll('"', '').replaceAll("'", '');
        // If the file name does not end with .css, add the extension
        if (!fileName.endsWith('.css')) fileName += '.css';
        // Get the full path to the CSS file
        const fullPath = path.join("src", currentName, 'style', fileName);
        // Read the content of the file
        const content = fs.readFileSync(fullPath, 'utf8');
        // Minify the CSS content using csso
        const minified = csso.minify(content).css;

        return `"${minified}"`;
    });

    // Replace all occurrences of $SASS(...) with the minified SASS content
    const regex_SASS = /\$SASS\((.+?)\)/g;
    js = js.replace(regex_SASS, (_match, fileName) => {
        // Remove any spaces, double quotes, and single quotes from the file name
        fileName = fileName.replaceAll(' ', '').replaceAll('"', '').replaceAll("'", '');
        // If the file name does not end with .sass, add the extension
        if (!fileName.endsWith('.sass')) fileName += '.sass';
        // Get the full path to the SASS file
        fullPath = path.join("src", currentName, 'style', fileName);
        let replaces = "";
        // Minify the SASS content and replace $get(...) functions
        const result = `'${csso.minify(sass.compile(fullPath).css).css}'`
            .replace(/(\"\s*\$get\([^)\n]+\)\s*\")/gi, (match) => {
                const key = getRandomKey();
                replaces += `.replace('${key}',${match.substring(1, match.length - 1).trim()})`;
                return key;
            })
            .replace(/(\$get\([^)\n]+\))/gi, (match) => {
                const key = getRandomKey();
                replaces += `.replace('${key}',${match})`;
                return key;
            });

        return result + replaces;
    });

    // Return the processed JavaScript code
    return `${currentName}_${key}: ${JSON.stringify({
        name: info.name,
        match: info.match,
        values: "{{values}}"
    }).replace('"{{values}}"',js)}`;
}
/**
 * Minify the code using uglifyJs library with specified options.
 *
 * @param {string} js - The JavaScript code to be minified.
 * @returns {string} The minified JavaScript code.
 */
function uglify(js) {
    // Minify the code using uglifyJs library with specified options
    const result = uglifyJs.minify(js, {
        mangle: false, // Do not mangle variable and function names
        output: {
            comments: config.keepComments, // Keep comments that start with '!'
        },
    });

    if (result.error) {
        // 获取错误行前 2 行到后 3 行的代码
        const startLine = Math.max(result.error.line - 2, 0);
        const endLine = result.error.line + 3;
        const errorLines = js.split('\n').slice(startLine, endLine);

        console.error(`--- a error occurred ---`);
        console.error(errorLines.join('\n'));
        console.error(result.error.message);

        throw result.error;
    }

    return result.code;
}

// 现在只有上帝知道他是干啥的了
// now we only have God knows what he is doing
function getRandomKey() {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const charactersLength = characters.length;
    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return '🔑' + result;
}
function hashcode(str) {
    var hash = 0, i, chr, len;
    if (str.length === 0) return hash;
    for (i = 0, len = str.length; i < len; i++) {
        chr = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}


module.exports = compile;