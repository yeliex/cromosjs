import { omit } from 'lodash-es';
import type { ArgumentsCamelCase, CommandBuilder } from 'yargs';
import { type BuildOptions, commandHandler, options as buildOptions } from './build.js';

export const command = 'dev';

export const describe = 'Start a development server';

export const options = omit(buildOptions, ['watch']);

type CommandOptions = Omit<BuildOptions, 'watch'>

export const builder: CommandBuilder = (yargs) => {
    yargs.usage(`Usage: $0 ${command} --target={BUILD_TARGET} [options]`);

    yargs.options(options);

    return yargs;
};

export const handler = async (argv: ArgumentsCamelCase<CommandOptions>) => {
    return commandHandler({
        ...argv,
        watch: true,
    });
};
