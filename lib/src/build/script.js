const path = require('node:path');
const fs = require('fs-extra');
const logger = require('../utils/logger');
const res = require('../utils/res');
const sass = require('sass');
const csso = require('csso');

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
			headerfile: path.join(root, 'header'),
			configfile: path.join(root, 'config.json'),
			srcdir: path.join(root, 'src'),
			styledir: path.join(root, 'style'),
			htmldir: path.join(root, 'html'),
		},
	};

	const jsCodemap = new Map();
	fs.readdirSync(buildInfo.paths.srcdir)
		.filter(file => file.endsWith('.js'))
		.forEach(file => {
			try {
				const code = processSingleJs(file, path.join(buildInfo.paths.srcdir, file), buildInfo);
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
	let code = fs.readFileSync(filepath, 'utf8').trim();
	if (code === '') return '\n';

	const regex_STYLE = /\$STYLE\((.+?)\)/g;
	code = code.replace(regex_STYLE, (_match, sassFileName) => {
		let fixedSassFileName = sassFileName.replaceAll(/[\s"']/g, '');
		if (!fixedSassFileName.toLowerCase().endsWith('.sass')) fixedSassFileName += '.sass';
		const sassFilePath = path.join(buildInfo.paths.styledir, fixedSassFileName);
		return `\`${csso.minify(sass.compile(sassFilePath).css).css}\``;
	});

	const key = filename.substring(0, filename.indexOf('.'));
	let result = `\n// ${filename}\n`;
	code = `${code.substring(0, code.indexOf('{') + 1)}\nkey: "${key}", ${code.substring(code.indexOf('{') + 1)}`;

	result += `addModule${code}\n`;
	return result;
}

function getFullCode(codemap, buildInfo) {
	const codes = Array.from(codemap.values()).join('');
	const code_utils = res.get_core_js();
	const config_js = res.get_config_js();
	const debug_js = res.get_debug_js();

	const headerStr = `${fs.readFileSync(buildInfo.paths.headerfile, 'utf8')}\n`;
	const config = fs.readJsonSync(buildInfo.paths.configfile, 'utf8');
	const configVarStr = `var config = ${JSON.stringify(config, null, 4)};\n`;

	return `${headerStr}(function() {\n${configVarStr + code_utils + config_js + codes + debug_js}\n})();\n`;
}

function writeScrpt(buildInfo, code) {
	const outputPath = path.join('dist', `${buildInfo.root}.js`);
	fs.ensureFileSync(outputPath);
	fs.writeFileSync(outputPath, code);
}

module.exports = { build, tryBuild };