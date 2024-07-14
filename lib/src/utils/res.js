const fs = require("fs-extra");
const path = require("node:path");

function get_core_js() {
	return fs.readFileSync(
		path.resolve(__dirname, "..", "..", "res/core.js"),
		"utf8",
	);
}
function get_config_js() {
	return fs.readFileSync(
		path.resolve(__dirname, "..", "..", "res/config.js"),
		"utf8",
	);
}
function get_debug_js() {
	return fs.readFileSync(
		path.resolve(__dirname, "..", "..", "res/debug.js"),
		"utf8",
	);
}

function get_default_gmu_json() {
	return fs.readFileSync(
		path.resolve(__dirname, "..", "..", "res/default.gmu.json"),
		"utf8",
	);
}
function get_default_gmu_dev_json() {
	return fs.readFileSync(
		path.resolve(__dirname, "..", "..", "res/default.gmu.dev.json"),
		"utf8",
	);
}

module.exports = { get_core_js, get_config_js, get_debug_js, get_default_gmu_json, get_default_gmu_dev_json };
