import {NextRequest,NextResponse} from 'next/server';import list from '@/data/schools.json';
export const dynamic='force-dynamic';
type E={name:string;city?:string;state?:string;domain?:string;demo?:boolean};
// Schoology has no public "find a school" endpoint, so this searches our own directory (data/schools.json).
export async function GET(req:NextRequest){
 const live=process.env.DATA_MODE==='live';const q=(req.nextUrl.searchParams.get('q')||'').toLowerCase().trim().slice(0,80);const toks=q.split(/\s+/).filter(Boolean);
 const pool=(list as unknown as E[]).filter(e=>live?!e.demo&&!!e.domain:!!e.demo);
 const scored=pool.map(e=>{const h=`${e.name} ${e.city??''} ${e.state??''}`.toLowerCase();if(!toks.every(t=>h.includes(t)))return null;
  const n=e.name.toLowerCase();return{e,s:(n.startsWith(q)?3:0)+toks.filter(t=>n.split(' ').some(w=>w.startsWith(t))).length}}).filter(Boolean) as {e:E;s:number}[];
 scored.sort((a,b)=>b.s-a.s||a.e.name.localeCompare(b.e.name));
 return NextResponse.json({schools:scored.slice(0,8).map(({e},i)=>({id:`${i}-${e.name}`,name:e.name,city:e.city,state:e.state,domain:e.domain}))},{headers:{'Cache-Control':'private, max-age=60'}})}
