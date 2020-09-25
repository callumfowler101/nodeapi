const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const database = './data.json';

const port = 8000;

app.listen(port, ()=>{
    console.log("we are listening on port: " + port); 
});