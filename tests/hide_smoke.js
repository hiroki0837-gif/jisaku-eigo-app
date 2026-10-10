const {JSDOM}=require("jsdom");const fs=require("fs");
const dom=new JSDOM("<!doctype html><body>"+fs.readFileSync(require("path").join(__dirname,"../app/index.html"),"utf8")+"</body>",{runScripts:"dangerously",pretendToBeVisual:true});
const w=dom.window,d=w.document;w.scrollTo=()=>{};const errs=[];w.addEventListener("error",e=>errs.push(e.message));
const click=el=>el.dispatchEvent(new w.MouseEvent("click",{bubbles:true}));const q=s=>{const e=d.querySelector(s);if(!e)throw new Error("missing "+s);return e};
const word=()=>(d.querySelector(".tcard .tw")||d.querySelector(".jp")).textContent, cnt=()=>q(".meta span:last-child").textContent;
setTimeout(()=>{try{
 click(q('[data-tab="toeic"]'));click(q('[data-act="tdeck"][data-v="toeic"]'));
 click(q('[data-act="hidetoggle"]'));console.log("hide on",q('[data-act="hidetoggle"]').getAttribute("aria-checked"),word(),cnt());
 const w1=word();
 click(q('[data-act="topen"]'));click(q('.tcard [data-act="xopen"]'));click(q('[data-act="xo"]'));click(q('[data-act="to"]'));
 console.log("advanced to:",word(),cnt());
 console.log("bar:",[...d.querySelectorAll(".hidebar span")].map(x=>x.textContent).join(" / "));
 // miss count
 click(q('[data-act="topen"]'));click(q('[data-act="tx"]'));click(q('[data-act="topen"]'));click(q('[data-act="tx"]'));
 console.log("miss tag:",[...d.querySelectorAll(".tcard .mark")].map(x=>x.textContent).join(" | "));
 click(q('[data-act="tset"][data-k="mode"][data-v="miss"]'));console.log("miss mode:",word(),cnt(),[...d.querySelectorAll(".tcard .mark")].map(x=>x.textContent).join(" | "));
 const t0=Date.now();click(q('[data-act="tdeck"][data-v="mix"]'));click(q('[data-act="tset"][data-k="dir"][data-v="je"]'));console.log("mix je render ms",Date.now()-t0, d.querySelectorAll(".rung,.tcard").length);
}catch(e){errs.push(e.stack)}console.log("errors",errs);process.exit(0)},300);
