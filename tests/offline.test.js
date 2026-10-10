// dist/ を内蔵サーバーで配信し、Chromium でオフライン動作を確認する（先に npm run build）
const {chromium}=require('playwright'),http=require('http'),fs=require('fs'),path=require('path');
const DIST=path.join(__dirname,'..','dist'),TYPES={'.html':'text/html; charset=utf-8','.js':'text/javascript','.png':'image/png','.webmanifest':'application/manifest+json'};
const srv=http.createServer((q,r)=>{let f=path.join(DIST,decodeURIComponent(q.url.split('?')[0]));if(f.endsWith('/'))f+='index.html';fs.readFile(f,(e,d)=>{if(e){r.writeHead(404);r.end();return}r.writeHead(200,{'Content-Type':TYPES[path.extname(f)]||'application/octet-stream'});r.end(d)})}).listen(8765);
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}).catch(async()=>await chromium.launch());
const ctx=await b.newContext({viewport:{width:390,height:844}});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto(process.env.URL||'http://localhost:8765/');await p.waitForTimeout(1500);
const sw=await p.evaluate(async()=>{const r=await navigator.serviceWorker.ready;return !!r.active});console.log('sw active',sw,'title',await p.title());
await p.reload();await p.waitForTimeout(800);
await ctx.setOffline(true);await p.reload();await p.waitForTimeout(800);
console.log('offline h1:',await p.textContent('h1'));
await p.click('[data-tab="toeic"]');await p.click('[data-act="topen"]');await p.click('[data-act="to"]');
await p.reload();await p.waitForTimeout(500);console.log('rec persisted offline:',await p.evaluate(()=>Object.keys(S.rec).length));
await p.screenshot({path:require('path').join(__dirname,'offline_shot.png')});console.log('errors',errs);if(errs.length)process.exitCode=1;await b.close();srv.close()})();
