import type { CommandBuilder, Options, ArgumentsCamelCase } from 'yargs';
import type { CommonOptions } from '../bin.js';

export const command = 'build';

export const describe = 'Build a project';

export const options: Record<string, Options> = {
    watch: {
        type: 'boolean',
        describe: 'Watch file change',
        default: false,
    },
    cwd: {
        type: 'string',
        describe: 'Current working directory, default: process.cwd()',
    },
    target: {
        type: 'string',
        describe: 'Build target, weapp/alipay/bytedance/swan/react',
        demandOption: true,
    },
};

export interface BuildOptions extends CommonOptions {
    watch?: boolean;
    cwd?: string;
    target: string;
}

export const builder: CommandBuilder = (yargs) => {
    yargs.usage(`Usage: $0 ${command} --target={BUILD_TARGET} [options]`);

    yargs.options(options);

    return yargs;
};

export const commandHandler = async (options: ArgumentsCamelCase<BuildOptions>) => {
    const { BuildManager } = await import('@cromosjs/compiler');

    const manager = new BuildManager({
        cwd: options.cwd,
        target: options.target,
        watch: options.watch,
        verbose: options.verbose,
    });

    await manager.start();
};

export const handler = async (argv: ArgumentsCamelCase<BuildOptions>) => {
    return commandHandler(argv);
};
