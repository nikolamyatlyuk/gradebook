'use client';
import {useState} from 'react';import {useRouter} from 'next/navigation';import {schools} from '@/lib/data';import {useStore} from '@/lib/store';
const errs:Record<string,string>={domain:'That address is not a Schoology site. It should end in schoology.com.',token:'Schoology did not return a login token. Try again.',state:'The login session expired. Start again.',denied:'Schoology did not approve the connection. Check that you allowed access, then try again.'};
export default function Login(){
 const [q,setQ]=useState('');const [pick,setPick]=useState<string|null>(null);const {set,mode,error}=useStore();const r=useRouter();const e=typeof window!=='undefined'?new URLSearchParams(location.search).get('error'):null;
 if(mode==='loading')return null;
 const msg=(e&&errs[e])||error;
 if(mode==='live')return <div className="max-w-md mx-auto mt-24 p-5"><h1 className="text-3xl font-bold mb-1">Gradebook</h1><p className="text-neutral-400 mb-6">Enter your school's Schoology address, then sign in with your school account.</p>
  {msg&&<p className="text-red-400 text-sm mb-3">{msg}</p>}
  <form onSubmit={ev=>{ev.preventDefault();location.href='/api/auth/start?domain='+encodeURIComponent(q.trim())}}>
  <input className="w-full mb-3" placeholder="app.schoology.com or yourschool.schoology.com" value={q} onChange={ev=>setQ(ev.target.value)}/>
  <button type="submit" disabled={!q.trim()} className="btn w-full disabled:opacity-40">Continue with Schoology</button></form>
  <p className="text-xs text-neutral-500 mt-3">You sign in on Schoology, where your school Google sign-in happens. We never see your password.</p></div>;
 const res=schools.filter(x=>x.toLowerCase().includes(q.toLowerCase()));
 return <div className="max-w-md mx-auto mt-24 p-5"><h1 className="text-3xl font-bold mb-1">Gradebook</h1><p className="text-neutral-400 mb-6">Find your school, then sign in with Schoology.</p>
  <input className="w-full mb-3" placeholder="Search for your school" value={q} onChange={ev=>{setQ(ev.target.value);setPick(null)}}/>
  <div className="space-y-2 mb-5">{res.map(x=><button key={x} onClick={()=>setPick(x)} className={`card w-full text-left ${pick===x?'!border-white':''}`}>{x}</button>)}{!res.length&&<p className="text-neutral-500">No schools match. Check the spelling.</p>}</div>
  <button disabled={!pick} className="btn w-full disabled:opacity-40" onClick={()=>{set(p=>({...p,school:pick}));r.push('/')}}>Continue with Schoology</button>
  <p className="text-xs text-neutral-500 mt-3">Demo mode: sample data.</p></div>}
