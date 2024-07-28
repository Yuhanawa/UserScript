const path = require("node:path");
const fs = require("fs-extra");
const logger = require("../utils/logger");
const res = require("../utils/res");
const sass = require("sass");
const csso = require("csso");

function tryBuild(config, config_dev, startInfo, root) {
	try {
		build(config, config_dev, startInfo, root);
		logger.success(`build success: ${root}`);
	} catch (error) {
		logger.err(`build failed: ${root}`, error);
	}
}

function build(config, config_dev, startInfo, root) {
	const buildInfo = {
		root,
		config,
		config_dev,
		startInfo,
		paths: {
			headerfile: path.join(root, "header"),
			indexfile: path.join(root, "index"),
			configfile: path.join(root, "config.json"),
			srcdir: path.join(root, "src"),
			styledir: path.join(root, "style"),
		},
	};

	const jsCodemap = new Map();

	if (!fs.existsSync(buildInfo.paths.configfile)) {
		logger.warn(
			`${root} will be skip, because '${buildInfo.paths.configfile}' not found.`,
		);
		return;
	}
	if (!fs.existsSync(buildInfo.paths.srcdir)) {
		logger.warn(
			`${root} will be skip, because '${buildInfo.paths.srcdir}' not found.`,
		);
		return;
	}
	if (!fs.existsSync(buildInfo.paths.headerfile)) {
		logger.fail(`header file not found: ${buildInfo.paths.headerfile}`);
		return;
	}

	fs.readdirSync(buildInfo.paths.srcdir)
		.filter((file) => file.endsWith(".js"))
		.forEach((file) => {
			try {
				const code = processSingleJs(
					file,
					path.join(buildInfo.paths.srcdir, file),
					buildInfo,
				);
				jsCodemap.set(file, code);
			} catch (error) {
				logger.err(`processSingleJs: ${filepath}`, error);
				throw error;
			}
		});

	const fullCode = getFullCode(jsCodemap, buildInfo);
	writeScrpt(buildInfo, fullCode);
}

function processSingleJs(filename, filepath, buildInfo) {
	let code = fs.readFileSync(filepath, "utf8").trim();
	if (code === "") return "\n";

	const regex_STYLE = /\$STYLE\((.+?)\)/g;
	code = code.replace(regex_STYLE, (_match, sassFileName) => {
		let fixedSassFileName = sassFileName.replaceAll(/[\s"']/g, "");
		if (!fixedSassFileName.toLowerCase().endsWith(".sass"))
			fixedSassFileName += ".sass";
		const sassFilePath = path.join(buildInfo.paths.styledir, fixedSassFileName);
		return `\`${csso.minify(sass.compile(sassFilePath).css).css}\``;
	});

	const key = filename.substring(0, filename.indexOf("."));
	let result = `\n// ${filename}\n`;
	code = `${code.substring(
		0,
		code.indexOf("{") + 1,
	)}\nkey: "${key}", ${code.substring(code.indexOf("{") + 1)}`;

	result += `addModule${code}\n`;
	return result;
}

function getMainJsStr(folderPath) {
	let concatenatedContent = "";

	// 读取main.js文件（如果存在）
	const mainJSPath = path.join(folderPath, "main.js");
	if (fs.existsSync(mainJSPath)) {
		concatenatedContent += `// main.js\n${fs.readFileSync(
			mainJSPath,
			"utf8",
		)}\n`;
	}

	// 读取所有main-*.js文件
	const files = fs.readdirSync(folderPath);
	const mainFiles = files.filter(
		(file) => file.startsWith("main-") && file.endsWith(".js"),
	);

	for (const file of mainFiles) {
		const filePath = path.join(folderPath, file);
		concatenatedContent += `// ${file}\n${fs.readFileSync(filePath, "utf8")}\n`;
	}

	return concatenatedContent;
}

function getFullCode(codemap, buildInfo) {
	const codes = Array.from(codemap.values()).join("");
	const code_utils = res.get_core_js();
	const config_js = res.get_config_js();
	const debug_js = buildInfo.startInfo.debug ? res.get_debug_js() : "";

	const indexStr = fs.existsSync(buildInfo.paths.indexfile)
		? fs.readFileSync(buildInfo.paths.indexfile, "utf8")
		: "";
	const config = fs.readJsonSync(buildInfo.paths.configfile, "utf8");
	const configVarStr = `var config = ${JSON.stringify(config, null, 0)};`;
	// biome-ignore lint/security/noGlobalEval: 使用eval是最简便的方法
	const headerStr = `${fs.readFileSync(
		buildInfo.paths.headerfile,
		"utf8",
	)}\n`.replace(/\${(.*?)}/g, (_, p) => eval(`config.${p}`));
	const mainStr = getMainJsStr(buildInfo.root).trim();

	const info = `/* \n\t source: ${buildInfo.config.source}; \n\t version: ${config.version}; \n */`;

	const result = `${headerStr}${info}\n(function() {\n${indexStr}\n${configVarStr}\n${code_utils}${config_js}\n${mainStr}\n${codes}\n${debug_js}\n})();\n`;
	return result.replaceAll("\n\n\n", "\n").trim();
}

function writeScrpt(buildInfo, code) {
	const outputPath = path.join("dist", `${buildInfo.root}.js`);
	fs.ensureFileSync(outputPath);
	fs.writeFileSync(outputPath, code);
}

module.exports = { build, tryBuild };
