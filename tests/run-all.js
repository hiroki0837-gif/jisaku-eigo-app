// 全スモークテストを実行し、各テストの最後の "errors" 行が空かを確認する
const {execFileSync}=require("child_process"),fs=require("fs"),path=require("path");
let fail=0;
for(const f of fs.readdirSync(__dirname).filter(f=>f.endsWith(".js")&&f!=="run-all.js"&&f!=="offline.test.js")){
  let out="";try{out=execFileSync("node",[path.join(__dirname,f)],{encoding:"utf8",stdio:["ignore","pipe","pipe"],timeout:60000})}catch(e){out=(e.stdout||"")+(e.stderr||"")}
  const last=out.trim().split("\n").filter(l=>/^errors|^\[/.test(l)).pop()||"";
  const ok=/errors \[\]|^\[\]$/.test(last);if(!ok)fail++;
  console.log((ok?"OK  ":"NG  ")+f+(ok?"":"\n"+out.slice(-800)));
}
console.log(fail?`${fail} 件失敗`:"すべて成功");process.exit(fail?1:0);
