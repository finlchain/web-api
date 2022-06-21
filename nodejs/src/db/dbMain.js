//
const dbNN = require('./../db/dbNN.js');

//
module.exports.initDatabase = async () => {
    await dbNN.initDatabaseNN();
}