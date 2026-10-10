const {JSDOM}=require("jsdom");const fs=require("fs");
const mk=()=>new JSDOM("<!doctype html><body>"+fs.readFileSync(require("path").join(__dirname,"../app/index.html"),"utf8")+"</body>",{runScripts:"dangerously",pretendToBeVisual:true,url:"https://example.org/",beforeParse(w){w.scrollTo=()=>{}}});
const A=mk(),B=mk();
const click=(w,el)=>el.dispatchEvent(new w.window.MouseEvent("click",{bubbles:true}));const q=(w,s)=>w.window.document.querySelector(s);
const errs=[];[A,B].forEach(d=>d.window.addEventListener("error",e=>errs.push(e.message)));
setTimeout(()=>{
 click(A,q(A,'[data-tab="toeic"]'));click(A,q(A,'[data-act="topen"]'));click(A,q(A,'[data-act="tx"]'));
 click(A,q(A,'[data-tab="stats"]'));click(A,q(A,'[data-act="sv"][data-v="set"]'));click(A,q(A,'[data-act="bkcopy"]'));const txt=q(A,'#bktext').value;console.log("copied len",txt.length);
 click(B,q(B,'[data-tab="stats"]'));click(B,q(B,'[data-act="sv"][data-v="set"]'));click(B,q(B,'[data-act="bkpaste"]'));q(B,'#bktext').value=txt;click(B,q(B,'[data-act="bkrestore"]'));
 console.log("B msg:",q(B,'.uhelp')?.textContent,"rec:",Object.keys(B.window.eval("S.rec")).length);
 console.log("errors",errs);process.exit(0)},400);
