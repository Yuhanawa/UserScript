const console = require("node:console");
const path = require("node:path");
const http = require("node:http");
const fs = require("fs-extra");

const watcher = require("./build/watcher");
const script = require("./build/script");
const res = require("./utils/res");
const logger = require("./utils/logger");

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
		try {
			http
				.createServer((req, res) => {
					const url = req.url;
					if (url === "/") {
						res.writeHead(200, { "Content-Type": "text/html charset=utf-8" });
						const html = `<!DOCTYPE html>
        <html lang="zh-CN">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <link rel="icon" href="data:image/ico;base64,aWNv">
            <title>Document</title>
        </head>
        <body>
            ${subPaths.map((sub) => `<a href="${`${sub}.js`}">${sub}</a>`).join("<br/>")}
        </body>
        </html>`;
						res.end(html);
					} else if (url === "/favicon.ico") {
						// Handle favicon.ico request
						res.writeHead(204); // No content
						res.end();
					} else {
						const filePath = path.join("dist", url);
						fs.readFile(filePath, "utf8", (err, content) => {
							if (err) {
								res.writeHead(404, { "Content-Type": "text/plain" });
								res.end("File not found");
							} else {
								res.writeHead(200, {
									"Content-Type": "text/javascript;charset=UTF-8",
								});
								res.end(content);
							}
						});
					}
				})
				.listen(8080);
			logger.success("Server running at http://localhost:8080/");
		} catch (error) {
			logger.err("Failed to start server", error);
		}
	}
}

module.exports = { main };
