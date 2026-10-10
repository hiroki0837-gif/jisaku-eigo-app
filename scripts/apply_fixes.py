"""チェック結果(work/check/fa*.tsv fb*.tsv fc*.tsv fl*.tsv)を app/index.html に反映する。
使い方: python3 scripts/apply_fixes.py  （実行前に app/index.html をgitでコミットしておくと安全）"""
import sys,json,glob,os
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from datalib import load,save,P
W=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','work','check')
s,o=load();rep={'A':0,'B':0,'C':0,'L':0};bad=[]
rows=lambda pat:[l.rstrip('\n').split('\t') for f in sorted(glob.glob(pat)) for l in open(f,encoding='utf8') if l.strip()]
# A examples
for c in rows(W+'/fa*.tsv'):
    if len(c)<3 or not c[1].strip():bad.append(('A',c[0]));continue
    id,en,ja=c[0],c[1].strip(),c[2].strip();k=id.split(':');t=k[0]
    try:
        if t in('TW','IDM','MED'):x=o[t][2][int(k[1])];x['ex']=en;x['exja']=ja or x['exja']
        elif t=='KOB':
            x=o[t][2][int(k[1])]
            if k[2]=='1':x['ex']=en;x['exja']=ja or x['exja']
            else:x['ex2']=en;x['exja2']=ja or x['exja2']
        elif t in('NG','PARA','TIMEG'):r=o[t][2][int(k[1])]['it'][int(k[2])];r[3]=en;r[4]=ja or r[4]
        elif t in('EX1','EX2','EX3'):kk=id.split(':',1)[1];d=o[t][2];assert kk in d;d[kk]=[en,ja or d[kk][1]]
        elif t=='DLG':l=o[t][2][int(k[1])]['lines'][int(k[2])];l[1]=en;l[2]=ja or l[2]
        else:raise Exception('type')
        rep['A']+=1
    except Exception as e:bad.append(('A',id,str(e)))
# B meanings
for c in rows(W+'/fb*.tsv'):
    try:
        t,i=c[0].split(':');x=o[t][2][int(i)]
        if c[1].strip():x['ja']=c[1].strip()
        if len(c)>2 and c[2].strip() and 'note' in x:x['note']=c[2].strip()
        rep['B']+=1
    except Exception as e:bad.append(('B',c[0],str(e)))
# C groups
for c in rows(W+'/fc*.tsv'):
    try:
        t,i=c[0].split(':');g=o[t][2][int(i)];f=c[1].strip();v=c[2].strip()
        if f=='note':g['note']=v
        elif f.startswith('item:'):
            if 'it' not in g:raise Exception('no items')
            g['it'][int(f[5:])][1]=v
        elif f.startswith('meaning:'):g['it'][int(f[8:])][2]=v
        elif f=='order':
            ws=[w.strip() for w in v.split('|')]
            if 'it' in g:
                m={r[0]:r for r in g['it']}
                if sorted(ws)!=sorted(m):raise Exception('order set mismatch')
                g['it']=[m[w] for w in ws]
            else:
                m={r[0]:r for r in g['order']}
                if sorted(ws)!=sorted(m):raise Exception('order set mismatch')
                g['order']=[m[w] for w in ws]
        else:raise Exception('field '+f)
        rep['C']+=1
    except Exception as e:bad.append(('C',c[0],c[1] if len(c)>1 else '',str(e)))
save(s,o)
# L ladders (string replace on pairs)
s=open(P,encoding='utf8').read()
lad={json.loads(l)['id']:json.loads(l) for l in open(W+'/c_ladders.jsonl')}
def forms(x):j=json.dumps(x,ensure_ascii=False);return [j,j.replace('</','<\\/')]
for c in rows(W+'/fl*.tsv'):
    try:
        q=lad[c[0]];lv=int(c[1]);oe,ox=q['a'][lv];ne=c[2].strip() or oe;nx=c[3].strip() or ox
        done=False
        for fe in forms(oe):
            for fx in forms(ox):
                for sep in [',',', ']:
                    old=fe+sep+fx
                    if s.count(old)==1:
                        J=json.dumps(ne,ensure_ascii=False),json.dumps(nx,ensure_ascii=False)
                        if '<\\/' in fx:J=(J[0].replace('</','<\\/'),J[1].replace('</','<\\/'))
                        s=s.replace(old,J[0]+sep+J[1]);done=True;break
                if done:break
            if done:break
        if not done:raise Exception('pair not found uniquely')
        # keep example key consistent: nothing else to change
        rep['L']+=1
    except Exception as e:bad.append(('L',c[0],c[1] if len(c)>1 else '',str(e)))
open(P,'w',encoding='utf8').write(s)
print(rep);print('bad',len(bad),bad[:20])
