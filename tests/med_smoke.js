const {JSDOM}=require("jsdom");const fs=require("fs");
const dom=new JSDOM("<!doctype html><body>"+fs.readFileSync(require("path").join(__dirname,"../app/index.html"),"utf8")+"</body>",{runScripts:"dangerously",pretendToBeVisual:true});
const w=dom.window,d=w.document;w.scrollTo=()=>{};const errs=[];w.addEventListener("error",e=>errs.push(e.message));
const click=s=>{const el=d.querySelector(s);if(!el)throw new Error("missing "+s);el.dispatchEvent(new w.MouseEvent("click",{bubbles:true}))};
setTimeout(()=>{try{
 click('[data-tab="toeic"]');click('[data-act="tdeck"][data-v="med"]');
 console.log(d.querySelector(".tpos").textContent,"|",d.querySelector(".tw").textContent);
 click('[data-act="topen"]');console.log("open ok",!!d.querySelector('[data-act="to"]'));
 click('[data-act="tset"][data-k="dir"][data-v="je"]');console.log("je:",d.querySelector(".jp")?d.querySelector(".jp").textContent:d.querySelector(".tja").textContent);
 for(let i=0;i<5;i++)click('[data-act="tnext"]');console.log("je5:",(d.querySelector(".jp")||d.querySelector(".tja")).textContent);
 click('[data-act="tdeck"][data-v="mix"]');console.log(d.querySelector('[data-act="tdeck"][data-v="mix"]').textContent);
 click('[data-act="tset"][data-k="set"][data-v="sm"]');console.log("mix sm:",d.querySelector(".meta").textContent);
 const n=w.eval('ALLCL.filter(g=>g.deck==="mix"&&g.it.some(r=>MED.some(m=>m.w===r[0]))).length');console.log("mix clusters w/ med",n);
 const miss=w.eval('ALLCL.flatMap(g=>g.it.filter(r=>!deckWord(g.deck,r[0])).map(r=>g.deck+":"+r[0]))');console.log("missing members",miss.length,miss.slice(0,10));
 const dup=w.eval('(()=>{const s=new Map(),o=[];ALLCL.forEach(g=>g.it.forEach(r=>{const k=g.deck+":"+r[0];if(s.has(k))o.push(k);s.set(k,1)}));return o})()');console.log("dup",dup.length,dup.slice(0,5));
 click('[data-tab="example"]');click('[data-act="eset"][data-k="src"][data-v="med"]');console.log("ex:",d.querySelector(".tpos").textContent.slice(0,40));
}catch(e){errs.push(e.message)}console.log("errors",errs);process.exit(0)},300);
