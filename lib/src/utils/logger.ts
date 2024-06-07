import console from "node:console";

function log(msg: string) {
	console.log(`(${new Date().toISOString()}) ${msg}`);
}
function success(msg: string) {
	console.log(`(${new Date().toISOString()}) ✅ ${msg}`);
}
function warn(msg: string) {
	console.warn(`(${new Date().toISOString()}) ⚠️ ${msg}`);
}
function fail(msg: string) {
	console.error(`(${new Date().toISOString()}) ❌ ${msg}`);
}

function err(msg: string, e: Error) {
	console.error(`(${new Date().toISOString()}) ❗ ${msg}`);
}

export default { log, success, warn, fail, err };
