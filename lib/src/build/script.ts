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

function build(opt: BuildOptions) {
	// const loadInfoFn = import(pathJoin(opt.path, "index.js"));
	// const info = loadInfoFn.default()

	const srcdir = pathJoin(opt.path, "src");
	const jsfile = (name: string) => pathJoin(srcdir, name);
	const styledir = pathJoin(opt.path, "style");
	const stylefile = (name: string) => pathJoin(styledir, name);
	const htmldir = pathJoin(opt.path, "html");
	const htmlfile = (name: string) => pathJoin(htmldir, name);

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
		const code = processSingleJs(file, jsfile(file),{
			opt,
			srcdir,
			styledir,
			htmldir
		});
		jsCodemap.set(file, code);
	}

	const fullCode = getFullCode(jsCodemap, styleCode);

	writeScrpt(opt, fullCode);
	// debugger;
}

function processSingleJs(filename: string, path: string, {opt, srcdir, styledir, htmldir}: {opt: BuildOptions, srcdir: string, styledir: string, htmldir: string}):string {
	let code = fs.readFileSync(path, "utf8").trim();
	if (code === "") return "\n";


    const regex_STYLE = /\$STYLE\((.+?)\)/g;
    code = code.replace(regex_STYLE, (_match, sassFileName) => {
        sassFileName = sassFileName.replaceAll(' ', '').replaceAll('"', '').replaceAll("'", '');
        if (!sassFileName.endsWith('.sass')) sassFileName += '.sass';
        let sassFilePath = pathJoin(styledir, sassFileName);
        const result = `'${csso.minify(sass.compile(sassFilePath).css).css}'`
        return result;
    });

	let result = "\n// " + filename + "\n";
	result += `addModule${code}\n`

	if (filename.endsWith(".onclick.js")) {

	} else if (filename.endsWith(".mode.js")) {

	} else /* if (filename.endsWith(".direct.js")) */ {

	}

	try {
		const evalCode = eval(code);
		if (evalCode.showInMenu) {
			result += `addOptionOnMenu("${filename.substring(0, filename.lastIndexOf("."))}")\n`
		}
		logger.log(`processSingleJs: ${path}, evalCode: ${evalCode}`);
	} catch (error) {
		logger.err(`processSingleJs: ${path}`, error as Error);
	}

	return result;
}
function getFullCode(codemap: Map<string, string>, styleCode: string) {

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

	const fullCode = code_utils + styleCode + code_direct + code_onclick + code_mode;
	return fullCode;
}

function writeScrpt(opt: BuildOptions, code: string) {
	fs.ensureDirSync("dist");
	fs.writeFileSync(pathJoin("dist", `${opt.name}.js`), code);
}

export default {
	build,
};
