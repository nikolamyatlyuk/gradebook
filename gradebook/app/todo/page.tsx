'use client';
import {courses,assignments,Assignment,NOW,isOverdue,fmt} from '@/lib/data';import {useStore} from '@/lib/store';
export default function Todo(){
 const {s,set}=useStore();const vis=assignments.filter(a=>!s.hidden.includes(a.courseId));
 const pending=vis.filter(a=>a.score===null&&!a.completed);const same=(a:Assignment)=>new Date(a.due).toDateString()===NOW.toDateString();
 const groups:[string,Assignment[]][]=[['Overdue',pending.filter(isOverdue)],['Due today',pending.filter(same)],['Upcoming',pending.filter(a=>!isOverdue(a)&&!same(a)&&+new Date(a.due)<=+NOW+14*864e5)]];
 const row=(a:Assignment)=>{const fin=!!s.finished[a.id];return <label key={a.id} className={`card flex items-center gap-3 !py-3 cursor-pointer ${fin?'opacity-60':''}`}>
  <input type="checkbox" checked={fin} onChange={()=>set(p=>({...p,finished:{...p.finished,[a.id]:!p.finished[a.id]}}))}/>
  <div className="flex-1"><div className={fin?'line-through':''}>{a.title}</div><div className="text-sm text-neutral-400">{courses.find(c=>c.id===a.courseId)!.name} / {a.category}</div></div>
  <div className="text-right text-sm"><div className={isOverdue(a)?'text-red-400':''}>{fmt(a.due)}</div>{fin&&<div className="text-amber-400">Finished, not turned in</div>}</div></label>};
 return <div><h1 className="text-3xl font-bold mb-1">To-do / Overdue</h1><p className="text-neutral-400 mb-5 text-sm">Check an item when it's finished but not turned in yet.</p>
  <div className="grid gap-6 md:grid-cols-2">{groups.map(([t,l])=><div key={t}><h2 className="font-semibold mb-2">{t} ({l.length})</h2><div className="space-y-2">{l.map(row)}{!l.length&&<p className="text-neutral-500 text-sm">Nothing here.</p>}</div></div>)}</div></div>}
