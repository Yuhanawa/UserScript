import { join as pathJoin } from "node:path";
import fs from "fs-extra";
import logger from "../utils/logger";
import res from "../utils/res";
import sass from "sass";
import csso from "csso";

type BuildOptions = {
	name: string;
	path: string;
};

type BuildInfo = {
	buildOptions: BuildOptions;

	paths: {
		headerfile: string;
		configfile: string;
		srcdir: string;
		styledir: string;
		htmldir: string;
	}
}
function build(opt: BuildOptions) {
	// const loadInfoFn = import(pathJoin(opt.path, "index.js"));
	// const info = loadInfoFn.default()

	const srcdir = pathJoin(opt.path, "src");
	const jsfile = (name: string) => pathJoin(srcdir, name);
	const styledir = pathJoin(opt.path, "style");
	const stylefile = (name: string) => pathJoin(styledir, name);
	const htmldir = pathJoin(opt.path, "html");
	const htmlfile = (name: string) => pathJoin(htmldir, name);
	const headerfile = pathJoin(opt.path, "header");
	const configfile = pathJoin(opt.path, "config.json");


	const buildInfo: BuildInfo = {
		buildOptions: opt,

		paths: {
			headerfile,
			configfile,
			srcdir,
			styledir,
			htmldir
		}
	}

	let styleCode = "";
	for (const file of fs
		.readdirSync(styledir)
		.filter((file) => file.endsWith(".condition.sass"))) {
		let sassStyle = fs.readFileSync(stylefile(file), "utf8");

		const cssStyle = `'${csso.minify(sass.compile(stylefile(file)).css).css}'`;
		/{{([a-zA-Z0-9_]+):([a-zA-Z0-9_]+)}}/.exec(sassStyle)?.map((x) => {
			const key = x[1];
			const value = x[2];
			const code = `if (cfg("${key}")=="${value}") style(${cssStyle},"${key}-${value}-style")`;
			styleCode += code + "\n";
		});
	}

	const jsCodemap = new Map<string, string>();
	for (const file of fs
		.readdirSync(srcdir)
		.filter((file) => file.endsWith(".js"))) {
		const code = processSingleJs(file, jsfile(file), buildInfo);
		jsCodemap.set(file, code);
	}

	const fullCode = getFullCode(jsCodemap, styleCode, buildInfo);

	writeScrpt(opt, fullCode);
	// debugger;
}

function processSingleJs(filename: string, path: string, buildInfo: BuildInfo): string {
	let code = fs.readFileSync(path, "utf8").trim();
	if (code === "") return "\n";


	const regex_STYLE = /\$STYLE\((.+?)\)/g;
	code = code.replace(regex_STYLE, (_match, sassFileName) => {
		sassFileName = sassFileName.replaceAll(' ', '').replaceAll('"', '').replaceAll("'", '');
		if (!sassFileName.endsWith('.sass')) sassFileName += '.sass';
		let sassFilePath = pathJoin(buildInfo.paths.styledir, sassFileName);
		const result = `'${csso.minify(sass.compile(sassFilePath).css).css}'`
		return result;
	});

	const key = filename.substring(0, filename.indexOf("."));
	let result = "\n// " + filename + "\n";
	try {
		const evalCode = eval(code);
		if (!evalCode.key) {
			// 在第一个{后添加key:filename.substring(0, filename.firstIndexOf("."))
			code = code.substring(0, code.indexOf("{") + 1) + `\nkey: "${key}", ` + code.substring(code.indexOf("{") + 1);
		}
		if (evalCode.showInMenu) {
			result += `addOptionOnMenu("${key}")\n`
		}
		logger.log(`processSingleJs: ${path}, evalCode: ${evalCode}`);
	} catch (error) {
		logger.err(`processSingleJs: ${path}`, error as Error);
	}

	result += `addModule${code}\n`

	if (filename.endsWith(".onclick.js")) {

	} else if (filename.endsWith(".mode.js")) {

	} else /* if (filename.endsWith(".direct.js")) */ {

	}

	return result;
}
function getFullCode(codemap: Map<string, string>, styleCode: string, buildInfo: BuildInfo) {

	let code_direct = "";
	let code_onclick = "";
	let code_mode = "";
	for (const [file, code] of codemap) {
		if (file.endsWith(".onclick.js")) {
			code_onclick += code;
		} else if (file.endsWith(".mode.js")) {
			code_mode += code;
		} else /* if (file.endsWith(".direct.js")) */ {
			code_direct += code;
		}
	}

	const code_utils = res.get_core_utils()

	const headerStr = fs.readFileSync(buildInfo.paths.headerfile, "utf8") + "\n"
	const config = fs.readJsonSync(buildInfo.paths.configfile, "utf8");
	const configVarStr = `var config = ${JSON.stringify(config, null, 4)};\n`


	const fullCode = headerStr
		+ `(function() {\n${configVarStr + code_utils + styleCode + code_direct + code_onclick + code_mode}\n})();\n`;
	return fullCode;
}

function writeScrpt(opt: BuildOptions, code: string) {
	fs.ensureDirSync("dist");
	fs.writeFileSync(pathJoin("dist", `${opt.name}.js`), code);
}

export default {
	build,
};
