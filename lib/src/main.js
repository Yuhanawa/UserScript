const console = require("node:console");
const path = require("node:path");
const http = require("node:http");
const fs = require("fs-extra");

const watcher = require("./build/watcher");
const script = require("./build/script");
const res = require("./utils/res");
const logger = require("./utils/logger");
const server = require("./server");

function main(startInfo) {
	if (!fs.existsSync("gmu.json")) {
		console.error("gmu.json not found");
		fs.writeFileSync(res.get_default_gmu_json(), "gmu.json");
		console.log(
			"Now, gmu.json was created in the root folder of your project.",
		);
		console.log("Please edit it and restart the script.");
		return;
	}
	if (!fs.existsSync("gmu.dev.json")) {
		fs.writeFileSync(res.get_default_gmu_dev_json(), "gmu.dev.json");
	}

	const config = {
		name: "",
		author: "",
		source: "",
		root_path: "userscripts",
		...JSON.parse(fs.readFileSync("gmu.json", "utf8")),
	};

	const config_dev = {
		not_build: [],
		...JSON.parse(fs.readFileSync("gmu.dev.json", "utf8")),
	};

	const subDirs = fs.readdirSync(config.root_path).filter((file) => {
		const filePath = path.join(config.root_path, file);
		return (
			!config_dev.not_build.includes(file) &&
			fs.statSync(filePath).isDirectory()
		);
	});

	const subPaths = subDirs.map((sub) => `${config.root_path}/${sub}`);

	// biome-ignore lint/complexity/noForEach: <explanation>
	subPaths.forEach((scriptpath) =>
		script.tryBuild(config, config_dev, startInfo, scriptpath),
	);

	if (startInfo.watch) {
		watcher.watch(config, config_dev, startInfo, subPaths);
	}

	if (startInfo.server) {
		server.startServer(subPaths);
	}
}

module.exports = { main };
