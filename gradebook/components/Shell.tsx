'use client';
import Link from 'next/link';import {usePathname,useRouter} from 'next/navigation';import {useEffect,ReactNode} from 'react';import {useStore} from '@/lib/store';import Logo from './Logo';
const nav=[['/','Grades'],['/assignments','Assignments'],['/calendar','Calendar'],['/todo','To-do / Overdue'],['/analytics','Analytics'],['/settings','Settings']];
export default function Shell({children}:{children:ReactNode}){
 const {ready,authed}=useStore();const p=usePathname();const r=useRouter();
 useEffect(()=>{if(ready&&!authed&&p!=='/login')r.replace('/login')},[ready,authed,p,r]);
 if(p==='/login')return <>{children}</>;
 if(!ready||!authed)return <div className="min-h-screen grid place-items-center"><div className="animate-pulse"><Logo s={52}/></div></div>;
 return <div className="min-h-screen md:flex"><aside className="md:w-60 md:shrink-0 md:sticky md:top-0 md:h-screen p-4 border-b md:border-r border-neutral-800 flex md:block gap-1 overflow-x-auto">
  <div className="hidden md:flex items-center gap-3 mb-6"><Logo/><span className="text-xl font-bold">Gradebook</span></div>
  {nav.map(([h,l])=><Link key={h} href={h} className={`nav-item ${p===h?'active':''}`}>{l}</Link>)}</aside>
  <main className="flex-1 min-w-0 p-5 md:p-8 max-w-6xl"><div key={p} className="page-in">{children}</div></main></div>}
