import json,re
import os
P=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','app','index.html')
dec=json.JSONDecoder()
CONSTS=['TW','IDM','KOB','NG','PARA','TIMEG','DLG','MED','SG','CLS','CROSS','MERGES']
def load():
    s=open(P,encoding='utf8').read();out={}
    for n in CONSTS:
        i=s.index('const '+n+'=')+len('const '+n+'=');o,e=dec.raw_decode(s,i);out[n]=[i,e,o]
    for n,pre in [('MEDCL','const MEDCL='),('MIXMED',',MIXMED=')]:
        i=s.index(pre)+len(pre);o,e=dec.raw_decode(s,i);out[n]=[i,e,o]
    i=s.index('const EX=Object.assign(')+len('const EX=Object.assign(');a,e1=dec.raw_decode(s,i);b,e2=dec.raw_decode(s,e1+1)
    out['EX1']=[i,e1,a];out['EX2']=[e1+1,e2,b]
    i=s.index('Object.assign(EX,')+len('Object.assign(EX,');c,e3=dec.raw_decode(s,i);out['EX3']=[i,e3,c]
    return s,out
def save(s,out):
    J=lambda x:json.dumps(x,ensure_ascii=False).replace("</","<\\/")
    for a,b,d in sorted(out.values(),key=lambda r:-r[0]): s=s[:a]+J(d)+s[b:]
    open(P,'w',encoding='utf8').write(s)
