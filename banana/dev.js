function dev() {
    require('./build').build();

    const build = require('./build')._build;
    const outputAll = require('./build').outputAll;
    const chokidar = require('chokidar');
    const fs = require('fs');

    // 获取src下的一级子文件夹
    const subDirs = getSubDirectories('./src');

    // 创建监听器
    const watcher = chokidar.watch(subDirs, {
        ignored: /^\./, // 忽略隐藏文件
        persistent: true,
        depth: 2,
        ignoreInitial: true, // 如果设置为 false，那么当 chokidar 发现这些文件路径时（在 ready 事件之前）实例化监视时，也会为匹配路径发出 add/addDir 事件。
        awaitWriteFinish: true,
        awaitWriteFinish: {
            stabilityThreshold: 800,
        },
    });

    // 监听事件
    watcher.on('all', (event, path) => {
        const dir = path.split('\\')[1];
        toBuild(dir);
    });

    // 构建
    function toBuild(dir) {
        try {
            if (!build(dir)) return;
            outputAll();
            console.info(`(${new Date().toISOString()}) ⭕ ${dir} rebuild successful`);
        } catch (error) {
            console.error(`(${new Date().toISOString()}) ❌ ${dir} failed to rebuild`);
            console.error(error);
        }
    }

    // 获取子文件夹
    function getSubDirectories(dir) {
        const dirs = fs.readdirSync(dir).filter(name => {
            const path = `${dir}/${name}`;
            return fs.statSync(path).isDirectory();
        });

        return dirs.map(sub => `${dir}/${sub}`);
    }
}

module.exports = {
    dev: dev,
} 
