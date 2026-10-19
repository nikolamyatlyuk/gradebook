export type Kind='homework'|'quiz'|'test'|'project'|'lab';
export type Course={id:string;name:string;code:string;color:string;cats:{name:string;w:number;kind:Kind}[]};
export type Assignment={id:string;courseId:string;title:string;category:string;kind:Kind;assigned:string;due:string;completed:string|null;score:number|null;max:number};
export const NOW=new Date('2026-10-19T12:00:00');
const day=(n:number)=>new Date(NOW.getTime()+n*864e5).toISOString();
export const courses:Course[]=[
{id:'alg',name:'Algebra 2',code:'2310',color:'#6d8cff',cats:[{name:'Homework',w:30,kind:'homework'},{name:'Quizzes',w:30,kind:'quiz'},{name:'Tests',w:40,kind:'test'}]},
{id:'bio',name:'Biology',code:'3110',color:'#a07df0',cats:[{name:'Homework',w:20,kind:'homework'},{name:'Labs',w:30,kind:'lab'},{name:'Tests',w:50,kind:'test'}]},
{id:'cul',name:'Culinary Arts 1',code:'5710',color:'#f0924a',cats:[{name:'Cooking Labs',w:50,kind:'lab'},{name:'Classwork',w:50,kind:'homework'}]},
{id:'jap',name:'Japanese 1',code:'4010',color:'#3cc9b0',cats:[{name:'Assignments',w:100,kind:'homework'}]},
{id:'lit',name:'Lit/Writ',code:'1010',color:'#e5605f',cats:[{name:'Quizzes',w:30,kind:'quiz'},{name:'Essays',w:50,kind:'project'},{name:'Activities',w:20,kind:'homework'}]},
{id:'pe',name:'PE 9',code:'2510',color:'#5fd068',cats:[{name:'Cardio',w:50,kind:'lab'},{name:'Participation',w:50,kind:'homework'}]}];
let s=7;const rnd=()=>{s=(s*16807)%2147483647;return s/2147483647};
export const assignments:Assignment[]=courses.flatMap(c=>Array.from({length:14},(_,i)=>{
 const cat=c.cats[i%c.cats.length];const due=-62+i*5+Math.floor(rnd()*3);const max=cat.kind==='test'?50:cat.kind==='quiz'?20:10;
 const past=due<0;const missing=past&&rnd()<(c.id==='lit'?.3:.07);
 const base=c.id==='lit'?.68:c.id==='bio'?.86:.93;
 return{id:`${c.id}${i}`,courseId:c.id,title:cat.kind==='test'?`Ch ${i+1} Test`:`${cat.name} ${i+1}`,category:cat.name,kind:cat.kind,
  assigned:day(due-6),due:day(due),completed:past&&!missing?day(due-1):null,score:past&&!missing?Math.round(max*Math.min(1,base+(rnd()-.5)*.25)*10)/10:null,max}}));
export const schools=['Fauquier High School','Liberty High School','Kettle Run High School','Brentsville District High School','Osbourn Park High School','Woodgrove High School','Heritage High School'];
export const isOverdue=(a:Assignment)=>a.score===null&&!a.completed&&+new Date(a.due)<+NOW;
export const eff=(a:Assignment)=>a.score!==null?a.score:isOverdue(a)?0:null;
export function grade(c:Course,list:Assignment[],fill=false){let t=0,wsum=0;
 for(const cat of c.cats){let g=0,m=0;for(const a of list)if(a.courseId===c.id&&a.category===cat.name){const e=fill&&isOverdue(a)?a.max:eff(a);if(e!==null){g+=e;m+=a.max}}
  if(m){t+=cat.w*g/m;wsum+=cat.w}}return wsum?t/wsum*100:null}
export const catPct=(c:Course,cat:string)=>{let g=0,m=0;for(const a of assignments)if(a.courseId===c.id&&a.category===cat){const e=eff(a);if(e!==null){g+=e;m+=a.max}}return m?g/m*100:null};
export const letter=(p:number|null)=>p===null?'–':p>=97?'A+':p>=93?'A':p>=90?'A-':p>=87?'B+':p>=83?'B':p>=80?'B-':p>=77?'C+':p>=73?'C':p>=70?'C-':p>=60?'D':'F';
export const gColor=(p:number|null)=>p===null?'#999':p>=90?'#5fd068':p>=80?'#6d8cff':p>=70?'#f0b84a':p>=60?'#f0924a':'#e5605f';
export const fmt=(d:string)=>new Date(d).toLocaleDateString('en-US',{month:'short',day:'numeric'});
export const pctOf=(a:Assignment)=>a.score===null?null:a.score/a.max*100;
// Live mode: swap the arrays in place so every page sees the new data (and use the real current time).
export const setData=(c:Course[],a:Assignment[])=>{courses.splice(0,courses.length,...c);assignments.splice(0,assignments.length,...a);NOW.setTime(Date.now())};
