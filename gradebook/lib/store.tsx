'use client';
import {createContext,useContext,useEffect,useState,ReactNode} from 'react';import {setData} from './data';
type S={school:string|null;hidden:string[];finished:Record<string,boolean>;settings:{weekStart:0|1;showPct:boolean;lowThreshold:number;defaultSort:string}};
const init:S={school:null,hidden:[],finished:{},settings:{weekStart:0,showPct:true,lowThreshold:80,defaultSort:'due-asc'}};
type Mode='loading'|'mock'|'live';
const Ctx=createContext<{s:S;set:(f:(p:S)=>S)=>void;ready:boolean;mode:Mode;authed:boolean;error:string|null}>({s:init,set:()=>{},ready:false,mode:'loading',authed:false,error:null});
export const useStore=()=>useContext(Ctx);
export function Provider({children}:{children:ReactNode}){
 const [s,setS]=useState(init);const [ready,setReady]=useState(false);const [mode,setMode]=useState<Mode>('loading');const [live,setLive]=useState(false);const [error,setError]=useState<string|null>(null);
 useEffect(()=>{try{const v=localStorage.getItem('sb');if(v)setS({...init,...JSON.parse(v)})}catch{}
  fetch('/api/data',{cache:'no-store'}).then(async r=>{const j=await r.json().catch(()=>({}));
   if(j.mode==='live'){if(r.ok){setData(j.courses,j.assignments);setLive(true)}else if(j.reconnect)setError('Your Schoology connection expired. Log in again.');else if(j.error)setError(j.error);setMode('live')}else setMode('mock')
  }).catch(()=>setMode('mock')).finally(()=>setReady(true))},[]);
 const set=(f:(p:S)=>S)=>setS(p=>{const n=f(p);try{localStorage.setItem('sb',JSON.stringify(n))}catch{}return n});
 return <Ctx.Provider value={{s,set,ready,mode,authed:mode==='live'?live:!!s.school,error}}>{children}</Ctx.Provider>}
