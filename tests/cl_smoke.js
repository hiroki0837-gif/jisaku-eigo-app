const {JSDOM}=require("jsdom");const fs=require("fs");
const dom=new JSDOM("<!doctype html><body>"+fs.readFileSync(require("path").join(__dirname,"../app/index.html"),"utf8")+"</body>",{runScripts:"dangerously",pretendToBeVisual:true});
const w=dom.window,d=w.document;w.scrollTo=()=>{};const errs=[];w.addEventListener("error",e=>errs.push(e.message));
const click=el=>el.dispatchEvent(new w.MouseEvent("click",{bubbles:true}));const q=s=>{const e=d.querySelector(s);if(!e)throw new Error("missing "+s);return e};
const title=()=>(d.querySelector(".concept .jp")||d.querySelector(".tcard .tja")).textContent,cnt=()=>[...d.querySelectorAll(".meta span")].map(x=>x.textContent).join("|");
setTimeout(()=>{try{
 click(q('[data-tab="toeic"]'));click(q('[data-act="tdeck"][data-v="toeic"]'));click(q('[data-act="tset"][data-k="dir"][data-v="je"]'));click(q('[data-act="tset"][data-k="set"][data-v="all"]'));
 click(q('[data-act="hidetoggle"]'));click(q('[data-act="tdb"][data-v="w"]'));
 // find first cluster
 let guard=0;while(!d.querySelector('[data-act="callopen"]')&&guard++<50)click(q('[data-act="tnext"]'));
 const t1=title();console.log("cluster:",t1,cnt());
 click(q('[data-act="callopen"]'));let n=d.querySelectorAll('[data-act="co"]').length;
 for(let i=0;i<n-1;i++)click(d.querySelectorAll('[data-act="co"]')[i]);
 console.log("partial still there:",title()===t1);
 click(d.querySelectorAll('[data-act="co"]')[n-1]);console.log("all ok marks:",[...d.querySelectorAll(".rung .mark")].map(x=>x.textContent).join(","));
 click(q('[data-act="tnext"]'));click(q('[data-act="tprev"]'));console.log("after next/prev:",title(),"(was",t1+")", cnt(),[...d.querySelectorAll(".hidebar span")].map(x=>x.textContent).join("/"));
}catch(e){errs.push(e.stack)}console.log("errors",errs);process.exit(0)},300);
