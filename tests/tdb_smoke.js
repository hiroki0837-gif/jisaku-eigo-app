const {JSDOM}=require("jsdom");const fs=require("fs");
const dom=new JSDOM("<!doctype html><body>"+fs.readFileSync(require("path").join(__dirname,"../app/index.html"),"utf8")+"</body>",{runScripts:"dangerously",pretendToBeVisual:true});
const w=dom.window,d=w.document;w.scrollTo=()=>{};const errs=[];w.addEventListener("error",e=>errs.push(e.message));
const click=el=>el.dispatchEvent(new w.MouseEvent("click",{bubbles:true}));const q=s=>{const e=d.querySelector(s);if(!e)throw new Error("missing "+s);return e};
const word=()=>d.querySelector(".tcard .tw").textContent,cnt=()=>q(".meta span:last-child").textContent;
setTimeout(()=>{try{
 click(q('[data-tab="toeic"]'));click(q('[data-act="tdeck"][data-v="toeic"]'));click(q('[data-act="hidetoggle"]'));
 console.log("chips:",[...d.querySelectorAll('[data-act="tdb"]')].map(b=>b.textContent+":"+b.getAttribute("aria-pressed")).join(" "));
 click(q('[data-act="topen"]'));click(q('[data-act="to"]'));console.log("both-mode after word○ only:",word(),cnt());
 click(q('[data-act="tdb"][data-v="w"]'));console.log("word-mode:",word(),cnt(),q(".hidebar span").textContent);
 click(q('[data-act="tdb"][data-v="b"]'));console.log("back both:",word(),cnt());
}catch(e){errs.push(e.stack)}console.log("errors",errs);process.exit(0)},300);
