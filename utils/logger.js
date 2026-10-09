const fs = require('fs');
const path = require('path');
const util = require('util');

const LOG_LEVELS = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3
};

const COLORS = {
    DEBUG: '\x1b[90m',
    INFO: '\x1b[32m',
    WARN: '\x1b[33m',
    ERROR: '\x1b[31m',
    RESET: '\x1b[0m',
    TIME: '\x1b[36m'
};

const MIN_LEVEL = LOG_LEVELS[
    (process.env.LOG_LEVEL || 'INFO').toUpperCase()
] ?? LOG_LEVELS.INFO;

const FILE_ENABLED = process.env.LOG_TO_FILE === 'true';
const LOG_FILE = path.resolve(
    process.env.LOG_FILE || 'logs/api.log'
);

function formatMessage(value) {
    if (typeof value === 'string') {
        return value;
    }

    if (value instanceof Error) {
        return value.stack || value.message;
    }

    return util.inspect(value, {
        depth: 5,
        colors: false,
        compact: true
    });
}

function writeLog(level, ...args) {
    if (LOG_LEVELS[level] < MIN_LEVEL) {
        return;
    }

    const timestamp = new Date().toISOString();
    const message = args.map(formatMessage).join(' ');
    const plainLine = `[${timestamp}] [${level}] ${message}`;
    const color = COLORS[level];

    if (process.stdout.isTTY) {
        const output = `${COLORS.TIME}[${timestamp}]${COLORS.RESET} ${color}[${level}]${COLORS.RESET} ${message}`;
        const stream = level === 'ERROR' || level === 'WARN'
            ? process.stderr
            : process.stdout;

        stream.write(`${output}\n`);
    } else {
        const stream = level === 'ERROR' || level === 'WARN'
            ? process.stderr
            : process.stdout;

        stream.write(`${plainLine}\n`);
    }

    if (FILE_ENABLED) {
        try {
            fs.mkdirSync(path.dirname(LOG_FILE), {
                recursive: true
            });

            fs.appendFileSync(LOG_FILE, `${plainLine}\n`, 'utf8');
        } catch (error) {
            process.stderr.write(
                `[LOGGER ERROR] ${error.message}\n`
            );
        }
    }
}

module.exports = {
    debug: (...args) => writeLog('[DEBUG]', ...args),
    info: (...args) => writeLog('[INFO]', ...args),
    warn: (...args) => writeLog('[WARN]', ...args),
    error: (...args) => writeLog('[ERROR]', ...args)
};