const sass = require('sass');
const csso = require('csso');
const uglifyJs = require('uglify-js');

const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');
const glob = require('glob');
const template = require('art-template');
const utils = require('./utils.js');
const { headerParse, header2str } = require('./header.js');
const { getSrcConfig, getScriptConfig } = require('./config.js')
const { transfer, getContent, output2file, processingFeatures, beta_processingFeatures,uglify } = require('./compile.js')
const coreContent = uglifyJs.minify(
    fs.readFileSync(path.join(__dirname, "core.js"), 'utf8'), { mangle: false }
).code.replaceAll("function ", "\nfunction ");


class userscript {
    path
    name
    modules = []

    config
    config_file_path
    config_timestamp

    header
    header_file_path
    header_timestamp

    constructor(name) {
        this.path = path.join("src", name);

        this.name = name
        if (!utils.isValid(name)) {
            this.name = utils.valid(name)
            warn(`${name} is not a valid name, please use only English letters, numbers and underscores, now it is ${this.name}`);
        }

        this.config_file_path = path.join("src", this.name, "config.json")
        this.config_timestamp = fs.statSync(this.config_file_path).mtime
        this.config = getScriptConfig(this.name)

        this.header_file_path = path.join("src", this.name, "header")
        this.header_timestamp = fs.statSync(this.header_file_path).mtime
        this.header = headerParse(fs.readFileSync(this.header_file_path, 'utf-8'))

        this.header_file_path = path.join("src", this.name, "header")

    }

    compile() {
        // Check if the directory exists
        if (!fs.statSync(this.path).isDirectory()) return { success: undefined };

        try {
            const config_timestamp = fs.statSync(this.config_file_path).mtime
            if (config_timestamp != this.config_timestamp) {
                this.config = getScriptConfig(this.name)
                this.config_timestamp = config_timestamp
            }

            const header_timestamp = fs.statSync(this.header_file_path).mtime
            if (header_timestamp != this.header_timestamp) {
                this.updateHeader()
            }

            // console.log(this);

            transfer(this)


            // load config
            const properties = this.config.properties ? `loadConfig('${this.name}', ${JSON.stringify(this.config.properties)})\n` : '';

            // Find all JavaScript files in the directory and its subdirectories, excluding 'main.js'
            const files = glob.sync(`${this.path.replace(/\\/g, '/')}/**/*.js`, { ignore: ['**/main.js'], nodir: true });

            // Process the features in each file and concatenate the results
            let featuresContent = ''
            if (this.config.beta) {
                featuresContent = files
                    .map(jsfile => beta_processingFeatures(fs.readFileSync(jsfile, 'utf8').trim(), jsfile))
                    .join(' ');
            } else {
                featuresContent = files
                    .map(jsfile => processingFeatures(fs.readFileSync(jsfile, 'utf8').trim(), jsfile))
                    .join(' ');
            }

            // Generate a unique name for the features object
            const featuresName = `features_${this.name}_${Math.abs(utils.hashcode(featuresContent))}`;

            // Construct the path to the 'main.js' file
            const MainJsPath = path.join(this.path, 'main.js');

            // Format the features content and apply code minification
            const featuresContentFormatted = uglify(` let ${featuresName} = {${featuresContent}} `)
                .replace("{", "{\n\t")
                .replaceAll("}},", "}},\n\t")
                .replaceAll("};", "\n};");

            // Read the contents of the 'main.js' file, if it exists
            const MainJs = (fs.existsSync(MainJsPath)) ? fs.readFileSync(MainJsPath, 'utf8') + '\n' : '';

            const data = {
                Name: this.name,
                Config: this.config,
                FeaturesName: featuresName,
                Header: this.getHeaderContent(),
                CoreLib: coreContent,
                Body: {
                    FeaturesName: featuresName,
                    MainJs: MainJs,
                    FeaturesContent: featuresContentFormatted,
                    LoadProperties: properties
                },
            }

            const outinfo = output2file(getContent(data));

            return { success: true, outinfo, data }
        } catch (error) {
            return { success: false, outinfo: error }
        }

    }
    updateHeader() {
        this.header_timestamp = fs.statSync(this.header_file_path).mtime
        const header_grant = ['GM_setValue', 'GM_getValue', 'GM_addStyle', 'GM_registerMenuCommand', 'GM_openInTab', 'unsafeWindow']
        const header_match = ['*://yuhan-script-config.netlify.app/*', '*://user-script-config-form.vercel.app/*','*://yuhanawa.github.io/tools/userscriptconfig/*']
        this.header = {
            grant: header_grant,
            match: header_match,
            ...headerParse(fs.readFileSync(this.header_file_path, 'utf-8'))
        }

        // 如果 this.header.grant 缺失上面列表中的其中一个值则添加
        if (this.header.grant.some(i => !header_grant.includes(i))) {
            this.header.grant.push(...header_grant.filter(i => !this.header.grant.includes(i)))
        }

        // 如果 this.header.match 缺失上面列表中的其中一个值则添加
        if (this.header.match.some(i => !header_match.includes(i))) {
            this.header.match.push(...header_match.filter(i => !this.header.match.includes(i)))
        }

        if (this.config.version != undefined) {
            this.header.version = this.config.version;
        }


    }

    getHeaderContent() {
        return header2str(this.header)
    }

}

class scriptmodule {
    metadata
    constructor(metadata) {
        this.metadata = metadata
    }
}


module.exports = {
    userscript,
    scriptmodule
}