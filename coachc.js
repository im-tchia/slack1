//var ask = "";
//var answer = "";
//var buffer = "";

//////couldn't get "require" to work yet////////////
//const require = createRequire(import.meta.url)
//require('dotenv').config()
//console.log(L3KEY);

let promptHeaderUser = "<|start_header_id|>user<|end_header_id|>";
let promptEOT = "<|eot_id|>";
let promptHeaderAsst = "<|start_header_id|>assistant<|end_header_id|>";

///// these are used to track the conversation /////
let runningPrompt = "";
let promptContext = " <|begin_of_text|><|start_header_id|>system<|end_header_id|> Your name is CODI. You are a career coach in Singapore's Info-comm Media Development Authority. You are Singaporean and use Singapore slang. You will respond to the user's query with dry wit and professionalism. Keep your reply length to 200 words or less. The reply should be complete and self-contained.<|eot_id|>";

 //old intro prompt//
  // const promptContext = "Context: Your name is CODI. You are a career coach in Singapore's Info-comm Media Development Authority. You are Singaporean and use Singapore slang. You will respond to the text after the word 'QQQuestion:' with dry wit and professionalism. Keep your reply length to 200 words or less. The reply should be complete and self-contained. Preface your reply with the characters '|reply|' only once. QQQuestion: ";

///////// This just initiates the conversation ///////
var intro1 = "Hi my name is Codi, how can I help you? <br><br><i>[<u>Note:</u> I am currently using Meta Llama 3 8B instruct via Hugging Face Inference API, so bear this in mind when sending info or data to me. My max context length is 8k tokens.]"
var intro2 = "Start you query with your name e.g. 'I am Cara and I would like to find out xxxx'. If you don't say your name, I will just call you 'Abang/Kakak' :) "

runningPrompt = runningPrompt + promptContext;
sendAns(intro1);
sendAns(intro2);

/////////////// FUNCTIONS BELOW HERE /////////////

function sendAns(text = '' ){
  document.getElementsByClassName("msg-page")[document.getElementsByClassName("msg-page").length-1].insertAdjacentHTML("beforeend",createOutChat(text));

  runningPrompt = runningPrompt + promptHeaderAsst + text + promptEOT;
}

function sendAsk(text = '') {
  
  document.getElementsByClassName("msg-page")[document.getElementsByClassName("msg-page").length-1].insertAdjacentHTML("beforeend",createInChat(text));

  if (text == "exit"){
    sendAns("goodbye!");
    return;
  }

  
  console.log("calling sendAns using <"+ text+ ">");
  runningPrompt = runningPrompt + promptHeaderUser + text + promptEOT +promptHeaderAsst;

  console.log("sending this prompt: " +runningPrompt);
  queryL3({"inputs" : runningPrompt}).then((response) => 
    {
    console.log(JSON.stringify(response));
    var rawReply = response[0].generated_text;
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
    <img src="Cara1.png" />
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
      <img src="codi.png" />
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
    console.log("queryL3 called");
    //terminal: $ npm install @dotenvx/dotenvx -g
    //need to put in terminal: npm install dotenv -- save 
   //var hfKey = HF_KEY;
   // console.log("env obtained: "+hfKey);
    var hfKey = "Bearer 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";
    const response = await fetch(
      "https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct",
      {
        headers: { 
          Authorization: hfKey,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    const result = await response.json();
    
    console.log("queryG result: " + result);
    return result;
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