"""チェック用にデータを書き出す: work/check/ に a*.tsv(例文) b*.tsv(単語の意味) c_groups.jsonl(似た言葉) c_ladders は tests 不要。
使い方: python3 scripts/export_for_check.py"""
import sys,json,os
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from datalib import load
W=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','work','check');os.makedirs(W,exist_ok=True)
def items(out):
    for n in ['TW','IDM','MED']:
        for k,x in enumerate(out[n][2]):
            if x.get('ex'):yield f'{n}:{k}',x['w'],x['ex'],x.get('exja','')
    for k,x in enumerate(out['KOB'][2]):
        if x.get('ex'):yield f'KOB:{k}:1',x['w'],x['ex'],x.get('exja','')
        if x.get('ex2'):yield f'KOB:{k}:2',x['w'],x['ex2'],x.get('exja2','')
    for n in ['NG','PARA','TIMEG']:
        for k,g in enumerate(out[n][2]):
            for j,r in enumerate(g['it']):
                if len(r)>4 and r[3]:yield f'{n}:{k}:{j}',r[0],r[3],r[4]
    for n in ['EX1','EX2']:
        for kk,v in out[n][2].items():yield f'{n}:{kk}','',v[0],v[1]
    for k,d in enumerate(out['DLG'][2]):
        for j,l in enumerate(d['lines']):yield f'DLG:{k}:{j}','('+d.get('t','')+')',l[1],l[2]

s,o=load()
cl=lambda t:str(t).replace('\t',' ').replace('\n',' ')
# A examples
A=list(items({k:(0,0,v[2]) for k,v in o.items()}))
A+= [(f'EX3:{k}','',v[0],v[1]) for k,v in o['EX3'][2].items()]
n=8;sz=-(-len(A)//n)
for i in range(n):open(f'{W}/a{i}.tsv','w').write(''.join('\t'.join(cl(c) for c in r)+'\n' for r in A[i*sz:(i+1)*sz]))
# B meanings
B=[]
for nm in ['TW','IDM','MED','KOB']:
    for k,x in enumerate(o[nm][2]):B.append((f'{nm}:{k}',x['w'],x.get('ja',''),x.get('note',''),x.get('ex','')))
n=4;sz=-(-len(B)//n)
for i in range(n):open(f'{W}/b{i}.tsv','w').write(''.join('\t'.join(cl(c) for c in r)+'\n' for r in B[i*sz:(i+1)*sz]))
# C groups
C=[]
for nm in ['NG','PARA','TIMEG','SG','MERGES','CLS','CROSS','MEDCL','MIXMED']:
    for k,g in enumerate(o[nm][2]):
        its=g.get('it') or [[w,'(order only)'] for w,*_ in g.get('order',[])]
        C.append(json.dumps({"id":f"{nm}:{k}","title":g.get('t',''),"axis":g.get('ax',''),"note":g.get('note',''),"items":[[it[0],it[1]]+([it[2]] if nm in('NG','PARA','TIMEG') and len(it)>2 else []) for it in its]},ensure_ascii=False))
open(W+'/c_groups.jsonl','w').write('\n'.join(C)+'\n')
print(len(A),len(B),len(C))
