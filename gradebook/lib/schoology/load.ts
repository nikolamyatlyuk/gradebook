// Maps Schoology REST responses to the app's Course/Assignment types.
// NOTE: response shapes below follow Schoology's REST docs from memory and are NOT yet tested against a real account. Fix field names here if needed.
import {sgFetch,apiBase,Creds} from './oauth';import type {Course,Assignment,Kind} from '../data';
const J=async(p:string,c:Creds)=>(await sgFetch(`${apiBase()}/${p}`,c)).json();
const kindOf=(s:string):Kind=>/quiz/i.test(s)?'quiz':/test|exam|assessment/i.test(s)?'test':/project|essay|paper/i.test(s)?'project':/\blabs?\b/i.test(s)?'lab':'homework';
const COLORS=['#6d8cff','#a07df0','#f0924a','#3cc9b0','#e5605f','#5fd068','#f0b84a','#d07ad9'];
export async function loadAll(c:Creds,uid:string){
 const secs:any[]=(await J(`users/${uid}/sections`,c)).section??[];
 const gr=await J(`users/${uid}/grades`,c).catch(()=>({section:[]}));
 const gm=new Map<string,{grade:number|null;max:number}>();
 for(const s of gr.section??[])for(const g of s.grades??[])gm.set(String(g.assignment_id),{grade:g.grade===''||g.grade==null||g.exception?null:Number(g.grade),max:Number(g.max_points)||0});
 const out=await Promise.all(secs.map(async(s,i)=>{
  const sid=String(s.id);
  const [cats,asg]=await Promise.all([J(`sections/${sid}/grading_categories`,c).catch(()=>({})),J(`sections/${sid}/assignments?limit=200`,c).catch(()=>({}))]);
  const names=new Map<string,string>();
  const cs:Course['cats']=(cats.grading_category??[]).map((k:any)=>{names.set(String(k.id),k.title);return{name:String(k.title),w:Number(k.weight)||0,kind:kindOf(String(k.title))}});
  const as:Assignment[]=[];
  for(const a of asg.assignment??[]){
   if(!a.due)continue;const d=new Date(String(a.due).replace(' ','T'));if(isNaN(+d))continue;
   const g=gm.get(String(a.id));const max=g?.max||Number(a.max_points)||0;if(!max)continue;
   const cn=names.get(String(a.grading_category))??'Uncategorized';if(!cs.some(k=>k.name===cn))cs.push({name:cn,w:0,kind:kindOf(cn)});
   const due=d.toISOString();const score=g?.grade??null;
   // Schoology doesn't expose an "assigned" date here, so the due date stands in; "completed" is approximated by "has a grade".
   as.push({id:`${sid}-${a.id}`,courseId:sid,title:String(a.title),category:cn,kind:kindOf(`${cn} ${a.title}`),assigned:due,due,completed:score!==null?due:null,score,max})}
  if(cs.length&&cs.every(k=>k.w===0))cs.forEach(k=>{k.w=1}); // unweighted gradebook: weight categories equally
  const course:Course={id:sid,name:String(s.course_title||s.section_title),code:String(s.section_title||''),color:COLORS[i%COLORS.length],cats:cs};
  return{course,as}}));
 return{courses:out.map(o=>o.course),assignments:out.flatMap(o=>o.as)}}
