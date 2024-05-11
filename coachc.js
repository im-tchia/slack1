var ask = "";
var answer = "";
var buffer = "";

const promptContext = "";

sendAns("Hi my name is Codi, how can I help you? <br><br><i>[<u>Note:</u> I am currently using Meta Llama 3 8B instruct via Hugging Face Inference API, so bear this in mind when sending info or data to me]");

// test code below which worked-----
//queryG({"inputs": "Can you please let us know more details about Singapore"}).then((response) => {
//	console.log(JSON.stringify(response));
//});
//-------------------


function sendAsk(text = '') {
  
  document.getElementsByClassName("msg-page")[document.getElementsByClassName("msg-page").length-1].insertAdjacentHTML("beforeend",createInChat(text));

  console.log("calling sendAns using <"+ text+ ">");
  
  queryL3({"inputs" : text}).then((response) => 
    {
    console.log(JSON.stringify(response))
    sendAns(response[0].generated_text)
    }
  )

  // sendAns(answer);
  //var textr = "noted."
//  document.getElementsByClassName("msg-page")[document.getElementsByClassName("msg-page").length-1].insertAdjacentHTML("beforeend",createOutChat(textr));


}
function sendAns(text = ''){
  document.getElementsByClassName("msg-page")[document.getElementsByClassName("msg-page").length-1].insertAdjacentHTML("beforeend",createOutChat(text));

}


function createInChat(text = '') {
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

      <span class="time">18:34 PM | July 24</span>
    </div>
  </div>
</div>
  `;
};

function createOutChat(text = '') {
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

        <span class="time">18:34 PM | July 24</span>
      </div>
    </div>
  </div>
    `;
  };


  async function queryL3(data) {
    console.log("queryG called");
    const response = await fetch(
      "https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct",
      {
        headers: { 
          Authorization: "Bearer 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",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    const result = await response.json();
    
    console.log("quesryG result: " + result);
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