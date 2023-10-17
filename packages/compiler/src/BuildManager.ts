import { type Static, Type } from '@sinclair/typebox';
import { EventEmitter } from 'events';
import * as process from 'process';
import type { CompilerOptions } from 'typescript';
import type FileCompiler from './compilers/FileCompiler.js';
import {
    ConfigSchema,
    type ConfigType,
    mergeConfigAndTargets,
    type PlatformConfig,
    readConfig,
    transformConfig,
} from './config.js';

// 文件类型影响编译优先级
export enum FileTypes {
    CONFIG = 'config',
    IDE_CONFIG = 'ide_config',
    GLOBAL_STYLE = 'global_style',
    GLOBAL_SCRIPT = 'global_script',
    APP = 'app',
    PAGE = 'page'
}

export enum BuildMode {
    production = 'production',
    development = 'development'
}

export const BuildManagerOptionsSchema = Type.Object({
    watch: Type.Optional(Type.Boolean()),
    cwd: Type.Optional(Type.String()),
    targets: Type.Optional(Type.Array(Type.String())),
    verbose: Type.Optional(Type.Boolean()),
    mode: Type.Optional(Type.Enum(BuildMode)),
    config: Type.Optional(ConfigSchema),
});

export const BuildManagerOptionsWithConfigPathSchema = Type.Intersect([
    Type.Omit(BuildManagerOptionsSchema, ['config']),
    Type.Object({
        config: Type.Optional(Type.Union([
            ConfigSchema,
            Type.String(),
        ])),
    }),
]);

export type BuildManagerOptions = Static<typeof BuildManagerOptionsSchema>;

export type BuildManagerOptionsWithConfigPath = Static<typeof BuildManagerOptionsWithConfigPathSchema>;

export default class BuildManager extends EventEmitter {
    public readonly cwd: string;

    private readonly watch: boolean;

    private readonly mode: BuildMode;

    private readonly config: ConfigType;

    private readonly targets: string[];

    private readonly targetConfigs = new Map<string, PlatformConfig>();

    private readonly tsConfig: CompilerOptions;

    private readonly verbose: boolean;

    private readonly watcher?: Chokidar.FSWatcher;

    private readonly files = new Map<string, FileCompiler>();

    #running = false;

    static async create(options: BuildManagerOptionsWithConfigPath) {
        const { cwd = process.cwd(), watch = false, mode = BuildMode.production, config, ...extra } = options;

        const mergedConfig = await readConfig(
            config, {
                cwd,
                mode,
            },
        );

        return new BuildManager({
            cwd,
            watch,
            mode: mode,
            config: mergedConfig,
            ...extra,
        });
    }

    constructor(options: BuildManagerOptions) {
        super();

        this.cwd = options.cwd ?? process.cwd();

        this.watch = options.watch ?? false;

        this.mode = options.mode ?? BuildMode.production;

        const [config, targets] = mergeConfigAndTargets(options.config, options.targets);

        this.config = transformConfig(config, {
            cwd: this.cwd,
            mode: this.mode,
        });

        this.targets = targets;

        // todo: check if target transform and runtime installed

        this.verbose = options.verbose ?? false;
    }

    public async start() {
        if (this.#running) {
            throw new Error('BuildManager is already running');
        }

        this.#running = true;

        await this.build();

        if (this.watch) {
            await this.startWatch();
        }
    }

    private async startWatch() {

    }

    public async build() {
        await this.collectFiles();
    }

    private async collectFiles() {

    }

    public async generatePlatformConfig() {

    }
}
