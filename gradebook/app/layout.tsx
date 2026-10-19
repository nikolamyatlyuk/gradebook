import './globals.css';import {Provider} from '@/lib/store';import Shell from '@/components/Shell';
export const metadata={title:'Gradebook',description:'Grades that make sense'};
export default function L({children}:{children:React.ReactNode}){return <html lang="en"><body><Provider><Shell>{children}</Shell></Provider></body></html>}
