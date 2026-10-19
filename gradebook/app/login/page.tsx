'use client';
import {useEffect,useState} from 'react';import {useRouter} from 'next/navigation';import {useStore} from '@/lib/store';import Logo from '@/components/Logo';
type School={id:string;name:string;city?:string;state?:string;domain?:string};
const errs:Record<string,string>={domain:'That address is not a Schoology site. It should end in schoology.com.',token:'Schoology did not return a login token. Try again.',state:'The login session expired. Start again.',denied:'Schoology did not approve the connection. Check that you allowed access, then try again.'};
export default function Login(){
 const {set,mode,error}=useStore();const r=useRouter();
 const [q,setQ]=useState('');const [res,setRes]=useState<School[]|null>(null);const [pick,setPick]=useState<School|null>(null);const [manual,setManual]=useState(false);const [addr,setAddr]=useState('');
 const e=typeof window!=='undefined'?new URLSearchParams(location.search).get('error'):null;const msg=(e&&errs[e])||error;
 useEffect(()=>{if(mode==='loading')return;const ac=new AbortController();
  const t=setTimeout(()=>fetch('/api/schools?q='+encodeURIComponent(q),{signal:ac.signal}).then(x=>x.json()).then(j=>setRes(j.schools)).catch(()=>{}),q?250:0);
  return()=>{clearTimeout(t);ac.abort()}},[q,mode]);
 if(mode==='loading')return null;
 const live=mode==='live';const domain=manual?addr.trim():pick?.domain;const can=live?!!domain:!!pick;
 const go=()=>{if(live)location.href='/api/auth/start?domain='+encodeURIComponent(domain!);else{set(p=>({...p,school:pick!.name}));r.push('/')}};
 return <div className="min-h-screen grid place-items-center p-5"><div className="card page-in w-full max-w-md !p-6">
  <div className="flex items-center gap-3 mb-1"><Logo s={44}/><h1 className="text-3xl font-bold">Gradebook</h1></div>
  <p className="text-neutral-400 mb-5">Find your school, then sign in with Schoology.</p>
  {msg&&<p className="text-red-400 text-sm mb-3">{msg}</p>}
  {!manual&&<><input className="w-full mb-3" placeholder="Search for your school" value={q} onChange={ev=>{setQ(ev.target.value);setPick(null)}} autoFocus/>
  <div className="space-y-2 mb-3 stagger">{res===null?[0,1,2].map(i=><div key={i} className="shimmer h-12 rounded-xl"/>):res.map(x=>
   <button key={x.id} onClick={()=>setPick(x)} className={`card lift w-full text-left !py-3 ${pick?.id===x.id?'!border-[var(--accent)]':''}`}><div className="font-medium">{x.name}</div>{(x.city||x.state)&&<div className="text-xs text-neutral-400">{[x.city,x.state].filter(Boolean).join(', ')}</div>}</button>)}
   {res&&!res.length&&<p className="text-neutral-500 text-sm">No schools match{live?' our directory yet':''}.</p>}</div></>}
  {manual&&<><input className="w-full mb-3" placeholder="app.schoology.com or yourschool.schoology.com" value={addr} onChange={ev=>setAddr(ev.target.value)} autoFocus/><p className="text-xs text-neutral-500 mb-3">This is the address you see when you log in to Schoology in your browser.</p></>}
  <button disabled={!can} onClick={go} className="btn btn-primary w-full disabled:opacity-40">Continue with Schoology</button>
  {live&&<button className="text-sm text-neutral-400 hover:underline mt-3" onClick={()=>{setManual(!manual);setPick(null)}}>{manual?'Search for my school instead':"My school isn't listed"}</button>}
  <p className="text-xs text-neutral-500 mt-4">{live?'You sign in on Schoology, where your school Google sign-in happens. We never see your password.':'Demo mode: sample data.'}</p></div></div>}
