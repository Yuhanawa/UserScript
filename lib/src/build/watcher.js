const chokidar = require('chokidar');
const script = require('./script');
const logger = require('../utils/logger');

function watch(config, config_dev, startInfo, subPaths) {
    logger.log(`watching...`);
    for (const subPath of subPaths) {
        const watcher = chokidar.watch(subPaths, {
            ignored: /^\./,
            persistent: true,
            depth: 3,
            ignoreInitial: true,
            awaitWriteFinish: {
                stabilityThreshold: 800,
            },
        });

        watcher.on('all', (event, path) => {
            script.tryBuild(config, config_dev, startInfo, subPath);
        });
    }

}

module.exports = { watch };