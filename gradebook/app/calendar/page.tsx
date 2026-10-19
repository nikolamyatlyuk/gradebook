'use client';
import {useState} from 'react';import {courses,assignments,Assignment,NOW,isOverdue} from '@/lib/data';import {useStore} from '@/lib/store';
const filters:Record<string,[string,(a:Assignment)=>boolean]>={all:['All due',()=>true],quiz:['Quizzes',a=>a.kind==='quiz'],test:['Tests',a=>a.kind==='test'],project:['Projects',a=>a.kind==='project'],lab:['Labs',a=>a.kind==='lab'],homework:['Homework',a=>a.kind==='homework'],overdue:['Overdue',isOverdue],done:['Completed',a=>!!a.completed]};
export default function Cal(){
 const {s}=useStore();const [f,setF]=useState('all');const [off,setOff]=useState(0);
 const m=new Date(NOW.getFullYear(),NOW.getMonth()+off,1);const ws=s.settings.weekStart;
 const lead=(m.getDay()-ws+7)%7;const dim=new Date(m.getFullYear(),m.getMonth()+1,0).getDate();
 const cells=Array.from({length:Math.ceil((lead+dim)/7)*7},(_,i)=>i-lead+1);
 const items=(d:number)=>assignments.filter(a=>{const x=new Date(a.due);return !s.hidden.includes(a.courseId)&&filters[f][1](a)&&x.getFullYear()===m.getFullYear()&&x.getMonth()===m.getMonth()&&x.getDate()===d});
 const days=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];const hd=[...days.slice(ws),...days.slice(0,ws)];
 return <div><div className="flex items-center justify-between mb-4"><h1 className="text-3xl font-bold">Calendar</h1>
  <div className="flex items-center gap-2"><button className="btn" onClick={()=>setOff(off-1)}>Prev</button><span className="w-36 text-center">{m.toLocaleDateString('en-US',{month:'long',year:'numeric'})}</span><button className="btn" onClick={()=>setOff(off+1)}>Next</button></div></div>
  <div className="flex flex-wrap gap-2 mb-4">{Object.entries(filters).map(([k,[l]])=><button key={k} className={`chip ${f===k?'on':''}`} onClick={()=>setF(k)}>{l}</button>)}</div>
  <div key={off+f} className="grid grid-cols-7 gap-1 text-sm page-in">{hd.map(d=><div key={d} className="text-neutral-400 px-1">{d}</div>)}
   {cells.map((d,i)=><div key={i} className={`min-h-24 rounded-lg p-1 ${d>0&&d<=dim?'bg-neutral-900 border border-neutral-800':''}`}>{d>0&&d<=dim&&<><div className={`text-xs mb-1 ${off===0&&d===NOW.getDate()?'text-blue-400 font-bold':'text-neutral-500'}`}>{d}</div>
    {items(d).map(a=>{const c=courses.find(c=>c.id===a.courseId)!;return <div key={a.id} className="truncate rounded px-1 mb-0.5 text-xs" style={{background:c.color+'33',borderLeft:`3px solid ${c.color}`}} title={`${a.title} (${c.name})`}>{a.title}</div>})}</>}</div>)}</div></div>}
