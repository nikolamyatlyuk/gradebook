export type Theme={mode:'dark'|'light'|'amoled'|'midnight';accent:string;radius:number;motion:boolean};
export const DEFAULT_THEME:Theme={mode:'dark',accent:'#6d8cff',radius:14,motion:true};
export const THEMES:[Theme['mode'],string][]=[['dark','Dark'],['light','Light'],['amoled','AMOLED black'],['midnight','Midnight']];
export const ACCENTS=['#6d8cff','#a07df0','#e5605f','#f0924a','#f0b84a','#5fd068','#3cc9b0','#ec6fb4'];
export function applyTheme(t:Theme){const r=document.documentElement;r.dataset.theme=t.mode;r.dataset.motion=t.motion?'on':'off';
 r.style.setProperty('--accent',t.accent);r.style.setProperty('--radius',t.radius+'px');
 const m=/^#([0-9a-f]{6})$/i.exec(t.accent);const v=m?parseInt(m[1],16):0x6d8cff;const L=(0.299*(v>>16)+0.587*((v>>8)&255)+0.114*(v&255))/255;
 r.style.setProperty('--on-accent',L>0.62?'#111':'#fff')}
