enum Level {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

function now(): string {
  return new Date().toLocaleString('de-DE', {
    timeZone: 'Europe/Berlin',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function printConsoleMessage(level: Level, consoleMessage: string): void {
  let color = '';
  if (level === Level.DEBUG) {
    color = '\x1b[36m';
  } else if (level === Level.INFO) {
    color = '\x1b[32m';
  } else if (level === Level.WARN) {
    color = '\x1b[33m';
  } else if (level === Level.ERROR) {
    color = '\x1b[31m';
  }

  console.log(`${now()} | ${color}${level}\x1b[0m > ${consoleMessage}`);
}

function log(level: Level, message: string | Error): void {
  printConsoleMessage(level, message instanceof Error ? message.message : message);
}

export function debug(message: string): void {
  return log(Level.DEBUG, message);
}

export function info(message: string): void {
  return log(Level.INFO, message);
}

export function warn(message: string): void {
  return log(Level.WARN, message);
}

export function error(message: string): void {
  return log(Level.ERROR, message);
}
