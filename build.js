
const fs = require('fs')

if ([...process.argv].indexOf('--update-versions') !== -1) {
    const { spawn } = require('child_process')

    const diff = spawn('git', ['diff', '--name-only', 'HEAD^', 'HEAD']);

    let result = '';

    diff.stdout.on('data', (data) => result += data);

    diff.on('close', () => {
        new Set(result.split('\n')
            .filter(path => path.startsWith('src/'))
            .map(path => path.split('/')[1])
        ).forEach(name => {
            try {
                const str = fs.readFileSync(`src/${name}/config.json`, 'utf8')
                let json = JSON.parse(str);
                let versionSplits = json["version"].split('.');
                versionSplits[versionSplits.length - 1] = (Number.parseInt(versionSplits[versionSplits.length - 1]) + 1)
                json["version"] = versionSplits.join('.');
                fs.writeFileSync(`src/${name}/config.json`, JSON.stringify(json, null, 2));
                console.log(`(${new Date().toISOString()}) ✅ ${name} update version success, version: ${json["version"]}`);
            } catch (error) {
                console.error(`(${new Date().toISOString()}) ❗ ${name} update version failed`);
            }
        })
        require('banana').build();
    });
} else {
    require('banana').build();
}
