//var ask = "";
//var answer = "";
//var buffer = "";

//const { response } = require("express");

//const { configDotenv } = require("dotenv");
//const { response } = require("express");

//////couldn't get "require" to work yet////////////
//const require = createRequire(import.meta.url)
//require('dotenv').config()
//console.log(L3KEY);
// global variable to indicate when to close session
let closeSession = false;

let promptHeaderSystem = "<|start_header_id|>system<|end_header_id|>";
let promptHeaderUser = "<|start_header_id|>user<|end_header_id|>";
let promptEOT = "<|eot_id|>";
let promptHeaderAsst = "<|start_header_id|>assistant<|end_header_id|>";

///// these are used to track the conversation /////
let runningPrompt = "";
let promptContext =
  " <|begin_of_text|><|start_header_id|>system<|end_header_id|> Your name is CODI. You are a volunteer career coach in Singapore. You are familiar with the Singapore Infocomm Media Development Authority (IMDA), But you do not speak for or represent IMDA since you are a volunteer. You are Singaporean and use Singapore slang. Some slang can be found at these sites: 'https://www.timeout.com/singapore/things-to-do/common-singlish-words-you-need-to-know-to-speak-like-a-local' and 'https://mothership.sg/2014/06/17-singlish-words-that-offer-so-much-more-than-english-ones/'. You will respond to the user's query with dry wit and professionalism. <|eot_id|>";

promptContext =
  promptContext +
  promptHeaderSystem +
  "Unless the user says otherwise call them 'Abang/Kakak' which is Malay for 'big brother/big sister'. You will NOT append the word 'assistant' to your responses. If the user says their name, use it to preface your responses consistently henceforth. Keep your reply length to 100 words or less. Your reply should be complete, self-contained and in complete sentences. if you are asked, at the end of each reply, you should state: '[XXX /8K tokens used]', where XXX is the number of tokens used so far, and 8K is short for 8,000" +
  promptEOT;

promptContext =
  promptContext +
  promptHeaderSystem +
  "You will use the GROW coaching framework to guide your converstion. GROW stands for Goal, Reality, Options, Way Forward. You will use GROW to structure your questions and discussion with the user. Once you have reached a satisfactory 'Way Forward', you can conclude the session. Some references for GROW include 'https://wp.nyu.edu/coaching/tools/grow-model/' and 'https://en.wikipedia.org/wiki/GROW_model'. If the user wishes to speak to a physical person, you may refer the user to speak with IMDA senior managment at this link: 'https://www.imda.gov.sg/about-imda/who-we-are/our-team/our-senior-management'" +
  promptEOT;

promptContext =
  promptContext +
  promptHeaderSystem +
  "You will NOT append the word 'assistant' to your responses. You can also refer to the ICT skills framework at these sites when answering questions about the types of skills required: 'https://www.skillsfuture.gov.sg/skills-framework/ict' and 'https://www.imda.gov.sg/how-we-can-help/techskills-accelerator-tesa/skills-framework-for-infocomm-technology-sfw-for-ict'" +
  promptEOT;

let disclaimer1 = "Note: I am an experimental chatbot, using Meta Llama 3 8B instruct via Hugging Face Inference API. Bear this in mind when sending info or data to me. My responses may or may not be correct, though I hope they are useful, or at least entertaining. My max context length is 8k tokens- you can ask me 'how many tokens'\n\n <br><br>" 

let disclaimer2 = "Disclaimer: This web app is created for learning purposes only. The information provided here should not be considered professional advice. Please note that we make no guarantees regarding the accuracy, completeness, or reliability of the contents of this website. Any actions you take based on the contents of this website are at your own risk. We are not liable for any losses or damages incurred from the use of this website.<br>";

 //old intro prompt//
  // const promptContext = "Context: Your name is CODI. You are a career coach in Singapore's Info-comm Media Development Authority. You are Singaporean and use Singapore slang. You will respond to the text after the word 'QQQuestion:' with dry wit and professionalism. Keep your reply length to 200 words or less. The reply should be complete and self-contained. Preface your reply with the characters '|reply|' only once. QQQuestion: ";

///////// This just initiates the conversation ///////
var intro1 = "Hi my name is Coach Codi, a career coach. How can I help you?";
var intro2 = "Start you query with your name e.g. 'I am Cara and I would like to find out xxxx'. If you don't want to say your name, I will just call you 'Abang/Kakak' :).<br> Type 'bye' or 'exit' at any time to close this session. ";

runningPrompt = runningPrompt + promptContext;

//adds the two intros to the starting prompt
runningPrompt =
  runningPrompt +
  promptHeaderAsst +
  disclaimer1 + disclaimer2 +
  promptEOT +
  promptHeaderAsst +
  intro1 +
  promptEOT +
  promptHeaderAsst +
  intro2 +
  promptEOT;

sendAns(disclaimer1);
sendAns(disclaimer2);
sendAns(intro1);
sendAns(intro2);

/// below is to enable enter key to trigger send ///

      // https://stackoverflow.com/questions/7060750/detect-the-enter-key-in-a-text-input-field

      //const messageEntry = document.getElementsByClassName("form-control");
     
const messageEntry = document.getElementById("website-input");

messageEntry.addEventListener("keypress", function(event) {
  if (event.key === "Enter" && !closeSession){
    console.log("enter key pressed!");
    sendAsk(document.getElementById("website-input").value);
  }
});

