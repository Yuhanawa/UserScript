
const fs = require('fs')

const { spawn } = require('child_process')

const diff = spawn('git', 'diff --name-only remotes/origin/master..remotes/origin/releases -- userscripts'.split(' '));

let result = '';

diff.stdout.on('data', (data) => result += data);

diff.on('close', () => {
    if (result !== '') {
        new Set(result.split('\n')
            .filter(path => path.startsWith('userscripts/'))
            .map(path => path.split('/')[1])
        ).forEach(name => {
            try {
                const filename = `userscripts/${name}/config.json`
                const str = fs.readFileSync(filename, 'utf8')
                const json = JSON.parse(str);
                const versionSplits = json.version.split('.');
                versionSplits[versionSplits.length - 1] = (Number.parseInt(versionSplits[versionSplits.length - 1]) + 1)
                json.version = versionSplits.join('.');
                fs.writeFileSync(filename, JSON.stringify(json, null, 2));
                spawn('pnpm', ['biome','format', filename, '--write'].join(' '));
                console.log(`(${new Date().toISOString()}) ✅ ${name} update version success, version: ${json.version}`);
            } catch (error) {
                console.error(`(${new Date().toISOString()}) ❗ ${name} update version failed`);
            }
            console.log(name);
        })
    }
});

