const fs = require('fs');
require('date-utils');

const writeError = (data) => {
    fs.appendFileSync('error.txt', data, 'utf8');
}

module.exports.catchException = () => {
    process.stderr.write = function(str, encoding, fg) {
        writeError(str);
    }
}

module.exports.errorLogging = (err) => {
    let date = new Date().toFormat('YYYY-MM-DD HH24:MI:SS');
    let data = `[ERROR] [${date}] error message\n`;
    data += `[ERROR] [${date}] ${err.message}\n`;
    data += `[ERROR] [${date}] stack trace\n`;
    data += `[ERROR] [${date}] ${err.stack}\n`;

    writeError(data);
}

module.exports.unhandledRejection = (reason, promise) => {
    let date = new Date().toFormat('YYYY-MM-DD HH24:MI:SS');
    let data = `[ERROR] [${date}] process unhandledRejection occur\n`;
    data += `[ERROR] [${date}] reason\n`;
    data += `[ERROR] [${date}] ${reason.toString()}\n`;
    data += `[ERROR] [${date}] promise\n`;
    data += `[ERROR] [${date}] ${JSON.stringify(promise)}\n`;

    writeError(data);
}

module.exports.uncaughtException = (err, origin) => {
    let date = new Date().toFormat('YYYY-MM-DD HH24:MI:SS');
    let data = `[ERROR] [${date}] process uncaughtException occur\n`;
    data += `[ERROR] [${date}] error\n`;
    data += `[ERROR] [${date}] ${err.toString()}\n`;
    data += `[ERROR] [${date}] origin\n`;
    // data += `[ERROR] [${date}] ${origin.toString()}\n`;

    writeError(data);
}