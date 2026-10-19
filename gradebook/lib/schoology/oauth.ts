import crypto from 'crypto';
const enc=(s:string)=>encodeURIComponent(s).replace(/[!'()*]/g,c=>'%'+c.charCodeAt(0).toString(16).toUpperCase());
export type Creds={key:string;secret:string;token?:string;tokenSecret?:string};
export class AuthError extends Error{}
export const apiBase=()=>process.env.SCHOOLOGY_API_BASE||'https://api.schoology.com/v1';
export const appCreds=():Creds=>{const key=process.env.SCHOOLOGY_CONSUMER_KEY,secret=process.env.SCHOOLOGY_CONSUMER_SECRET;if(!key||!secret)throw new Error('Set SCHOOLOGY_CONSUMER_KEY and SCHOOLOGY_CONSUMER_SECRET');return{key,secret}};
// Only send users to real Schoology hosts (prevents open redirects). Add custom district domains via SCHOOLOGY_EXTRA_DOMAINS (comma separated).
export const validDomain=(d:string)=>{const h=d.trim().toLowerCase().replace(/^https?:\/\//,'').replace(/\/.*$/,'');
 const extra=(process.env.SCHOOLOGY_EXTRA_DOMAINS||'').split(',').map(x=>x.trim().toLowerCase()).filter(Boolean);
 return (/^[a-z0-9-]+(\.[a-z0-9-]+)*\.schoology\.com$/.test(h)||extra.includes(h))?h:null};
function authHeader(method:string,url:string,c:Creds){
 const u=new URL(url);
 const p:Record<string,string>={oauth_consumer_key:c.key,oauth_nonce:crypto.randomBytes(12).toString('hex'),oauth_timestamp:String(Math.floor(Date.now()/1000)),oauth_signature_method:'HMAC-SHA1',oauth_version:'1.0',oauth_token:c.token||''};
 const all:[string,string][]=[...Object.entries(p),...Array.from(u.searchParams.entries())];
 const norm=all.map(([k,v])=>[enc(k),enc(v)]).sort((a,b)=>a[0]<b[0]?-1:a[0]>b[0]?1:a[1]<b[1]?-1:a[1]>b[1]?1:0).map(([k,v])=>`${k}=${v}`).join('&');
 const base=[method,enc(u.origin+u.pathname),enc(norm)].join('&');
 const sig=crypto.createHmac('sha1',`${enc(c.secret)}&${enc(c.tokenSecret||'')}`).update(base).digest('base64');
 return 'OAuth realm="Schoology API", '+Object.entries({...p,oauth_signature:sig}).map(([k,v])=>`${k}="${enc(v)}"`).join(', ');}
// Redirects (e.g. users/me) are followed manually: every hop needs a fresh nonce/timestamp, per Schoology's docs.
export async function sgFetch(url:string,c:Creds,json=true){
 for(let i=0;i<4;i++){
  const r=await fetch(url,{method:'GET',headers:{Authorization:authHeader('GET',url,c),...(json?{Accept:'application/json'}:{})},redirect:'manual',cache:'no-store'});
  if(r.status>=300&&r.status<400){const loc=r.headers.get('location');if(!loc)throw new Error('Redirect without location');url=new URL(loc,url).toString();continue}
  if(r.status===401)throw new AuthError('Schoology rejected the credentials (expired token or app not approved)');
  if(!r.ok)throw new Error(`Schoology error ${r.status}`);
  return r}
 throw new Error('Too many redirects')}
