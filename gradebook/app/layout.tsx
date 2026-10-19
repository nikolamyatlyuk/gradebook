import './globals.css';import {Provider} from '@/lib/store';import Shell from '@/components/Shell';
export const metadata={title:'Gradebook',description:'Grades that make sense'};
const boot=`try{var t=JSON.parse(localStorage.getItem('sb')||'{}').theme;if(t){var r=document.documentElement;r.dataset.theme=t.mode;r.dataset.motion=t.motion===false?'off':'on';r.style.setProperty('--accent',t.accent);r.style.setProperty('--radius',t.radius+'px')}}catch(e){}`;
export default function L({children}:{children:React.ReactNode}){return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:boot}}/></head><body><Provider><Shell>{children}</Shell></Provider></body></html>}
