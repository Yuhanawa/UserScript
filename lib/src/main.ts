import console from "node:console";
import script from "./build/script";
import path, { join as pathJoin } from "node:path";
import fs from "fs-extra";
import watcher from "./build/watcher";
import { StartInfo } from "./cli";


type ConfigOptions = {
	name: string;
	author: string;
	source: string;
	root_path: string;

}
type DevConfigOptions = {
	not_build: [string]
}

function main(startInfo: StartInfo) {
	const config_str = fs.readFileSync(pathJoin(__dirname, "gmu.json"), "utf8");
	const config_dev_str = fs.readFileSync(pathJoin(__dirname, "gmu.dev.json"), "utf8");

	const config: ConfigOptions = {
		name: "",
		author: "",
		source: "",

		root_path: "userscripts",
		...JSON.parse(config_str)
	};
	const config_dev: DevConfigOptions = {
		not_build: [],

		...JSON.parse(config_dev_str)
	}

	// 遍历root_path下所有dir,并排除not_build
	const subDirs = fs.readdirSync(config.root_path).filter(file => {
		const filePath = path.join(config.root_path, file);
		return config_dev.not_build.indexOf(file) === -1 && fs.statSync(filePath).isDirectory();
	});

	const subPaths = subDirs.map(sub => `${config.root_path}/${sub}`);

	for (const scriptpath of subPaths) {
		script.build(config, config_dev, scriptpath);
	}
	if (startInfo.watch) {
		watcher.watch(config, config_dev, subPaths);
	}
}


export { ConfigOptions, DevConfigOptions, main };