const buttonEntry = document.getElementById("sendButton");
buttonEntry.addEventListener("click", function(){
    if (!closeSession) {
      sendAsk(document.getElementById("website-input").value);
    } 

}); 

/////////////// FUNCTIONS BELOW HERE /////////////

function sendAns(text = '' ){
  document.getElementsByClassName("msg-page")[document.getElementsByClassName("msg-page").length-1].insertAdjacentHTML("beforeend",createInChat(text));

  runningPrompt = runningPrompt + promptHeaderAsst + text + promptEOT;

  //scroll to bottom of .msg-page id=scrollMsgPg
  document.getElementById("scrollMsgPg").scrollTop = document.getElementById("scrollMsgPg").scrollHeight;
}

function sendAsk(text = '') {
  console.log("ask = "+ text);
  document.getElementsByClassName("msg-page")[document.getElementsByClassName("msg-page").length-1].insertAdjacentHTML("beforeend",createOutChat(text));

    //scroll to bottom of .msg-page id=scrollMsgPg
    document.getElementById("scrollMsgPg").scrollTop = document.getElementById("scrollMsgPg").scrollHeight;


  if (text.toLowerCase() == "exit" || text.toLowerCase() == "bye"){
    closeSession = true;
    sendAns("goodbye! pls refresh the browser to start a new session");
    return;
  }

  
  console.log("calling sendAns using <"+ text+ ">");
  runningPrompt = runningPrompt + promptHeaderUser + text + promptEOT +promptHeaderAsst;

  console.log("sending this prompt: " +runningPrompt);
  queryL3({"inputs" : runningPrompt}).then((response) => 
    {
    console.log("response = " + JSON.stringify(response));
    var rawReply = response[0].generated_text;
    console.log("answer = "+rawReply.split(runningPrompt)[1]);
    sendAns(rawReply.split(runningPrompt)[1]);
    //sendAns(response[0].generated_text.split("|reply|")[2])
    //sendAns(response[0].generated_text.substring(len(text),len(response[0].generated_text)));
    document.getElementById("website-input").value= "";
    }
    
  )

  // sendAns(answer);
  //var textr = "noted."
//  document.getElementsByClassName("msg-page")[document.getElementsByClassName("msg-page").length-1].insertAdjacentHTML("beforeend",createOutChat(textr));
}


function createInChat(text = '') {
  var event = new Date();
  var eDate = Date.toString()
  //var eTime = Date.toTimeString();
  var timestamp = event;
  //var timestamp = eTime + " | " + eDate;

  return`
  <div class="received-chats">
  <div class="recevied-chats-img">
    <img src="codi.png" />
  </div>
  <div class="received-msg">
    <div class="received-msg-inbox">
      <p>
      ${text}
      </p>

      <span class="time">
      ${timestamp}
      </span>
    </div>
  </div>
</div>
  `;
};

function createOutChat(text = '') {
  var event = new Date();
  var timestamp = event  
  return`
    <div class="outgoing-chats">
    <div class="outgoing-chats-img">
      <img src="Cara1.png" />
    </div>
    <div class="outgoing-msg">
      <div class="outgoing-chats-msg">
        <p>
        ${text}
        </p>

        <span class="time">${timestamp}</span>
      </div>
    </div>
  </div>
    `;


    //extracted: <span class="time">18:34 PM | July 24</span>
  };


  async function queryL3(data) {
    console.log("Frontend -queryL3 called");
    console.log("Frontend - passing this data: " + JSON.stringify(data));
    //terminal: $ npm install @dotenvx/dotenvx -g
    //need to put in terminal: npm install dotenv -- save 
   //var hfKey = HF_L3_KEY;
   // console.log("env obtained: "+hfKey);
   
   //var hfKey = process.env(HF_L3_KEY); 
    //response = await fetch("https://opulent-potato-7v76v6gvww7q2775-8080.app.github.dev/HF")
   response = await fetch('/HF/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
    });
    //response = await fetch("https://coach-codi.org/HF")

    const responseJ = await response.json();
   console.log("Frontend-L3 response stringified = "+ JSON.stringify(responseJ));
   
   //remember to return the json from the response
   return responseJ;
   
  //  const response = await fetch(
  //     "https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct",
  //     {
  //       headers: { 
  //         Authorization: hfKey,
  //         "Content-Type": "application/json",
  //       },
  //       method: "POST",
  //       body: JSON.stringify(data),
  //     }
  //   );
  //   const result = await response.json();
    
  //   //console.log("queryL3 result: " + result);
  //   return result;
  }
 
  
  async function queryP3(data) {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/microsoft/Phi-3-mini-128k-instruct",
      {
        headers: { Authorization: "" },
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    const result = await response.json();
    return result;
  }
  
//import fetch from "node-fetch";
async function queryRBS2(data) {
    const response = await fetch(
        "https://api-inference.huggingface.co/models/deepset/roberta-base-squad2",
        {
            headers: { Authorization: `Bearer ${API_TOKEN}` },
            method: "POST",
            body: JSON.stringify(data),
        }
    );
    const result = await response.json();
    return result;
}
//query({inputs:{question:"What is my name?",context:"My name is Clara and I live in Berkeley."}}).then((response) => {
//    console.log(JSON.stringify(response));
//});
