const { Command } = require("commander");
const { main } = require("./main");
const fs = require("fs-extra");

const program = new Command();

const startInfo = {
	command: "dev",
	debug: false,
	watch: false,
	server: false,
};

program
	.description("A utility for tampermonkey user scripts")
	.option("--debug", "Enable debug mode")
	.option("--watch", "Watch for changes")
	.option("--server", "Start server")
	.hook("preAction", (thisCommand) => {
		const opts = thisCommand.opts();
		startInfo.debug = !!opts.debug;
		startInfo.watch = !!opts.watch;
		startInfo.server = !!opts.server;
	});

program
	.command("dev", { isDefault: true })
	.description("equal to build --watch --debug")
	.action(() => {
		startInfo.debug = true;
		startInfo.watch = true;
		main(startInfo);
	});

program
	.command("build")
	.description("Build for production")
	.action(() => {
		startInfo.command = "build";
		main(startInfo);
	});

program.parse(process.argv);
