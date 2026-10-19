'use client';
import {useState} from 'react';import {courses,assignments,grade,catPct,letter,gColor,eff,NOW} from '@/lib/data';import {useStore} from '@/lib/store';
const periods:Record<string,[string,number]>={'14':['Last 2 weeks',14],'30':['Last month',30],'90':['Last quarter',90],'all':['All term',9999]};
function Spark({v,color}:{v:number[];color:string}){if(v.length<2)return null;const lo=Math.min(...v)-1,hi=Math.max(...v)+1;
 const pts=v.map((y,i)=>`${i/(v.length-1)*200},${50-(y-lo)/(hi-lo)*46}`).join(' ');return <svg viewBox="0 0 200 52" className="w-full h-14"><polyline points={pts} fill="none" stroke={color} strokeWidth="2"/></svg>}
export default function Analytics(){
 const {s}=useStore();const [per,setPer]=useState('30');const cut=+NOW-periods[per][1]*864e5;
 const vis=courses.filter(c=>!s.hidden.includes(c.id)&&grade(c,assignments)!==null);
 const data=vis.map(c=>{const list=assignments.filter(a=>a.courseId===c.id&&eff(a)!==null).sort((a,b)=>+new Date(a.due)-+new Date(b.due));
  const series=list.map((_,k)=>grade(c,list.slice(0,k+1))!);const inP=list.map((a,i)=>+new Date(a.due)>=cut?i:-1).filter(i=>i>=0);
  const start=inP.length?(inP[0]>0?series[inP[0]-1]:series[0]):series[0];const now=grade(c,assignments)!;
  return{c,now,series:inP.length?series.slice(Math.max(0,inP[0]-1)):series,change:now-start,gain:(grade(c,assignments,true)??now)-now}});
 const avg=data.reduce((t,d)=>t+d.now,0)/(data.length||1);
 const tips:string[]=[];
 for(const d of data){const {c}=d;
  if(d.gain>0.5)tips.push(`${c.name}: turning in your missing work could raise your grade by up to ${d.gain.toFixed(1)} points.`);
  const weak=c.cats.map(k=>({k,p:catPct(c,k.name)})).filter(x=>x.p!==null&&x.p<s.settings.lowThreshold).sort((a,b)=>a.p!-b.p!)[0];
  if(weak)tips.push(`${c.name}: ${weak.k.name} is at ${weak.p!.toFixed(0)}% and counts for ${weak.k.w}% of the grade. Put your next study session here.`);
  if(d.change<-2)tips.push(`${c.name} dropped ${Math.abs(d.change).toFixed(1)} points in this period. Review your most recent low scores and ask your teacher about retakes.`);}
 return <div><div className="flex flex-wrap items-center justify-between gap-3 mb-5"><h1 className="text-3xl font-bold">Analytics</h1>
  <select value={per} onChange={e=>setPer(e.target.value)}>{Object.entries(periods).map(([k,[l]])=><option key={k} value={k}>{l}</option>)}</select></div>
  <div className="card mb-6"><div className="text-neutral-400 text-sm">Average across {data.length} classes</div><div className="text-4xl font-bold">{avg.toFixed(2)}%</div></div>
  <div className="card mb-6 border-amber-500/40"><h2 className="font-semibold mb-2">Tips to improve</h2>{tips.length?<ul className="list-disc pl-5 space-y-1 text-sm">{tips.map(t=><li key={t}>{t}</li>)}</ul>:<p className="text-sm text-neutral-400">Nothing needs attention. Keep it up.</p>}</div>
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">{data.map(d=><div key={d.c.id} className="card"><div className="flex justify-between"><span className="font-medium">{d.c.name}</span><span style={{color:gColor(d.now)}} className="font-bold">{letter(d.now)}</span></div>
   <Spark v={d.series} color={d.c.color}/><div className={`text-sm ${d.change>=0?'text-green-400':'text-red-400'}`}>{d.change>=0?'+':''}{d.change.toFixed(2)} pts · {periods[per][0].toLowerCase()}</div></div>)}</div>
  <h2 className="font-semibold mb-3">Category health</h2><div className="space-y-2">{vis.flatMap(c=>c.cats.map(k=>({c,k,p:catPct(c,k.name)}))).sort((a,b)=>(a.p??101)-(b.p??101)).map(({c,k,p})=>
   <div key={c.id+k.name} className="card !py-2"><div className="flex justify-between text-sm"><span>{c.name} / {k.name} <span className="text-neutral-500">({k.w}% weight)</span></span><span style={{color:gColor(p)}}>{p?.toFixed(1)}%</span></div>
   <div className="h-1.5 bg-neutral-800 rounded mt-1"><div className="h-full rounded" style={{width:`${p??0}%`,background:gColor(p)}}/></div></div>)}</div></div>}
