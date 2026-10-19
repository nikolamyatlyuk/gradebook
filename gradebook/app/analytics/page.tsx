'use client';
import {useState,ReactNode} from 'react';import Bar from '@/components/Bar';import CountUp from '@/components/CountUp';import {courses,assignments,Assignment,grade,catPct,letter,gColor,eff,isOverdue,fmt,NOW} from '@/lib/data';import {useStore} from '@/lib/store';
const periods:Record<string,[string,number]>={'14':['Last 2 weeks',14],'30':['Last month',30],'90':['Last quarter',90],'all':['All term',9999]};
const LETTERS=['A+','A','A-','B+','B','B-','C+','C','C-','D','F'];
const same=(a:Assignment)=>new Date(a.due).toDateString()===NOW.toDateString();
function Spark({v,color}:{v:number[];color:string}){if(v.length<2)return null;const lo=Math.min(...v)-1,hi=Math.max(...v)+1;
 const pts=v.map((y,i)=>`${i/(v.length-1)*200},${50-(y-lo)/(hi-lo)*46}`).join(' ');return <svg viewBox="0 0 200 52" className="w-full h-14"><polyline points={pts} pathLength="1" strokeDasharray="1" className="draw" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>}
const Stat=({l,v,sub,c}:{l:string;v:ReactNode;sub:string;c?:string})=><div className="card !p-4"><div className="text-xs uppercase tracking-wide text-neutral-500">{l}</div><div className="text-3xl font-bold" style={{color:c}}>{v}</div><div className="text-sm text-neutral-400">{sub}</div></div>;
export default function Analytics(){
 const {s}=useStore();const [per,setPer]=useState('30');const cut=+NOW-periods[per][1]*864e5;const th=s.settings.lowThreshold;
 const vis=courses.filter(c=>!s.hidden.includes(c.id)&&grade(c,assignments)!==null);
 if(!vis.length)return <div><h1 className="text-3xl font-bold mb-4">Analytics</h1><p className="text-neutral-400">No graded work yet. Analytics appear once you have grades in at least one visible class.</p></div>;
 const ids=new Set(vis.map(c=>c.id));const A=assignments.filter(a=>ids.has(a.courseId));
 const data=vis.map(c=>{const list=assignments.filter(a=>a.courseId===c.id&&eff(a)!==null).sort((a,b)=>+new Date(a.due)-+new Date(b.due));
  const series=list.map((_,k)=>grade(c,list.slice(0,k+1))!);const inP=list.map((a,i)=>+new Date(a.due)>=cut?i:-1).filter(i=>i>=0);
  const start=inP.length?(inP[0]>0?series[inP[0]-1]:series[0]):series[0];const now=grade(c,assignments)!;
  return{c,now,series:inP.length?series.slice(Math.max(0,inP[0]-1)):series,change:now-start,late:assignments.filter(a=>a.courseId===c.id&&isOverdue(a)).length}});
 const avg=data.reduce((t,d)=>t+d.now,0)/data.length;const hi=Math.max(...data.map(d=>d.now)),lo=Math.min(...data.map(d=>d.now));
 const cats=vis.flatMap(c=>c.cats.map(k=>({c,k,p:catPct(c,k.name)}))).filter(x=>x.p!==null) as {c:typeof vis[0];k:typeof vis[0]['cats'][0];p:number}[];
 const attention=data.filter(d=>d.now<th).length+cats.filter(x=>x.p<th).length;
 const overdue=A.filter(isOverdue).length,today=A.filter(a=>a.score===null&&!a.completed&&same(a)).length,upcoming=A.filter(a=>a.score===null&&!a.completed&&+new Date(a.due)>+NOW&&!same(a)&&+new Date(a.due)<=+NOW+14*864e5).length;
 const dueSoFar=A.filter(a=>+new Date(a.due)<=+NOW),coverage=dueSoFar.length?dueSoFar.filter(a=>a.score!==null).length/dueSoFar.length*100:100;
 const dist=LETTERS.map(l=>[l,data.filter(d=>letter(d.now)===l).length] as [string,number]).filter(x=>x[1]>0);
 const losses=A.filter(a=>a.score!==null).map(a=>({a,lost:a.max-a.score!})).filter(x=>x.lost>0).sort((x,y)=>y.lost-x.lost).slice(0,5);
 const tips=[...data].sort((a,b)=>a.now-b.now).slice(0,3).map(d=>{
  const weak=d.c.cats.map(k=>({k,p:catPct(d.c,k.name)})).filter(x=>x.p!==null).sort((a,b)=>(100-b.p!)*b.k.w-(100-a.p!)*a.k.w)[0];
  const t=weak&&weak.p!<th?`Focus on ${weak.k.name}: ${weak.p!.toFixed(0)}%, worth ${weak.k.w}% of the grade.`
   :d.late?`${d.late} overdue assignment${d.late>1?'s':''} not graded yet. Turn ${d.late>1?'them':'it'} in.`
   :d.change<-2?`Down ${Math.abs(d.change).toFixed(1)} pts this period. Review recent low scores.`:'On track. Keep it up.';
  return{c:d.c,now:d.now,t}});
 return <div><div className="flex flex-wrap items-center justify-between gap-3 mb-5"><h1 className="text-3xl font-bold">Analytics</h1>
  <select value={per} onChange={e=>setPer(e.target.value)}>{Object.entries(periods).map(([k,[l]])=><option key={k} value={k}>{l}</option>)}</select></div>
  <div className="grid gap-3 grid-cols-2 lg:grid-cols-4 mb-4 stagger">
   <Stat l="Course average" v={<CountUp to={avg} dec={2} suffix="%"/>} sub={`${data.length} graded classes`}/><Stat l="Grade spread" v={(hi-lo).toFixed(1)+' pts'} sub="highest to lowest class"/>
   <Stat l="Attention list" v={attention} sub={`classes or categories below ${th}%`} c={attention?'#f0924a':undefined}/><Stat l="Pending work" v={overdue} sub={`overdue · ${today} today · ${upcoming} upcoming`} c={overdue?'#e5605f':undefined}/></div>
  <div className="card !p-3 mb-6 border-amber-500/40"><div className="text-sm font-semibold mb-1">Tips for your 3 lowest classes</div>
   {tips.map(t=><div key={t.c.id} className="text-xs text-neutral-300 py-0.5"><span className="font-medium" style={{color:gColor(t.now)}}>{t.c.name} ({letter(t.now)})</span> · {t.t}</div>)}</div>
  <h2 className="font-semibold mb-3">Grade trends</h2>
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8 stagger">{data.map(d=><div key={d.c.id} className="card lift"><div className="flex justify-between"><span className="font-medium">{d.c.name}</span><span style={{color:gColor(d.now)}} className="font-bold">{letter(d.now)} · {d.now.toFixed(1)}%</span></div>
   <Spark v={d.series} color={d.c.color}/><div className={`text-sm ${d.change>=0?'text-green-400':'text-red-400'}`}>{d.change>=0?'+':''}{d.change.toFixed(2)} pts · {periods[per][0].toLowerCase()}</div></div>)}</div>
  <div className="grid gap-4 lg:grid-cols-3 mb-8">
   <div className="card"><h2 className="font-semibold mb-3">Grade distribution</h2>{dist.map(([l,n])=><div key={l} className="flex items-center gap-2 mb-1 text-sm"><span className="w-8">{l}</span><div className="flex-1"><Bar h="h-2" pct={n/data.length*100} color={gColor(data.find(d=>letter(d.now)===l)!.now)}/></div><span className="w-4 text-right text-neutral-400">{n}</span></div>)}</div>
   <div className="card"><h2 className="font-semibold mb-3">Biggest point losses</h2>{losses.map(({a,lost})=><div key={a.id} className="flex justify-between text-sm py-1"><span className="truncate pr-2">{a.title} <span className="text-neutral-500">· {courses.find(c=>c.id===a.courseId)!.name}</span></span><span className="text-red-400">-{+lost.toFixed(1)}</span></div>)}{!losses.length&&<p className="text-sm text-neutral-400">No lost points. Nice.</p>}</div>
   <div className="card"><h2 className="font-semibold mb-3">Workload signal</h2><div className="grid grid-cols-3 gap-2 text-center mb-4">{[['Overdue',overdue,'#e5605f'],['Today',today,'#f2f2f2'],['Upcoming',upcoming,'#6d8cff']].map(([l,n,c])=><div key={l as string} className="bg-neutral-900 rounded-lg py-2"><div className="text-2xl font-bold" style={{color:c as string}}>{n}</div><div className="text-xs text-neutral-400">{l}</div></div>)}</div>
    <div className="flex justify-between text-sm"><span>Graded coverage</span><span>{coverage.toFixed(0)}%</span></div><div className="mt-1"><Bar pct={coverage} color="var(--accent)"/></div>
    <p className="text-xs text-neutral-500 mt-2">Share of assignments due so far that have a grade.</p></div></div>
  <h2 className="font-semibold mb-3">Category health</h2><div className="space-y-2">{[...cats].sort((a,b)=>a.p-b.p).map(({c,k,p})=>
   <div key={c.id+k.name} className="card !py-2"><div className="flex justify-between text-sm"><span>{c.name} / {k.name} <span className="text-neutral-500">({k.w}% weight)</span></span><span style={{color:gColor(p)}}>{p.toFixed(1)}%</span></div>
   <div className="mt-1"><Bar pct={p} color={gColor(p)}/></div></div>)}</div></div>}
