import { ConfigOptions, DevConfigOptions } from '../main';
import * as chokidar from 'chokidar';
import script from './script';

function watch(config: ConfigOptions,config_dev:DevConfigOptions, dirs: string[]) {

    // 创建监听器
    const watcher = chokidar.watch(dirs, {
        ignored: /^\./, // 忽略隐藏文件
        persistent: true,
        depth: 3,
        ignoreInitial: true, // 如果设置为 false，那么当 chokidar 发现这些文件路径时（在 ready 事件之前）实例化监视时，也会为匹配路径发出 add/addDir 事件。
        // awaitWriteFinish: true,
        awaitWriteFinish: {
            stabilityThreshold: 800,
        },
    });

    // 监听事件
    watcher.on('all', (event, path) => {
        script.build(config,config_dev,path);
    });

}

export default { watch };