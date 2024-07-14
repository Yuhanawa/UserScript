import path from "node:path";
import fs from "fs-extra";
import logger from "../utils/logger";
import res from "../utils/res";
import sass from "sass";
import csso from "csso";
import { ConfigOptions, DevConfigOptions } from "../main";


type BuildInfo = {
	root: string;
	config: ConfigOptions;
	config_dev: DevConfigOptions;

	paths: {
		headerfile: string;
		configfile: string;
		srcdir: string;
		styledir: string;
		htmldir: string;
	};
};
function build(config: ConfigOptions,config_dev:DevConfigOptions, root: string) {
	// const loadInfoFn = import(path.join(opt.path, "index.js"));
	// const info = loadInfoFn.default()

	const srcdir = path.join(root, "src");
	const jsfile = (name: string) => path.join(srcdir, name);
	const styledir = path.join(root, "style");
	const stylefile = (name: string) => path.join(styledir, name);
	const htmldir = path.join(root, "html");
	const htmlfile = (name: string) => path.join(htmldir, name);
	const headerfile = path.join(root, "header");
	const configfile = path.join(root, "config.json");

	const buildInfo: BuildInfo = {
		root,
		config,
		config_dev,

		paths: {
			headerfile,
			configfile,
			srcdir,
			styledir,
			htmldir,
		},
	};

	const jsCodemap = new Map<string, string>();
	for (const file of fs
		.readdirSync(srcdir)
		.filter((file) => file.endsWith(".js"))) {
		const code = processSingleJs(file, jsfile(file), buildInfo);
		jsCodemap.set(file, code);
	}

	const fullCode = getFullCode(jsCodemap, buildInfo);

	writeScrpt(buildInfo, fullCode);
	// debugger;
}

function processSingleJs(
	filename: string,
	filepath: string,
	buildInfo: BuildInfo,
): string {
	let code = fs.readFileSync(filepath, "utf8").trim();
	if (code === "") return "\n";

	const regex_STYLE = /\$STYLE\((.+?)\)/g;
	code = code.replace(regex_STYLE, (_match, sassFileName) => {
		let fixedSassFileName = sassFileName
			.replaceAll(" ", "")
			.replaceAll('"', "")
			.replaceAll("'", "");
		if (!fixedSassFileName.toLowerCase().endsWith(".sass")) fixedSassFileName += ".sass";
		const sassFilePath = path.join(buildInfo.paths.styledir, fixedSassFileName);
		const result = `\`${csso.minify(sass.compile(sassFilePath).css).css}\``;
		return result;
	});

	const key = filename.substring(0, filename.indexOf("."));
	let result = `\n// ${filename}\n`;
	try {
		// biome-ignore lint/security/noGlobalEval: <explanation>
		const evalCode = eval(code);
		if (!evalCode.key) {
			// 在第一个{后添加key:filename.substring(0, filename.firstIndexOf("."))
			code = `${code.substring(0, code.indexOf("{") + 1)}\nkey: "${key}", ${code.substring(code.indexOf("{") + 1)}`;
		}
		// if (evalCode.showInMenu) {
		// 	result += `addOptionOnMenu("${key}")\n`
		// }
		logger.log(`processSingleJs: ${filepath}, evalCode: ${evalCode}`);
	} catch (error) {
		logger.err(`processSingleJs: ${filepath}`, error as Error);
	}

	result += `addModule${code}\n`;

	return result;
}
function getFullCode(
	codemap: Map<string, string>,
	buildInfo: BuildInfo,
) {
	let codes = "";
	for (const [file, code] of codemap) {
		codes += code;
	}

	const code_utils = res.get_core_utils();
	const config_js = res.get_config_js();
	const debug_js = res.get_debug_js();

	const headerStr = `${fs.readFileSync(buildInfo.paths.headerfile, "utf8")}\n`;
	const config = fs.readJsonSync(buildInfo.paths.configfile, "utf8");
	const configVarStr = `var config = ${JSON.stringify(config, null, 4)};\n`;

	const fullCode = `${headerStr}(function() {\n${configVarStr + code_utils + config_js + codes + debug_js}\n})();\n`;
	return fullCode;
}

function writeScrpt(buildInfo: BuildInfo, code: string) {
	fs.ensureFileSync(path.join("dist", `${buildInfo.root}.js`));
	fs.writeFileSync(path.join("dist", `${buildInfo.root}.js`), code);
}

export default {
	build,
};
