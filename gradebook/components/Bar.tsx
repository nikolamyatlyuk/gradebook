'use client';
import {useEffect,useState} from 'react';
export default function Bar({pct,color,h='h-1.5'}:{pct:number;color:string;h?:string}){
 const [w,setW]=useState(0);useEffect(()=>{const t=setTimeout(()=>setW(Math.max(0,Math.min(100,pct))),40);return()=>clearTimeout(t)},[pct]);
 return <div className={`${h} rounded-full bg-neutral-800 overflow-hidden`}><div className="h-full rounded-full bar-fill" style={{width:`${w}%`,background:color}}/></div>}
