const {JSDOM}=require("jsdom");const fs=require("fs");
const dom=new JSDOM("<!doctype html><body>"+fs.readFileSync(require("path").join(__dirname,"../app/index.html"),"utf8")+"</body>",{runScripts:"dangerously",pretendToBeVisual:true});
const w=dom.window,d=w.document;w.scrollTo=()=>{};const errs=[];w.addEventListener("error",e=>errs.push(e.message));
const click=el=>el.dispatchEvent(new w.MouseEvent("click",{bubbles:true}));const q=s=>d.querySelector(s);
const bar=()=>[...d.querySelectorAll(".hidebar span")].map(x=>x.textContent).join("/");
setTimeout(()=>{
 click(q('[data-tab="pos"]'));click(q('[data-act="hidetoggle"]'));const jp=q(".concept .jp").textContent;
 click(q('[data-act="uall"]'));console.log("so buttons",d.querySelectorAll('[data-act="so"]').length);
 const ks=[...d.querySelectorAll('[data-act="so"]')].map(b=>b.dataset.k);ks.forEach(k=>click(q('[data-act="so"][data-k="'+k+'"]')));
 console.log("rec",Object.keys(w.eval("S.rec")).length,"same card",q(".concept .jp").textContent===jp,bar());
 click(q('[data-act="tdb"][data-v="w"]'));console.log("word-mode:",bar(),q(".concept .jp").textContent===jp);
 click(q('[data-act="unext"]'));click(q('[data-act="uprev"]'));console.log("after next/prev hidden?",q(".concept .jp").textContent!==jp,bar());
 click(q('[data-act="tdb"][data-v="b"]'));console.log("both:",bar());
 console.log(errs);process.exit(0)},300);
