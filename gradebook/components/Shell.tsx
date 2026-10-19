'use client';
import Link from 'next/link';import {usePathname,useRouter} from 'next/navigation';import {useEffect,ReactNode} from 'react';import {useStore} from '@/lib/store';
const nav=[['/','Grades'],['/assignments','Assignments'],['/calendar','Calendar'],['/todo','To-do / Overdue'],['/analytics','Analytics'],['/settings','Settings']];
export default function Shell({children}:{children:ReactNode}){
 const {ready,authed}=useStore();const p=usePathname();const r=useRouter();
 useEffect(()=>{if(ready&&!authed&&p!=='/login')r.replace('/login')},[ready,authed,p,r]);
 if(p==='/login')return <>{children}</>;if(!ready||!authed)return null;
 return <div className="min-h-screen md:flex"><aside className="md:w-60 md:min-h-screen p-4 border-b md:border-r border-neutral-800 flex md:block gap-2 overflow-x-auto">
  <div className="hidden md:block text-xl font-bold mb-6">Gradebook</div>
  {nav.map(([h,l])=><Link key={h} href={h} className={`block px-3 py-2 rounded-lg whitespace-nowrap ${p===h?'bg-neutral-800':'text-neutral-400 hover:bg-neutral-900'}`}>{l}</Link>)}
 </aside><main className="flex-1 p-5 md:p-8 max-w-6xl">{children}</main></div>}
