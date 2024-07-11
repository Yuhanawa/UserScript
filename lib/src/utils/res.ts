import fs from "fs-extra";
import path from "node:path";

function get_core_utils(): string {
	return fs.readFileSync(
		path.resolve(__dirname, "..", "..", "..", "res/core_utils.js"),
		"utf8",
	);
}
function get_config_js(): string {
	return fs.readFileSync(
		path.resolve(__dirname, "..", "..", "..", "res/config.js"),
		"utf8",
	);
}
function get_debug_js(): string {
	return fs.readFileSync(
		path.resolve(__dirname, "..", "..", "..", "res/debug.js"),
		"utf8",
	);
}

export default { get_core_utils, get_config_js, get_debug_js };
