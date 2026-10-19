import {NextResponse} from 'next/server';import {SESSION_COOKIE} from '@/lib/session';
export async function POST(){const r=NextResponse.json({ok:true});r.cookies.delete(SESSION_COOKIE);return r}
