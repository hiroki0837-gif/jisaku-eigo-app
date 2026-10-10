const {JSDOM}=require("jsdom");const fs=require("fs");
const dom=new JSDOM("<!doctype html><body>"+fs.readFileSync(require("path").join(__dirname,"../app/index.html"),"utf8")+"</body>",{runScripts:"dangerously",pretendToBeVisual:true});
const w=dom.window,d=w.document;w.scrollTo=()=>{};const errs=[];w.addEventListener("error",e=>errs.push(e.message));
const click=el=>el.dispatchEvent(new w.MouseEvent("click",{bubbles:true}));const q=s=>{const e=d.querySelector(s);if(!e)throw new Error("missing "+s);return e};
setTimeout(()=>{try{
 click(q('[data-tab="example"]'));const p=q('p[data-en]');console.log(p.innerHTML.slice(0,200));
 const jw=p.querySelectorAll(".jw");click(jw[1]);console.log("bar:",q(".jwbar").textContent);click(p.querySelectorAll(".jw")[3]);console.log("bar2:",q(".jwbar .jwph").textContent);
 click(q("[data-jwsave]"));console.log("saved",w.eval("S.unk.map(u=>u.ja).join()"),"hit:",d.querySelectorAll('p[data-en] .jw.hit').length);
 click(q('p[data-en] .unkb'));console.log("sheet",q("#unksheet").className);click(q('[data-uclose]'));
 click(q('[data-tab="toeic"]'));click(q('[data-act="topen"]'));const p2=q('p[data-en]');click(p2.querySelector(".jw"));console.log("toeic bar",!!d.querySelector(".jwbar"));click(q("[data-jwx]"));console.log("cleared",!d.querySelector(".jwbar"),d.querySelectorAll(".jw.on").length);
 click(q('[data-tab="review"]'));click(q('[data-act="rvsw"][data-v="unk"]'));console.log(q(".unkc .exja2").innerHTML);
}catch(e){errs.push(e.stack)}console.log("errors",errs);process.exit(0)},300);
