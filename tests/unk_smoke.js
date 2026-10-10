const {JSDOM}=require("jsdom");const fs=require("fs");
const dom=new JSDOM("<!doctype html><body>"+fs.readFileSync(require("path").join(__dirname,"../app/index.html"),"utf8")+"</body>",{runScripts:"dangerously",pretendToBeVisual:true});
const w=dom.window,d=w.document;w.scrollTo=()=>{};const errs=[];w.addEventListener("error",e=>errs.push(e.message));
const click=el=>el.dispatchEvent(new w.MouseEvent("click",{bubbles:true}));const q=s=>{const e=d.querySelector(s);if(!e)throw new Error("missing "+s);return e};
setTimeout(()=>{try{
 click(q('[data-tab="example"]'));
 console.log("btns",d.querySelectorAll(".unkb").length);
 const p=q('p[data-en]');console.log("ja:",p.dataset.ja,"| en:",p.dataset.en.slice(0,50));
 click(q('p[data-en] .unkb'));console.log("sheet:",q("#unksheet").className,d.querySelectorAll(".uch").length);
 const bs=[...d.querySelectorAll("button.uch")];click(bs[1]);click(d.querySelectorAll("button.uch")[3]);console.log("phrase:",q("#uphrase").value);
 click(q('[data-usave]'));console.log("saved",w.eval("S.unk.length"),w.eval("JSON.stringify(S.unk[0]).slice(0,160)"));
 console.log("marked:",q('p[data-en] .unkb').textContent);
 click(q('[data-tab="review"]'));click(q('[data-act="rvsw"][data-v="unk"]'));console.log("card:",q(".unkc .tja").textContent, q(".unkc .exja2").innerHTML.slice(0,80));
 click(q('[data-act="unkopen"]'));console.log("en shown",!!d.querySelector(".unkc .exen"));
 const ta=q('[data-unkmemo]');ta.value="test memo";ta.dispatchEvent(new w.Event("input",{bubbles:true}));console.log("memo",w.eval("S.unk[0].memo"));
 click(q('[data-act="unkdone"]'));console.log("todo count after done:",d.querySelectorAll(".unkc").length);
 click(q('[data-act="uf"][data-v="all"]'));click(q('[data-act="unkdel"]'));click(q('[data-act="unkdel"]'));console.log("after del:",d.querySelectorAll(".unkc").length);
 click(q('[data-tab="toeic"]'));click(q('[data-act="topen"]'));console.log("toeic btns",d.querySelectorAll(".unkb").length);
}catch(e){errs.push(e.stack)}console.log("errors",errs);process.exit(0)},300);
