const http = require("node:http");
const path = require("node:path");

const fs = require("fs-extra");

const logger = require("./utils/logger");

function generateInstallPage(subPaths) {
	return `<!DOCTYPE html>
    <html lang="zh-CN">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <link rel="icon" href="data:image/ico;base64,aWNv">
        <title>User Scripts</title>
    </head>
    <body>
        ${subPaths.map((sub) => `<a href="${sub}.js">${sub}</a>`).join("<br/>")}
    </body>
    </html>`;
}

function startServer(subPaths,port) {
	http
		.createServer((req, res) => {
			const url = req.url;
			if (url === "/") {
				res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
				const html = generateInstallPage(subPaths);
				res.end(html);
			} else if (url === "/favicon.ico") {
				// 204: no content
				res.writeHead(204);
				res.end();
			} else {
				const filePath = path.join("dist", url);
				fs.readFile(filePath, "utf8", (err, content) => {
					if (err) {
						res.writeHead(404, { "Content-Type": "text/plain" });
						res.end("File not found");
					} else {
						res.writeHead(200, {
							"Content-Type": "text/javascript; charset=UTF-8",
							"X-Content-Type-Options": "nosniff",
						});
						res.end(content);
					}
				});
			}
		})
		.listen(port);
}

function tryStartServer(subPaths,port) {
	try {
		startServer(subPaths,port);
		logger.success("Server started at http://localhost:8080");
	} catch (error) {
		logger.err("Server start failed", error);
	}
}

module.exports = {
	tryStartServer
};
