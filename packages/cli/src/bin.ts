#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import * as commands from './commands/index.js';

const { default: packageJson } = await import('../package.json', {
    assert: {
        type: 'json',
    },
});

export interface CommonOptions {
    verbose?: boolean;
}

const args = yargs(hideBin(process.argv))
    .scriptName('cromosjs')
    .command(Object.values(commands) as any)
    .option('verbose', {
        alias: 'v',
        type: 'boolean',
        default: false,
    })
    .usage('Usage: $0 <command> [options]')
    .help()
    .version(packageJson.version)
    .strict();

const argv = await args.argv;

if (!argv._.length) {
    args.showHelp();
}
