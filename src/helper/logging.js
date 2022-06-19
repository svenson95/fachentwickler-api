// eslint-disable-next-line no-shadow
// enum Level {
//   DEBUG = 'DEBUG',
//   INFO = 'INFO',
//   WARN = 'WARN',
//   ERROR = 'ERROR',
// }

function now() {
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

function printConsoleMessage(level, consoleMessage) {
  let color = '';
  if (level === 'DEBUG') {
    color = '\x1b[36m';
  } else if (level === 'INFO') {
    color = '\x1b[32m';
  } else if (level === 'WARN') {
    color = '\x1b[33m';
  } else if (level === 'ERROR') {
    color = '\x1b[31m';
  }

  console.log(`${now()} | ${color}${level}\x1b[0m > ${consoleMessage}`);
}

async function log(level, message) {
  printConsoleMessage(level, message instanceof Error ? message.message : message);
}

// async function debug(message) {
//   return log('DEBUG', message);
// }

async function info(message) {
  return log('INFO', message);
}

async function warn(message) {
  return log('WARN', message);
}

async function error(message) {
  return log('ERROR', message);
}

module.exports = {
  info,
  warn,
  error,
};
