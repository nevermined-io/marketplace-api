import { Injectable, Logger as LoggerBase, LoggerService, Optional } from '@nestjs/common';
import { isObject } from 'lodash';

declare const process: any;
const yellow = (s: string) => s;

export type LogLevel = 'log' | 'error' | 'warn' | 'debug' | 'verbose';

@Injectable()
class LoggerSplunk implements LoggerService {
  static overrideLogger(logger: LoggerService | LogLevel[] | boolean) {
    if (Array.isArray(logger)) {
      this.logLevels = logger;
      return;
    }
    this.instance = isObject(logger) ? (logger as LoggerService) : undefined;
  }

  static log(message: any, context = '', isTimeDiffEnabled = true) {
    this.printMessage(message, 'log', context, isTimeDiffEnabled);
  }

  static error(message: any, trace = '', context = '', isTimeDiffEnabled = true) {
    this.printMessage(message, 'error', context, isTimeDiffEnabled);
    this.printStackTrace(trace);
  }

  static warn(message: any, context = '', isTimeDiffEnabled = true) {
    this.printMessage(message, 'warn', context, isTimeDiffEnabled);
  }

  static debug(message: any, context = '', isTimeDiffEnabled = true) {
    this.printMessage(message, 'debug', context, isTimeDiffEnabled);
  }

  static verbose(message: any, context = '', isTimeDiffEnabled = true) {
    this.printMessage(message, 'verbose', context, isTimeDiffEnabled);
  }

  private static logLevels: LogLevel[] = ['log', 'error', 'warn', 'debug', 'verbose'];
  private static lastTimestamp?: number;
  private static instance?: typeof LoggerSplunk | LoggerService = LoggerSplunk;

  private static printMessage(message: any, logLevel: LogLevel, context = '', isTimeDiffEnabled?: boolean) {
    let output = '';
    if (isObject(message)) {
      Object.entries(message).forEach(
        ([key, value]) =>
          (output = `${output} ${key}='${
            isObject(value) ? `${'Object:'}\n${JSON.stringify(value, null, 2)}\n` : value
          }'`)
      );
    } else {
      output = `message='${isObject(message) ? `${'Object:'}\n${JSON.stringify(message, null, 2)}\n` : message} '`;
    }

    process.stdout.write(`logLevel='${logLevel}' `);

    const timestamp = new Date().toISOString();
    process.stdout.write(`timestamp='${timestamp}' `);

    context && process.stdout.write(`context='${context}' `);
    process.stdout.write(output);

    this.printTimestamp(isTimeDiffEnabled);
    process.stdout.write(`\n`);
  }

  private static printTimestamp(isTimeDiffEnabled?: boolean) {
    const includeTimestamp = LoggerSplunk.lastTimestamp && isTimeDiffEnabled;
    if (includeTimestamp) {
      process.stdout.write(yellow(` +${Date.now() - LoggerSplunk.lastTimestamp}ms`));
    }
    LoggerSplunk.lastTimestamp = Date.now();
  }

  private static printStackTrace(trace: string) {
    if (!trace) {
      return;
    }
    process.stdout.write(trace);
    process.stdout.write(`\n`);
  }

  constructor(@Optional() private readonly context?: string, @Optional() private readonly isTimestampEnabled = false) {}

  error(message: any, trace = '', context?: string) {
    const instance = this.getInstance();
    if (!this.isLogLevelEnabled('error')) {
      return;
    }
    instance && instance.error.call(instance, message, trace, context || this.context);
  }

  log(message: any, context?: string) {
    this.callFunction('log', message, context);
  }

  warn(message: any, context?: string) {
    this.callFunction('warn', message, context);
  }

  debug(message: any, context?: string) {
    this.callFunction('debug', message, context);
  }

  verbose(message: any, context?: string) {
    this.callFunction('verbose', message, context);
  }

  private callFunction(name: 'log' | 'warn' | 'debug' | 'verbose', message: any, context?: string) {
    if (!this.isLogLevelEnabled(name)) {
      return;
    }
    const instance = this.getInstance();
    const func = instance && (instance as typeof LoggerSplunk)[name];
    func && func.call(instance, message, context || this.context, this.isTimestampEnabled);
  }

  private getInstance(): typeof LoggerSplunk | LoggerService {
    const { instance } = LoggerSplunk;
    return instance === this ? LoggerSplunk : instance;
  }

  private isLogLevelEnabled(level: LogLevel): boolean {
    return LoggerSplunk.logLevels.includes(level);
  }
}

export const Logger = (process.env.NODE_ENV === 'development' ? LoggerBase : LoggerSplunk) as any;