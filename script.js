const logBox=document.getElementById("log");

function log(msg){
if(!logBox)return;
logBox.innerHTML+=msg+"<br>";
logBox.scrollTop=logBox.scrollHeight;
}

async function send(){
const input=document.getElementById("msg");
if(!input)return;
const msg=input.value;
log("> "+msg);

try{
const res=await fetch("http://localhost:3000/api/agent",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({input:msg})
});
const data=await res.json();
log("AI: "+data.response);
alert(data.response);
}catch(e){
log("connection error");
}
}

async function route(mode){
log("route "+mode);

try{
const res=await fetch("http://localhost:3000/api/agent",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({input:mode})
});
const data=await res.json();
log("AI: "+data.response);
alert(data.response);
}catch(e){
log("route fallback "+mode);
}
}

function voiceInput(){
const Speech=window.SpeechRecognition||window.webkitSpeechRecognition;
if(!Speech)return;
const rec=new Speech();
rec.onresult=(e)=>{
document.getElementById("msg").value=e.results[0][0].transcript;
send();
};
rec.start();
}

document.addEventListener("click",(e)=>{
if(e.target.closest(".node")){
const audio=new Audio("https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg");
audio.play();
}
});

function captureEmail(){
const email=document.getElementById("emailCapture");
if(!email||!email.value)return;
localStorage.setItem("email",email.value);
log("email saved");
alert("saved");
}

function captureExitEmail(){
const email=document.getElementById("exitEmail");
if(!email||!email.value)return;
localStorage.setItem("exitEmail",email.value);
log("exit email saved");
alert("saved");
document.getElementById("exit-popup").style.display="none";
}

document.addEventListener("mouseleave",(e)=>{
if(e.clientY<10){
const p=document.getElementById("exit-popup");
if(p)p.style.display="block";
}
});

(function init(){
localStorage.setItem("session",Date.now());
log("session started");
})();

(function domain(){
const host=window.location.hostname;
log("host "+host);

if(host.includes(".store")){
const p=document.getElementById("monetize-panel");
if(p)p.style.display="block";
}

if(host.includes(".online")){
setTimeout(()=>{
const e=document.getElementById("emailCapture");
if(e)e.focus();
},1000);
}
})();