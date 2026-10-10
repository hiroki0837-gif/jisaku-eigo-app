const {JSDOM}=require("jsdom");const fs=require("fs");
const dom=new JSDOM("<!doctype html><body>"+fs.readFileSync(require("path").join(__dirname,"../app/index.html"),"utf8")+"</body>",{runScripts:"dangerously",pretendToBeVisual:true});
const w=dom.window,d=w.document;w.scrollTo=()=>{};const errs=[];w.addEventListener("error",e=>errs.push(e.message));
const click=el=>el.dispatchEvent(new w.MouseEvent("click",{bubbles:true}));const q=s=>{const e=d.querySelector(s);if(!e)throw new Error("missing "+s);return e};
setTimeout(()=>{try{
 console.log("theme attr:",d.documentElement.dataset.theme);
 click(q('[data-tab="toeic"]'));click(q('[data-act="topen"]'));click(q('[data-act="tx"]'));click(q('[data-act="topen"]'));click(q('[data-act="to"]'));
 click(q('[data-tab="stats"]'));const t0=Date.now();click(q('[data-act="sv"][data-v="sum"]'));console.log("sum ms",Date.now()-t0);
 console.log([...d.querySelectorAll(".sblk")].map(b=>b.querySelector(".shd").textContent+" | "+[...b.querySelectorAll(".sn")].map(x=>x.textContent).join(" ; ")).join("\n"));
 click(q('[data-act="sv"][data-v="weak"]'));console.log("weak:",d.querySelectorAll(".myrow").length,q(".myrow").textContent.slice(0,60));
 click(q('[data-act="sv"][data-v="phr"]'));console.log("phr groups:",d.querySelectorAll("details.pgrp").length);click(q('details.pgrp button[data-act="goto"]'));console.log("goto tab:",w.eval("S.tab"));
 click(q('[data-tab="stats"]'));click(q('[data-act="sv"][data-v="set"]'));click(q('[data-act="theme"][data-v="dark"]'));console.log("theme:",d.documentElement.dataset.theme);click(q('[data-act="theme"][data-v="auto"]'));console.log("auto:",d.documentElement.dataset.theme);
 console.log("voice ui:",!!d.querySelector("select"));
}catch(e){errs.push(e.stack)}console.log("errors",errs);process.exit(0)},300);
