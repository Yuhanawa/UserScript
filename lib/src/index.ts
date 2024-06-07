import console from "node:console";
import script from "./build/script";
import { join as pathJoin } from "node:path";

type GlobalConfigOptions = {
	build: [];
	name: string;
	author: string;
	source: string;
	combined: [
		{
			name: string;
			header: string;
			script: string;
		},
	];
};
function loadGlobalConfig(config: GlobalConfigOptions) {
	console.log(config);

	for (const scriptname of config.build) {
		script.build({
			name: scriptname,
			path: pathJoin(scriptname),
		});
	}
}

type ScriptConfigOptions = {
	name: string;
	author: string;
	source: string;

	version: string;
	header: string;
	settings: [
		{
			displayName: string;
			options: {
				title: string;
				value: string;
				description: string;
				type: string;
				default: string;
			};
		},
	];
};
function loadScript(config: ScriptConfigOptions) {
	console.log(config);
}

export { loadGlobalConfig, loadScript };
