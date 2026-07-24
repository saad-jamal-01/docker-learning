const fs = require('fs');
const path = require('path');
const util = require('util');
const EventEmitter = require('events');

class Logger extends EventEmitter {
  constructor(options = {}) {
    super();

    this.logDir =
      process.env.LOG_DIR ||
      options.logDir ||
      path.resolve(__dirname, '../../../logs/backend');
    this.logLevel = options.level || 'info';

    this.levels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3,
    };

    this.colors = {
      error: '\x1b[31m',
      warn: '\x1b[33m',
      info: '\x1b[36m',
      debug: '\x1b[90m',
      reset: '\x1b[0m',
    };

    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }

    this.streams = {
      error: fs.createWriteStream(path.join(this.logDir, 'error.log'), {
        flags: 'a',
      }),
      combined: fs.createWriteStream(path.join(this.logDir, 'combined.log'), {
        flags: 'a',
      }),
    };

    Object.values(this.streams).forEach((stream) => {
      stream.on('error', (err) => console.error('Logger stream error:', err));
    });
  }

  formatMessage(level, message, ...args) {
    const timestamp = new Date().toISOString();

    const formattedArgs = args.length > 0 ? ` ${util.format(...args)}` : '';
    const rawMessage =
      typeof message === 'object' ? util.inspect(message) : message;

    return `[${timestamp}] [${level.toUpperCase()}]: ${rawMessage}${formattedArgs}`;
  }

  log(level, message, ...args) {
    if (this.levels[level] > this.levels[this.logLevel]) {
      return;
    }

    const formattedLog = this.formatMessage(level, message, ...args);
    const color = this.colors[level] || this.colors.reset;

    this.streams.combined.write(`${formattedLog}\n`);

    if (level === 'error') {
      this.streams.error.write(`${formattedLog}\n`);
    }

    this.emit('log', { level, message: formattedLog, timestamp: new Date() });
  }

  error(message, ...args) {
    this.log('error', message, ...args);
  }

  warn(message, ...args) {
    this.log('warn', message, ...args);
  }

  info(message, ...args) {
    this.log('info', message, ...args);
  }

  debug(message, ...args) {
    this.log('debug', message, ...args);
  }

  httpMiddleware() {
    return (req, res, next) => {
      const start = Date.now();

      res.on('finish', () => {
        const duration = Date.now() - start;
        const msg = `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`;

        if (res.statusCode >= 500) {
          this.error(msg);
        } else if (res.statusCode >= 400) {
          this.warn(msg);
        } else {
          this.info(msg);
        }
      });

      next();
    };
  }

  handleUncaughtExceptions() {
    process.on('uncaughtException', (error) => {
      this.error('FATAL: Uncaught Exception thrown!', error.stack || error);
      this.closeAndExit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
      const message =
        reason instanceof Error ? reason.stack : util.inspect(reason);
      this.error(
        'WARNING: Unhandled Promise Rejection at:',
        promise,
        'reason:',
        message
      );
    });
  }

  closeAndExit(code = 1) {
    let closedStreams = 0;
    const totalStreams = Object.keys(this.streams).length;

    Object.values(this.streams).forEach((stream) => {
      stream.end(() => {
        closedStreams++;
        if (closedStreams === totalStreams) {
          process.exit(code);
        }
      });
    });

    setTimeout(() => process.exit(code), 2000).unref();
  }

  close() {
    Object.values(this.streams).forEach((stream) => stream.end());
  }
}

module.exports = new Logger();
