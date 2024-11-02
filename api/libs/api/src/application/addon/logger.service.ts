import { Injectable, Logger as NestLogger } from '@nestjs/common';
import { History, LogLevel } from '@impactium/types';
import { λLogger } from '@impactium/pattern';

@Injectable()
export class Logger extends NestLogger {
  protected static messages: History[] = [];

  static log(message: any, context?: string) {
    Logger.store('log', message, context);
    super.log(message, context);
  }

  static error(message: any, trace?: string, context?: string) {
    Logger.store('error', message, context, trace);
    super.error(message, trace, context);
  }

  static warn(message: any, context?: string) {
    Logger.store('warn', message, context);
    super.warn(message, context);
  }

  static debug(message: any, context?: string) {
    Logger.store('debug', message, context);
    super.debug(message, context);
  }

  static verbose(message: any, context?: string) {
    Logger.store('verbose', message, context);
    super.verbose(message, context);
  }

  private static store(level: LogLevel, message: string, context?: string, trace?: string) {
    Logger.messages.push({ level, message: Logger.format(level, message, context, trace) });
  }

  public static history() {
    Logger.warn('Someone requested for history', 'Internal');
    return Logger.messages;
  }

  private static preformat: Record<LogLevel, string> = {
    log: 'green',
    warn: 'yellow',
    error: 'red',
    debug: 'blue',
    verbose: 'cyan',
    fatal: 'magnetta'
  }

  private static format(level: LogLevel, message: any, context?: string, trace?: string) {
    const timestamp = new Date().toISOString();
    const pid = process.pid;
    const contextInfo = context ? `[${context}] ` : '';
    const traceInfo = trace ? ` ${trace}` : '';

    return λLogger[Logger.preformat[level]](`[Nest] ${pid} - ${λLogger.white(timestamp)} ${level.toUpperCase()} ${λLogger.yellow(contextInfo)}${message}${traceInfo}`);
  }
}
