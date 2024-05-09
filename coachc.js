var ask = "";
var answer = "";
var buffer = "";

//alert("hi my name is codi!");

//ask = prompt("what wld you like to ask CODI?");
//sendAsk(ask);

//queryH({inputs:{question:"What is my name?",context:"My name is Clara and I live in Berkeley."}}).then((response) => {
//  console.log(JSON.stringify(response))});


//answer = queryH({inputs:{question:ask,context:""}}).then((response) => {
//  console.log(JSON.stringify(response))});

queryH({inputs:{question:"What is my name?",context:"My name is Clara and I live in Berkeley."}}).then((response) => {
  console.log(JSON.stringify(response));
});
//answer = queryH({"who are you?",""});

document.getElementsByClassName("msg-page")[document.getElementsByClassName("msg-page").length-1].insertAdjacentHTML("beforeend",createOutChat(answer));

//document.getElementById("lastMsg").insertAdjacentHTML("afterend",createOutChat(prompt("say something!")))

//// document.getElementById("lastMsg").appendChild(createOutChat(prompt("say something!")))

function sendAsk(text = '') {
  document.getElementsByClassName("msg-page")[document.getElementsByClassName("msg-page").length-1].insertAdjacentHTML("beforeend",createInChat(text));
var textr = "noted."
  document.getElementsByClassName("msg-page")[document.getElementsByClassName("msg-page").length-1].insertAdjacentHTML("beforeend",createOutChat(textr));


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


  async function queryH(data) {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct",
      {
        headers: { 
          "Content-Type" : "application/json",
          Authorization: "xxxxxxxx" },
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    const result = await response.json();
    return result;
    //return JSON.stringify(result);

   // query({"inputs": "Can you please let us know more details about your "}).then((response) => {console.log(JSON.stringify(response));
  }
