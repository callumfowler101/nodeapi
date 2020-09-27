// This application queries a database and returns information back to the user
// via JSON.

// external node modules are initialised to be used.
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

// the main app is an express.js app
const app = express();

const database = JSON.parse(fs.readFileSync('./data.json'));

const port = 8000;

// the app uses body-parser to interpret x-www-form-urlencoded forms.
app.use(bodyParser.urlencoded({extended: true}));

// this links the app to the GET/POST routes.
require("./app/routes")(app, database);

app.listen(port, ()=>{
    console.log("running on port: " + port); 
});