//var ask = "";
//var answer = "";
//var buffer = "";

//////couldn't get "require" to work yet////////////
//const require = createRequire(import.meta.url)
//require('dotenv').config()
//console.log(L3KEY);

let promptHeaderSystem = "<|start_header_id|>system<|end_header_id|>";
let promptHeaderUser = "<|start_header_id|>user<|end_header_id|>";
let promptEOT = "<|eot_id|>";
let promptHeaderAsst = "<|start_header_id|>assistant<|end_header_id|>";

///// these are used to track the conversation /////
let runningPrompt = "";
let promptContext = " <|begin_of_text|><|start_header_id|>system<|end_header_id|> Your name is CODI. You are a career coach in Singapore's Info-comm Media Development Authority. You are Singaporean and use Singapore slang. Some slang can be found at these sites: 'https://www.timeout.com/singapore/things-to-do/common-singlish-words-you-need-to-know-to-speak-like-a-local' and 'https://mothership.sg/2014/06/17-singlish-words-that-offer-so-much-more-than-english-ones/'. You will respond to the user's query with dry wit and professionalism. Unless the user says otherwise their name is 'Abang/Kakak' which is malay for big brother/big sister. do NOT append the word 'assistant' to your responses. <|eot_id|>";

promptContext = promptContext + promptHeaderSystem + "Keep your reply length to 100 words or less. Your reply should be complete, self-contained and in complete sentences. At the end of each reply, you should state: '[XXX /8K tokens used]', where XXX is the number of tokens used so far."+ promptEOT;

promptContext = promptContext + promptHeaderSystem + "You may refer the user to speak with IMDA senior managment at this link: 'https://www.imda.gov.sg/about-imda/who-we-are/our-team/our-senior-management'"+ promptEOT;

promptContext = promptContext + promptHeaderSystem + "You can also refer to the ICT skills framework at these sites when answering questions about the types of skills required: 'https://www.skillsfuture.gov.sg/skills-framework/ict' and 'https://www.imda.gov.sg/how-we-can-help/techskills-accelerator-tesa/skills-framework-for-infocomm-technology-sfw-for-ict'"+ promptEOT;

 //old intro prompt//
  // const promptContext = "Context: Your name is CODI. You are a career coach in Singapore's Info-comm Media Development Authority. You are Singaporean and use Singapore slang. You will respond to the text after the word 'QQQuestion:' with dry wit and professionalism. Keep your reply length to 200 words or less. The reply should be complete and self-contained. Preface your reply with the characters '|reply|' only once. QQQuestion: ";

///////// This just initiates the conversation ///////
var intro1 = "Hi my name is Coach Codi, a career coach. How can I help you? <br><br><i>[<u>Note:</u> I am currently using Meta Llama 3 8B instruct via Hugging Face Inference API, so bear this in mind when sending info or data to me. My max context length is 8k tokens- you can ask me 'how many tokens']"
var intro2 = "Start you query with your name e.g. 'I am Cara and I would like to find out xxxx'. If you don't want to say your name, I will just call you 'Abang/Kakak' :) "

runningPrompt = runningPrompt + promptContext;
sendAns(intro1);
sendAns(intro2);

/// below is to enable enter key to trigger send ///

      // https://stackoverflow.com/questions/7060750/detect-the-enter-key-in-a-text-input-field

      //const messageEntry = document.getElementsByClassName("form-control");
     
const messageEntry = document.getElementById("website-input");
messageEntry.addEventListener("keypress", function(event) {
  if (event.key === "Enter"){
    console.log("enter key pressed!");
    sendAsk(document.getElementById("website-input").value);
  }
});

/////////////// FUNCTIONS BELOW HERE /////////////

function sendAns(text = '' ){
  document.getElementsByClassName("msg-page")[document.getElementsByClassName("msg-page").length-1].insertAdjacentHTML("beforeend",createOutChat(text));

  runningPrompt = runningPrompt + promptHeaderAsst + text + promptEOT;

  //scroll to bottom of .msg-page id=scrollMsgPg
  document.getElementById("scrollMsgPg").scrollTop = document.getElementById("scrollMsgPg").scrollHeight;
}

function sendAsk(text = '') {
  
  document.getElementsByClassName("msg-page")[document.getElementsByClassName("msg-page").length-1].insertAdjacentHTML("beforeend",createInChat(text));

    //scroll to bottom of .msg-page id=scrollMsgPg
    document.getElementById("scrollMsgPg").scrollTop = document.getElementById("scrollMsgPg").scrollHeight;


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
   //var hfKey = HF_L3_KEY;
   // console.log("env obtained: "+hfKey);
<<<<<<< HEAD
   
   //var hfKey = "Bearer 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";
   var hfKey = process.env(HF_L3_KEY); 
=======

   //HF_L3_KEY as this in the env file
   
   var hfKey = "Bearer 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";
  //  var hfKey = process.env(L3KEY); 
>>>>>>> 3f5081e2b6f4b424bf5cad614241acfa1391c11b
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
