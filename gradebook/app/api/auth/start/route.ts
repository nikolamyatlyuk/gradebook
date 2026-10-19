import {NextRequest,NextResponse} from 'next/server';import {sgFetch,apiBase,appCreds,validDomain} from '@/lib/schoology/oauth';import {seal,RT_COOKIE} from '@/lib/session';
export const dynamic='force-dynamic';
export async function GET(req:NextRequest){
 const domain=validDomain(req.nextUrl.searchParams.get('domain')||'');
 if(!domain)return NextResponse.redirect(new URL('/login?error=domain',req.url));
 const r=await sgFetch(`${apiBase()}/oauth/request_token`,appCreds(),false);
 const p=new URLSearchParams(await r.text());const t=p.get('oauth_token'),ts=p.get('oauth_token_secret');
 if(!t||!ts)return NextResponse.redirect(new URL('/login?error=token',req.url));
 const cb=`${process.env.APP_URL||req.nextUrl.origin}/api/auth/callback`;
 const res=NextResponse.redirect(`https://${domain}/oauth/authorize?oauth_token=${encodeURIComponent(t)}&oauth_callback=${encodeURIComponent(cb)}`);
 res.cookies.set(RT_COOKIE,seal({t,ts,domain}),{httpOnly:true,secure:true,sameSite:'lax',maxAge:600,path:'/'});return res}
