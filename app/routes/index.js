const dbRoutes = require('./db_routes.js');

module.exports = function(app, db){
    dbRoutes(app,db);
}