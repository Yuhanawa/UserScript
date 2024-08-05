const fs = require("fs-extra");
const path = require("node:path");

function getJsFilesRecursively(dirPath) {
	let results = [];
	try {
		for (const item of fs.readdirSync(dirPath)) {
			const fullPath = path.join(dirPath, item);

			if (fs.statSync(fullPath).isDirectory()) results = results.concat(getJsFilesRecursively(fullPath));
			else if (path.extname(item).toLowerCase() === ".js") results.push(fullPath);
		}
	} catch (error) {
		console.error("Error reading directory:", error);
	}
	return results;
}

module.exports = { getJsFilesRecursively };
