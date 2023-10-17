import { type Static, Type } from '@sinclair/typebox';
import type { JsMinifyOptions } from '@swc/types';
import { readFile, stat } from 'fs/promises';
import { defaults, difference } from 'lodash-es';
import { extname, resolve } from 'path';
import { BuildMode } from './BuildManager.js';

export const ScriptMinifyConfigSchema = Type.Object({}, {
    additionalProperties: true,
});

export type ScriptMinifyConfig = JsMinifyOptions;

export const StyleMinifyConfigSchema = Type.Object({});

export const OutputConfigSchema = Type.Object({
    dist: Type.Optional(Type.String()),
});

export const MinifyConfigSchema = Type.Object({
    script: Type.Optional(Type.Union([
        Type.Boolean(),
        ScriptMinifyConfigSchema,
    ])),
    style: Type.Optional(Type.Union([
        Type.Boolean(),
        StyleMinifyConfigSchema,
    ])),
    json: Type.Optional(Type.Boolean()),
    xml: Type.Optional(Type.Boolean()),
});

const CommonConfigSchema = Type.Object({
    output: Type.Optional(OutputConfigSchema),
    alias: Type.Optional(Type.Object({}, { additionalProperties: Type.Array(Type.String()) })),
    minify: Type.Optional(Type.Union([
        Type.Boolean(),
        MinifyConfigSchema,
    ])),
    sourceMap: Type.Optional(Type.Union([
        Type.Boolean(),
        Type.Literal('inline'),
    ])),
});

export const PlatformConfigSchema = Type.Intersect([
    Type.Object({
        name: Type.String(),
        target: Type.String(),
    }, { additionalProperties: true }),
    CommonConfigSchema,
]);

export type PlatformConfig = Static<typeof PlatformConfigSchema>;

export const ConfigSchema = Type.Intersect([
    Type.Object({
        targets: Type.Array(PlatformConfigSchema),
    }),
    CommonConfigSchema,
]);

export type ConfigType = Static<typeof ConfigSchema>;

const CONFIG_FILES = [
    'cromos.config.ts',
    'cromos.config.mjs',
    'cromos.config.js',
    'cromos.config.json',
];

export const checkFileAccess = async (path: string) => {
    try {
        const fileStat = await stat(path);

        if (fileStat.isFile()) {
            return true;
        }

        throw new Error(`${path} is not file`);
    } catch (e) {
        const error = e as NodeJS.ErrnoException;

        if (error.code === 'EACCES') {
            throw new Error(`${path} is not accessible`);
        }

        throw e;
    }
};

const tryToGetConfigFile = async (cwd: string) => {
    for (const fileName of CONFIG_FILES) {
        try {
            if (await checkFileAccess(resolve(cwd, fileName))) {
                return fileName;
            }
        } catch (e) {
            const error = e as NodeJS.ErrnoException;

            if (error.code === 'ENOENT') {
                continue;
            }

            throw e;
        }
    }

    return undefined;
};

const processReadConfig = async (path: string) => {
    const ext = extname(path);

    const str = await readFile(path, 'utf8');

    if (ext === '.json') {
        return JSON.parse(str);
    }

    return await import(path).then(m => m.default);
};

export interface BuildConfigContext {
    cwd: string;
    mode: BuildMode;
}

export const readConfig = async (
    input: undefined | string | ConfigType,
    context: BuildConfigContext,
): Promise<ConfigType> => {
    if (!input) {
        input = await tryToGetConfigFile(context.cwd);
    }

    if (!input) {
        throw new Error('No config file found');
    }

    if (typeof input === 'string') {
        const filePath = resolve(context.cwd, input);

        await checkFileAccess(filePath);

        input = await processReadConfig(filePath);
    }

    return input as ConfigType;
};

export const mergeConfigAndTargets = (
    config: ConfigType | undefined,
    targets: string[] | undefined,
): [ConfigType, string[]] => {
    if (!targets?.length && !config?.targets) {
        throw new Error('No targets specified, must specify `targets` or `config.targets`');
    } else if (!config?.targets) {
        config = config ? { ...config } : {} as any;
        config!.targets = targets!.map((target) => {
            return {
                name: target,
                target: target,
            };
        });
    } else {
        targets = config!.targets.map(t => t.name);
    }

    const a = difference(targets!, config!.targets.map(t => t.name));

    if (a.length) {
        throw new Error(`Targets ${a.join(', ')} not found in config`);
    }

    return [config!, targets!];
};

const commonDefaultConfig: Partial<ConfigType> = {
    output: {
        dist: './dist',
    },
};

const productionDefaultConfig: Partial<ConfigType> = {
    ...commonDefaultConfig,
    sourceMap: false,
    minify: true,
};

const developmentDefaultConfig: Partial<ConfigType> = {
    ...commonDefaultConfig,
    sourceMap: true,
    minify: true,
};

export const transformConfig = (config: ConfigType, context: BuildConfigContext): ConfigType => {
    return defaults(config, context.mode === BuildMode.production ? productionDefaultConfig : developmentDefaultConfig);
};
