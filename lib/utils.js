const fs = require('fs');

function readConfig(filepath) {
    let config = {};
    try {
        if (fs.existsSync(filepath) && fs.statSync(filepath).isFile())
            config = JSON.parse(fs.readFileSync(filepath, 'utf8'));
    } catch (err) {
        console.error(`(${new Date().toISOString()}) ${filepath} config error, use default config`);
        console.error(err);
    }
    return config;
}

function isValid(str) {
    return (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(str))
}

function valid(str) {
    if (isValid(str)) {
        return str.replace(/[^a-zA-Z0-9_]/g, '').replace(/\s+/g, '_').replace(/^(\d+)/, '_$1');
    }
    return str
}
module.exports = {
    readConfig,isValid,valid

}