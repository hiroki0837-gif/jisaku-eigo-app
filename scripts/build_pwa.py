"""app/index.html からオフライン版(PWA)を dist/ に作る。  python3 scripts/build_pwa.py"""
import os,json,hashlib,shutil,zipfile
ROOT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..');D=os.path.join(ROOT,'dist')
src=open(os.path.join(ROOT,'app','index.html'),encoding='utf8').read()
os.makedirs(D,exist_ok=True)
for f in ['apple-touch-icon.png','icon-192.png','icon-512.png']:shutil.copy(os.path.join(ROOT,'app','icons',f),D)
i=src.index('</style>')+len('</style>')
head=('<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
 '<meta name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="default">'
 '<meta name="apple-mobile-web-app-title" content="英語学習"><meta name="theme-color" content="#fdfcfa">'
 '<link rel="manifest" href="manifest.webmanifest"><link rel="apple-touch-icon" href="apple-touch-icon.png"><link rel="icon" href="icon-192.png">')
# 画面のいちばん上で下に引っ張ると、新しい版を確認して読み込み直す（ホーム画面アプリにはブラウザの更新ボタンがないため）
PTR = r'''<script>(function(){
var y0=null,dy=0,busy=false,TH=70,el=document.createElement("div");el.id="ptr";
el.style.cssText="position:fixed;left:50%;top:calc(env(safe-area-inset-top,0px) + 8px);transform:translate(-50%,-70px);z-index:80;background:var(--surface);color:var(--fg);border:1px solid var(--line);border-radius:99px;padding:7px 16px;font-size:13px;box-shadow:0 4px 14px rgba(0,0,0,.15);pointer-events:none;transition:transform .2s";
document.body.appendChild(el);
function show(t,px){el.textContent=t;el.style.transform="translate(-50%,"+px+"px)"}
function hide(){el.style.transition="transform .2s";el.style.transform="translate(-50%,-70px)"}
function skip(t){return !!(t.closest&&t.closest("#ewsheet,#unksheet,textarea,input,select"))}
document.addEventListener("touchstart",function(e){if(busy||window.scrollY>0||e.touches.length!==1||skip(e.target)){y0=null;return}y0=e.touches[0].clientY;dy=0;el.style.transition="none"},{passive:true});
document.addEventListener("touchmove",function(e){if(y0===null)return;dy=(e.touches[0].clientY-y0)*0.5;if(dy<=0||window.scrollY>0){hide();return}
  show(dy>=TH?"離すと更新":"↓ 引っ張って更新",Math.min(dy,TH+20)-60)},{passive:true});
document.addEventListener("touchend",function(){if(y0===null)return;y0=null;el.style.transition="transform .2s";if(dy<TH){hide();return}busy=true;show("更新を確認中…",10);update()});
function update(){var done=function(){try{sessionStorage.setItem("ptr","1")}catch(e){}location.reload()};
  if(!("serviceWorker" in navigator)){done();return}
  navigator.serviceWorker.getRegistration().then(function(r){if(!r)return;return r.update().then(function(){var w=r.installing||r.waiting;if(!w)return;
    return new Promise(function(res){var t=setTimeout(res,10000);navigator.serviceWorker.addEventListener("controllerchange",function(){clearTimeout(t);res()},{once:true})})})}).catch(function(){}).then(done)}
try{if(sessionStorage.getItem("ptr")){sessionStorage.removeItem("ptr");setTimeout(function(){try{toast("最新の状態にしました")}catch(e){}},300)}}catch(e){}
})();</script>'''
out=head+src[:i]+'</head><body>'+src[i:]+('<script>if("serviceWorker" in navigator){window.addEventListener("load",()=>{navigator.serviceWorker.register("sw.js",{updateViaCache:"none"}).catch(()=>{})})}'
 'try{S.sync="この端末に保存（オフライン版）";}catch(e){}</script>'+PTR+'</body></html>')
open(os.path.join(D,'index.html'),'w',encoding='utf8').write(out)
json.dump({"name":"自作英語学習アプリ","short_name":"英語学習","start_url":"./","scope":"./","display":"standalone","background_color":"#fdfcfa","theme_color":"#fdfcfa","lang":"ja",
 "icons":[{"src":"icon-192.png","sizes":"192x192","type":"image/png"},{"src":"icon-512.png","sizes":"512x512","type":"image/png"},{"src":"icon-512.png","sizes":"512x512","type":"image/png","purpose":"maskable"}]},
 open(os.path.join(D,'manifest.webmanifest'),'w',encoding='utf8'),ensure_ascii=False,indent=1)
v=hashlib.md5(out.encode()).hexdigest()[:8]  # 内容が変わるとキャッシュ名が変わり、端末側も更新される
open(os.path.join(D,'sw.js'),'w').write('const C="eigo-'+v+'";const CORE=["./","index.html","manifest.webmanifest","apple-touch-icon.png","icon-192.png","icon-512.png"];\n'
 'self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(CORE.map(u=>new Request(u,{cache:"reload"})))).then(()=>self.skipWaiting()))});\n'
 'self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});\n'
 'self.addEventListener("fetch",e=>{if(e.request.method!=="GET")return;const u=new URL(e.request.url);\n'
 '  if(u.origin===location.origin){e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>r||fetch(e.request).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put(e.request,cp));return res}).catch(()=>caches.match("index.html"))))}\n'
 '  else if(/fonts\\.(googleapis|gstatic)\\.com/.test(u.host)){e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put(e.request,cp));return res}).catch(()=>new Response("",{status:504}))))}\n});\n')
z=os.path.join(ROOT,'jisaku-eigo-offline.zip')
with zipfile.ZipFile(z,'w',zipfile.ZIP_DEFLATED) as zf:
    for f in os.listdir(D):zf.write(os.path.join(D,f),f)
print('dist/ と jisaku-eigo-offline.zip を作成しました')
