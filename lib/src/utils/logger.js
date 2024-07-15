const console = require("node:console");

function log(msg) {
	console.log(`(${new Date().toISOString()}) ${msg}`);
}
function success(msg) {
	console.log(`(${new Date().toISOString()}) ✅ ${msg}`);
}
function warn(msg) {
	console.warn(`(${new Date().toISOString()}) ⚠️ ${msg}`);
}
function fail(msg) {
	console.error(`(${new Date().toISOString()}) ❌ ${msg}`);
}

function err(msg, e) {
	console.error(`(${new Date().toISOString()}) ❗ ${msg}`);
}

module.exports = { log, success, warn, fail, err };
