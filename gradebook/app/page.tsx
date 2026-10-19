'use client';
import {useState} from 'react';import {useRouter} from 'next/navigation';import CountUp from '@/components/CountUp';import {courses,assignments,grade,letter,gColor} from '@/lib/data';import {useStore} from '@/lib/store';
export default function Grades(){
 const {s,set}=useStore();const r=useRouter();const [showHidden,setSH]=useState(false);
 const list=courses.filter(c=>showHidden||!s.hidden.includes(c.id));
 const toggle=(id:string)=>set(p=>({...p,hidden:p.hidden.includes(id)?p.hidden.filter(x=>x!==id):[...p.hidden,id]}));
 return <div><div className="flex items-center justify-between mb-6"><h1 className="text-3xl font-bold">Grades</h1>
  {s.hidden.length>0&&<button className="btn" onClick={()=>setSH(!showHidden)}>{showHidden?'Hide':'Show'} hidden classes ({s.hidden.length})</button>}</div>
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 stagger">{list.map(c=>{const g=grade(c,assignments);const h=s.hidden.includes(c.id);
   return <div key={c.id} role="link" tabIndex={0} onClick={()=>r.push('/class/'+c.id)} onKeyDown={e=>{if(e.key==='Enter')r.push('/class/'+c.id)}} className={`card lift cursor-pointer ${h?'opacity-50':''}`}><div className="flex justify-between"><div><div className="font-semibold">{c.name} - {c.code}</div>
    <div className="text-sm text-neutral-400">{c.cats.length} categories · {assignments.filter(a=>a.courseId===c.id).length} assignments</div></div>
    <div className="text-3xl font-bold" style={{color:gColor(g)}}>{letter(g)}</div></div>
    <div className="flex justify-between items-end mt-4"><button className="btn text-sm" onClick={e=>{e.stopPropagation();toggle(c.id)}}>{h?'Unhide':'Hide class'}</button>
    {s.settings.showPct&&<CountUp to={g??0} dec={2} suffix="%" className="text-neutral-300"/>}</div></div>})}</div>
  {!list.length&&<p className="text-neutral-400">All classes are hidden. Use "Show hidden classes" to bring them back.</p>}</div>}
