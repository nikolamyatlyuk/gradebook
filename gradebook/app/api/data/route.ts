import {NextRequest,NextResponse} from 'next/server';import {appCreds,AuthError} from '@/lib/schoology/oauth';import {loadAll} from '@/lib/schoology/load';import {unseal,Session,SESSION_COOKIE} from '@/lib/session';
export const dynamic='force-dynamic';
const H={'Cache-Control':'private, no-store'};
export async function GET(req:NextRequest){
 if(process.env.DATA_MODE!=='live')return NextResponse.json({mode:'mock'},{headers:H});
 const s=unseal<Session>(req.cookies.get(SESSION_COOKIE)?.value);
 if(!s)return NextResponse.json({mode:'live'},{status:401,headers:H});
 try{return NextResponse.json({mode:'live',...await loadAll({...appCreds(),token:s.tk,tokenSecret:s.ts},s.uid)},{headers:H})}
 catch(e){
  if(e instanceof AuthError){const r=NextResponse.json({mode:'live',reconnect:true},{status:401,headers:H});r.cookies.delete(SESSION_COOKIE);return r}
  return NextResponse.json({mode:'live',error:'Could not load your data from Schoology. Try again in a minute.'},{status:502,headers:H})}}
