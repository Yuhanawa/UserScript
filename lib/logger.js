function log(msg) {
    console.log(`(${new Date().toISOString()}) ${msg}`);
}
function success(msg) {
    console.log(`(${new Date().toISOString()}) ✅ ${msg}`);
}
function warn(msg) {
    console.log(`(${new Date().toISOString()}) ⚠️ ${msg}`);
}
function fail(msg) {
    console.error(`(${new Date().toISOString()}) ❌ ${msg}`);
}

function err(msg, e) {
    console.error(`(${new Date().toISOString()}) ❌ ${msg}`);
    if (e != undefined) {
        console.error(e.message);
        console.error(e);
    }else{
        console.error("unknown error");
    }
}

module.exports = {
    log,
    success,
    warn,
    fail,
    err
}
