const console = require("node:console");
const path = require("node:path");
const fs = require("fs-extra");

const watcher = require("./build/watcher");
const script = require("./build/script");
const res = require("./utils/res");
const server = require("./server");

function main(startInfo) {
	if (!fs.existsSync("gmu.json")) {
		console.error("gmu.json not found");
		fs.writeFileSync("gmu.json", res.get_default_gmu_json());
		console.log(
			"Now, gmu.json was created in the root folder of your project.",
		);
		console.log("Please edit it and restart the script.");
		return;
	}
	if (!fs.existsSync("gmu.dev.json")) {
		fs.writeFileSync("gmu.dev.json", res.get_default_gmu_dev_json());
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
		server: {
			alwaysStartOnDev: false,
			port: 8080,
		},
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

	subPaths.forEach((scriptpath) =>
		script.tryBuild(config, config_dev, startInfo, scriptpath),
	);

	if (startInfo.watch) {
		watcher.watch(config, config_dev, startInfo, subPaths);
	}

	if (
		startInfo.server ||
		(startInfo.command === "dev" && config_dev.server.alwaysStartOnDev)
	) {
		server.tryStartServer(subPaths, config_dev.server.port);
	}
}

module.exports = { main };
