'use client';
import {useRouter} from 'next/navigation';import {courses} from '@/lib/data';import {useStore} from '@/lib/store';
export default function Settings(){
 const {s,set,mode}=useStore();const r=useRouter();const up=(k:string,v:unknown)=>set(p=>({...p,settings:{...p.settings,[k]:v}}));
 return <div className="max-w-xl"><h1 className="text-3xl font-bold mb-6">Settings</h1><div className="space-y-4">
  <div className="card"><div className="text-sm text-neutral-400">School</div><div>{mode==='live'?'Connected to Schoology':s.school}</div></div>
  <label className="card flex justify-between items-center">Show percentages on grade cards<input type="checkbox" checked={s.settings.showPct} onChange={e=>up('showPct',e.target.checked)}/></label>
  <label className="card flex justify-between items-center">Week starts on<select value={s.settings.weekStart} onChange={e=>up('weekStart',+e.target.value)}><option value={0}>Sunday</option><option value={1}>Monday</option></select></label>
  <label className="card flex justify-between items-center">Flag grades below (%)<input type="number" className="w-20" min={50} max={100} value={s.settings.lowThreshold} onChange={e=>up('lowThreshold',+e.target.value)}/></label>
  <div className="card"><div className="mb-2">Hidden classes</div>{courses.map(c=><label key={c.id} className="flex justify-between py-1 text-sm">{c.name}<input type="checkbox" checked={s.hidden.includes(c.id)} onChange={()=>set(p=>({...p,hidden:p.hidden.includes(c.id)?p.hidden.filter(x=>x!==c.id):[...p.hidden,c.id]}))}/></label>)}</div>
  <button className="btn" onClick={()=>{set(p=>({...p,school:null}));if(mode==='live')fetch('/api/auth/logout',{method:'POST'}).finally(()=>{location.href='/login'});else r.push('/login')}}>Log out</button></div></div>}
