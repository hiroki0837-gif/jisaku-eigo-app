// フレーズ・品詞別の4段階データを work/check/c_ladders.jsonl に書き出す（チェック用）。 node scripts/export_ladders.js
require("fs").mkdirSync(require("path").join(__dirname,"../work/check"),{recursive:true});const {JSDOM}=require("jsdom");const fs=require("fs");
const dom=new JSDOM("<!doctype html><body>"+fs.readFileSync(require("path").join(__dirname,"../app/index.html"),"utf8")+"</body>",{runScripts:"dangerously",pretendToBeVisual:true});
setTimeout(()=>{const L=dom.window.eval('ALL.map(q=>({id:q.id,jp:q.jp,scene:q.scene,a:q.a}))');fs.writeFileSync(require("path").join(__dirname,"../work/check/c_ladders.jsonl"),L.map(x=>JSON.stringify(x)).join("\n")+"\n");console.log(L.length);process.exit(0)},300);
