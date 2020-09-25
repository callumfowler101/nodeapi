const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const database = require('./data.json');

const port = 8000;

app.use(bodyParser.urlencoded({extended: true}));

require("./app/routes")(app, database);

app.listen(port, ()=>{
    console.log("we are listening on port: " + port); 
});