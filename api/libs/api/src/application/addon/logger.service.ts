import { Injectable, Logger as NestLogger } from '@nestjs/common';
import { History, LogLevel } from '@impactium/types';
import { λLogger } from '@impactium/pattern';

@Injectable()
export class Logger extends NestLogger {
  protected static messages: History[] = [];

  static log(message: any, context?: string) {
    Logger.store('log', message, context);
    context
      ? super.log(message, context)
      : super.log(message);
  }

  static error(message: any, context?: string) {
    Logger.store('error', message, context);
    context
      ? super.error(message, context)
      : super.error(message);
  }

  static warn(message: any, context?: string) {
    Logger.store('warn', message, context);
    context
      ? super.warn(message, context)
      : super.warn(message);
  }

  static debug(message: any, context?: string) {
    Logger.store('debug', message, context);
    context
      ? super.debug(message, context)
      : super.debug(message);
  }

  static verbose(message: any, context?: string) {
    Logger.store('verbose', message, context);
    context
      ? super.verbose(message, context)
      : super.verbose(message);
  }

  
  static fatal(message: any, context?: string) {
    Logger.store('fatal', message, context);
    context
      ? super.fatal(message, context)
      : super.fatal(message);
  }

  private static store(level: LogLevel, message: string, context?: string, trace?: string) {
    Logger.messages.push({ level, message: Logger.format(level, message, context, trace) });
  }

  public static history = () => Logger.messages;

  private static preformat: Record<LogLevel, string> = {
    log: 'green',
    warn: 'yellow',
    error: 'red',
    debug: 'magneta',
    verbose: 'cyan',
    fatal: 'white'
  }

  private static format(level: LogLevel, message: any, context?: string, trace?: string) {
    const timestamp = new Date().toISOString();
    const pid = process.pid;
    const contextInfo = context ? `[${context}] ` : '';
    const traceInfo = trace ? ` ${trace}` : '';

    return λLogger[Logger.preformat[level]](`[Nest] ${pid} - ${λLogger.white(timestamp)} ${level.toUpperCase().padStart(7, ' ')} ${λLogger.yellow(contextInfo)}${message}${traceInfo}`);
  }
}
