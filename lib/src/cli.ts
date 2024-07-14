import { Command } from 'commander';
import { main } from './main';

const program = new Command();

type StartInfo = {
    command: string,
    debug: boolean,
    watch: boolean
}
let startInfo: StartInfo = {
    command: 'dev',
    debug: false,
    watch: false
}


program
    .description('A utility for tampermonkey user scripts')
    .option('--debug', 'Enable debug mode')
    .option('--watch', 'Watch for changes')
    .hook('preAction', (thisCommand) => {
        if (thisCommand.opts().debug) {
            startInfo.debug = true;
        }
        if (thisCommand.opts().watch) {
            startInfo.watch = true;
        }
    });



program
    .command('dev', { isDefault: true })
    .description('dev: watch and dev')
    .action(() => {
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

export { StartInfo }