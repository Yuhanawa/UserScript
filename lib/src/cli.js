const { Command } = require('commander');
const { main } = require('./main');

const program = new Command();

const startInfo = {
    command: 'dev',
    debug: false,
    watch: false
};

program
    .description('A utility for tampermonkey user scripts')
    .option('--debug', 'Enable debug mode')
    .option('--watch', 'Watch for changes')
    .hook('preAction', (thisCommand) => {
        const opts = thisCommand.opts();
        startInfo.debug = !!opts.debug;
        startInfo.watch = !!opts.watch;
    });

program
    .command('dev', { isDefault: true })
    .description('dev: watch and dev')
    .action(() => {
        startInfo.debug = true;
        startInfo.watch = true;
        main(startInfo);
    });

program
    .command('build')
    .description('Build for production')
    .action(() => {
        startInfo.command = 'build';
        main(startInfo);
    });

program.parse(process.argv);