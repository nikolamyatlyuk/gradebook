'use client';
import {useState} from 'react';import {courses,assignments,Assignment,isOverdue,fmt,pctOf,gColor} from '@/lib/data';import {useStore} from '@/lib/store';
const cn=(a:Assignment)=>courses.find(c=>c.id===a.courseId)!.name;const t=(d:string|null)=>d?+new Date(d):0;
const sorts:Record<string,[string,(a:Assignment,b:Assignment)=>number]>={
 'due-asc':['Due date (soonest)',(a,b)=>t(a.due)-t(b.due)],'due-desc':['Due date (latest)',(a,b)=>t(b.due)-t(a.due)],
 'asg-desc':['Date assigned (newest)',(a,b)=>t(b.assigned)-t(a.assigned)],'asg-asc':['Date assigned (oldest)',(a,b)=>t(a.assigned)-t(b.assigned)],
 'done-desc':['Date completed (newest)',(a,b)=>t(b.completed)-t(a.completed)],
 'complete':['Complete first',(a,b)=>+!!b.completed-+!!a.completed],'incomplete':['Incomplete first',(a,b)=>+!!a.completed-+!!b.completed],
 'grade-desc':['Grade (high to low)',(a,b)=>(pctOf(b)??-1)-(pctOf(a)??-1)],'grade-asc':['Grade (low to high)',(a,b)=>(pctOf(a)??999)-(pctOf(b)??999)],
 'class':['Class',(a,b)=>cn(a).localeCompare(cn(b))],'category':['Category',(a,b)=>a.category.localeCompare(b.category)],'title':['Title (A-Z)',(a,b)=>a.title.localeCompare(b.title)]};
export default function Page(){
 const {s}=useStore();const [sort,setSort]=useState(s.settings.defaultSort in sorts?s.settings.defaultSort:'due-asc');const [q,setQ]=useState('');
 const rows=assignments.filter(a=>!s.hidden.includes(a.courseId)&&(a.title+cn(a)).toLowerCase().includes(q.toLowerCase())).sort(sorts[sort][1]);
 return <div><h1 className="text-3xl font-bold mb-4">Assignments</h1>
  <div className="flex flex-wrap gap-3 mb-4"><input placeholder="Search assignments" value={q} onChange={e=>setQ(e.target.value)}/>
   <label className="flex items-center gap-2 text-sm text-neutral-400">Sort by<select value={sort} onChange={e=>setSort(e.target.value)}>{Object.entries(sorts).map(([k,[l]])=><option key={k} value={k}>{l}</option>)}</select></label></div>
  <div className="space-y-2 stagger">{rows.map(a=>{const p=pctOf(a);return <div key={a.id} className="card flex items-center justify-between !py-3">
   <div><div className="font-medium">{a.title}</div><div className="text-sm text-neutral-400">{cn(a)} / {a.category} · assigned {fmt(a.assigned)} · due {fmt(a.due)}{a.completed&&` · completed ${fmt(a.completed)}`}</div></div>
   <div className="text-right"><div style={{color:gColor(p)}} className="font-semibold">{p===null?(isOverdue(a)?'Missing':'Pending'):`${a.score}/${a.max}`}</div>{p!==null&&<div className="text-xs text-neutral-400">{p.toFixed(0)}%</div>}</div></div>})}
  {!rows.length&&<p className="text-neutral-400">No assignments match your search.</p>}</div></div>}
