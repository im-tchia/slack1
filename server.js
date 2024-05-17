// Needed for dotenv
require("dotenv").config();

const { log } = require("console");
// Needed for Express
var express = require('express');
var app = express();

const path = require('path');

// Set view engine for HTML
app.set('view engine', 'html');

// Needed for public directory
app.use(express.static(__dirname));
console.log("Dirname : " + __dirname);

// Needed for parsing form data
app.use(express.json());       
app.use(express.urlencoded({extended: true}));

app.get('/', function(req, res) {
    // res.sendFile('/index.html');
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/a', function(req, res) {
    res.sendFile(path.join(__dirname + '/Cara.png'));
});

app.get('/api', function(req, res) {
    res.sendFile(path.join(__dirname + '/Cara.png'));
});

// Tells the app which port to run on
app.listen(8080, () => {
    console.log(`Example app listening on port 8080`)
  });