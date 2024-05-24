// Needed for dotenv
require("dotenv").config();

const { log } = require("console");
// Needed for Express
var express = require('express');
var app = express();

//to receive POSTS
const bodyParser = require('body-parser');
// Middleware to parse JSON bodies
app.use(bodyParser.json());


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

app.post('/HF', async function(req, res){
    // 
    const data = req.body;
    console.log("backend - data = "+data);
    console.log("backend - data - string = "+JSON.stringify(data));
    

    // // to check whether it got the correct key from env
    // //console.log("KEY = " +process.env.HF_L3_KEY);
    // const response1 = await fetch(
    //     "https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct",
    //     {
    //       headers: { 
    //         Authorization: process.env.HF_L3_KEY,
    //         "Content-Type": "application/json",
    //       },
    //       method: "POST",
    //       body: JSON.stringify(data),
    //     }
    //   );
    //   const result1 = await response1.json();

    const result1 = await queryL3B(data);
    console.log("backend - result1 = " + result1);
      console.log("backend - result1 string = " + JSON.stringify(result1));
      //console.log("queryL3 result: " + result);
      //return result1;
      res.send(result1);
      return result1;
});

app.get('/api', function(req, res) {
    res.sendFile(path.join(__dirname + '/Cara.png'));
});

// Tells the app which port to run on
app.listen(8080, () => {
    console.log(`Example app listening on port 8080`)
  });



  ///function for pulling HF

  async function queryL3B(data) {
	console.log("backend - queryL3B called inside.");

    const response = await fetch(
		"https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct",
        {
          headers: { 
      //      Authorization: hfKey,
            Authorization: process.env.HF_L3_KEY,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(data),
        }
	);
	const result = await response.json();
	console.log("backend - queryL3B result = "+JSON.stringify(result));
    return result;
    }