import { getSessionFromExecutionCtx } from '../session';
import { createLogger as winstonCreateLogger, transports, format, Logger as winstonLogger, Profiler } from 'winston';


export function createLogger(filename: string, logConfig?: ILogConfig): ILog {
    return new Log(filename, logConfig);
}


/* ~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* ~~~~~~~~~~~~~~~~~~~~~~~~~ */
export interface ILog {
    error: (message: string, ...args: string[]) => void;
    warn: (message: string, ...args: string[]) => void;
    info: (message: string, ...args: string[]) => void;
    debug: (message: string, ...args: string[]) => void;
}

class Log implements ILog {
    private _filename: string;
    private _logger: Logger;
    private _logConfig: ILogConfig;

    constructor(filename: string, logConfig?: ILogConfig) {
        this._filename = filename;
        this._logConfig = logConfig;
        this._logger = new Logger(logConfig);
    }

    error(message: string, ...args: string[]) {
        this._logger.getLogger().error(message + ' ' + args.join(' '));
    }

    warn(message: string, ...args: string[]) {
        this._logger.getLogger().error(message + ' ' + args.join(' '));
    }

    info(message: string, ...args: string[]) {
        this._logger.getLogger().error(message + ' ' + args.join(' '));
    }

    debug(message: string, ...args: any[]) {
        this._logger.getLogger().error(message + ' ' + args.join(' '));
    }


    getSessionCtx(): any {
        return getSessionFromExecutionCtx();
    }

    getLogConfig(): ILogConfig {
        return {
            level: LogLevel[this._logger.getLogger().level as keyof typeof LogLevel],
            exitOnError: this._logger.getLogger().exitOnError as boolean,
            silent: this._logger.getLogger().silent
        };
    }

}


/* ~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* ~~~~~~~~~~~~~~~~~~~~~~~~~ */
export enum LogLevel {
    error = 1,
    warn = 2,
    info = 3,
    debug = 4
}
export interface ILogConfig {
    level?: LogLevel;
    silent?: boolean;
    exitOnError?: boolean
}
class Logger {
    private _logger: winstonLogger;

    constructor(config: ILogConfig) {
        this._logger = winstonCreateLogger({
            level: config?.level ? LogLevel[config.level] : LogLevel[LogLevel.debug],
            format: format.combine(
                format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            ),
            transports: [
                new transports.Console()
            ],
            exitOnError: config?.exitOnError ?? false
        });
    }

    public getLogger(): winstonLogger {
        return this._logger;
    }


}
