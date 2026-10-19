'use client';
import {useState} from 'react';import Link from 'next/link';import {useParams} from 'next/navigation';
import {courses,assignments,grade,letter,gColor,isOverdue,fmt,pctOf} from '@/lib/data';import Bar from '@/components/Bar';import CountUp from '@/components/CountUp';
export default function ClassPage(){
 const {id}=useParams<{id:string}>();const [cat,setCat]=useState('all');
 const c=courses.find(x=>x.id===id);
 if(!c)return <div><Link href="/" className="text-neutral-400 hover:underline">← Grades</Link><p className="mt-4 text-neutral-400">Class not found.</p></div>;
 const mine=assignments.filter(a=>a.courseId===c.id);const g=grade(c,assignments);
 const graded=mine.filter(a=>a.score!==null);const earned=graded.reduce((t,a)=>t+a.score!,0),possible=graded.reduce((t,a)=>t+a.max,0);
 const rows=c.cats.map(k=>{const list=mine.filter(a=>a.category===k.name);const gl=list.filter(a=>a.score!==null);
  const e=gl.reduce((t,a)=>t+a.score!,0),m=gl.reduce((t,a)=>t+a.max,0);return{k,e,m,p:m?e/m*100:null,n:gl.length,total:list.length}});
 const wsum=rows.reduce((t,r)=>t+(r.p!==null?r.k.w:0),0);
 const list=mine.filter(a=>cat==='all'||a.category===cat).sort((a,b)=>+new Date(b.due)-+new Date(a.due));
 return <div><Link href="/" className="text-neutral-400 hover:underline text-sm">← Grades</Link>
  <div className="flex flex-wrap items-end justify-between gap-3 mt-2 mb-6"><div><h1 className="text-3xl font-bold">{c.name}</h1><div className="text-neutral-400">{c.code} · {graded.length} of {mine.length} assignments graded</div></div>
   <div className="text-right"><div className="text-4xl font-bold" style={{color:gColor(g)}}>{letter(g)}</div>{g!==null&&<div className="text-neutral-300"><CountUp to={g} dec={2} suffix="%"/> · {+earned.toFixed(1)}/{+possible.toFixed(1)} pts</div>}</div></div>
  <h2 className="font-semibold mb-3">Category grades</h2>
  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mb-8 stagger">{rows.map(({k,e,m,p,n,total})=><button key={k.name} onClick={()=>setCat(cat===k.name?'all':k.name)} className={`card lift text-left ${cat===k.name?'!border-[var(--accent)]':''}`}>
   <div className="flex justify-between"><span className="font-medium">{k.name}</span><span className="font-bold" style={{color:gColor(p)}}>{p===null?'–':p.toFixed(1)+'%'}</span></div>
   <div className="text-xs text-neutral-400 mb-2">{k.w}% of grade · {n}/{total} graded · {+e.toFixed(1)}/{+m.toFixed(1)} pts</div>
   <Bar pct={p??0} color={gColor(p)}/>
   {p!==null&&wsum>0&&<div className="text-xs text-neutral-500 mt-2">Adds {(p*k.w/wsum).toFixed(1)} of {(k.w/wsum*100).toFixed(0)} possible points to your grade</div>}</button>)}</div>
  <div className="flex flex-wrap items-center gap-2 mb-3"><h2 className="font-semibold mr-2">Assignments</h2>
   <button className={`chip ${cat==='all'?'on':''}`} onClick={()=>setCat('all')}>All</button>{c.cats.map(k=><button key={k.name} className={`chip ${cat===k.name?'on':''}`} onClick={()=>setCat(k.name)}>{k.name}</button>)}</div>
  <div className="space-y-2 stagger" key={cat}>{list.map(a=>{const p=pctOf(a);return <div key={a.id} className="card flex items-center justify-between !py-3"><div><div className="font-medium">{a.title}</div><div className="text-sm text-neutral-400">{a.category} · due {fmt(a.due)}</div></div>
   <div className="text-right"><div className="font-semibold" style={{color:gColor(p)}}>{p===null?(isOverdue(a)?'Missing':'Pending'):`${a.score}/${a.max}`}</div>{p!==null&&<div className="text-xs text-neutral-400">{p.toFixed(0)}%</div>}</div></div>})}
   {!list.length&&<p className="text-neutral-400">No assignments in this category.</p>}</div></div>}
