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
        return str.replace(/[^a-zA-Z0-9_]/g, '').replaceAll('-', '_').replace(/\s+/g, '_').replace(/^(\d+)/, '_$1');
    }
    return str
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

module.exports = {
    readConfig,
    isValid, valid,
    hashcode


}