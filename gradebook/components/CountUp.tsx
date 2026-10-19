'use client';
import {useEffect,useState} from 'react';
export default function CountUp({to,dec=0,suffix='',className=''}:{to:number;dec?:number;suffix?:string;className?:string}){
 const [v,setV]=useState(to);
 useEffect(()=>{if(document.documentElement.dataset.motion==='off'){setV(to);return}let raf=0;const t0=performance.now();
  const tick=(t:number)=>{const k=Math.min(1,(t-t0)/800);setV(to*(1-Math.pow(1-k,3)));if(k<1)raf=requestAnimationFrame(tick)};raf=requestAnimationFrame(tick);return()=>cancelAnimationFrame(raf)},[to]);
 return <span className={className}>{v.toFixed(dec)}{suffix}</span>}
