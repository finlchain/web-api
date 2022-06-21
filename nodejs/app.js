//
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');

//
const indexRouter = require("./routes/indexRouter");
//
const dataAccountRouter = require("./routes/dataAccountRouter");
const dataBlkRouter = require("./routes/dataBlkRouter");
const dataFbRouter = require("./routes/dataFbRouter");
const dataScRouter = require("./routes/dataScRouter");
//
const ctrlKafkaRouter = require("./routes/ctrlKafkaRouter");
const ctrlNetRouter = require("./routes/ctrlNetRouter");
//
const cliContractRouter = require("./routes/cliContractRouter");
const cliWalletRouter = require("./routes/cliWalletRouter");
//
const nodeRouter = require("./routes/nodeRouter");

//
const dbMain = require('./src/db/dbMain.js');
const dbUtil = require('./src/db/dbUtil.js');

//
const cryptoUtil = require('./src/sec/cryptoUtil.js');

//
const debug = require('./src/utils/debug.js');

//
const init = async () => {
    // cryptoUtil.setIsPubkey();
    await dbMain.initDatabase();

    debug.catchException();
    process.on('unhandledRejection', debug.unhandledRejection);
    process.on('uncaughtException', debug.uncaughtException);
}

init();

// for cross domain (BE)
const allowCORS = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    (req.mothoed === 'OPTIONS') ?
        res.send(200) :
        next();
};

////////////////////////////////////////////////////////////////
//
const app = express();

app.use(helmet()); // application security

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(express.json({ limit : "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(allowCORS);

// check the existence of api key
// app.use(function (req, res, next) {
//     if (!req.headers['puri-api-key']) {
//         res.status(401).json({ error: 'unauthorized' });
//     }
//     else {
//         console.log("req.headers['puri-api-key'] : " + req.headers['puri-api-key']);
//         console.log("req.get('puri-api-key') : " + req.get('puri-api-key'));
//         next();
//     }
// });

app.use('/', indexRouter);
//
app.use('/account', dataAccountRouter);
app.use('/block', dataBlkRouter);
app.use('/fb', dataFbRouter);
app.use('/sc', dataScRouter);
//
app.use('/kafka', ctrlKafkaRouter);
app.use('/net', ctrlNetRouter);
//
app.use('/contract', cliContractRouter);
app.use('/wallet', cliWalletRouter);
//
app.use('/node', nodeRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
