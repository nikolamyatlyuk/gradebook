import {NextRequest,NextResponse} from 'next/server';import {sgFetch,apiBase,appCreds} from '@/lib/schoology/oauth';import {seal,unseal,Session,SESSION_COOKIE,RT_COOKIE,SESSION_MAX_AGE} from '@/lib/session';
export const dynamic='force-dynamic';
export async function GET(req:NextRequest){
 const rt=unseal<{t:string;ts:string;domain:string}>(req.cookies.get(RT_COOKIE)?.value);
 if(!rt||req.nextUrl.searchParams.get('oauth_token')!==rt.t)return NextResponse.redirect(new URL('/login?error=state',req.url));
 try{
  const base=appCreds();
  const a=new URLSearchParams(await (await sgFetch(`${apiBase()}/oauth/access_token`,{...base,token:rt.t,tokenSecret:rt.ts},false)).text());
  const tk=a.get('oauth_token'),ts=a.get('oauth_token_secret');if(!tk||!ts)throw new Error('no access token');
  const me=await (await sgFetch(`${apiBase()}/users/me`,{...base,token:tk,tokenSecret:ts})).json();
  const s:Session={tk,ts,uid:String(me.uid??me.id),domain:rt.domain};
  const res=NextResponse.redirect(new URL('/',req.url));
  res.cookies.set(SESSION_COOKIE,seal(s),{httpOnly:true,secure:true,sameSite:'lax',maxAge:SESSION_MAX_AGE,path:'/'});res.cookies.delete(RT_COOKIE);return res
 }catch{return NextResponse.redirect(new URL('/login?error=denied',req.url))}}
