import crypto from 'crypto';
const key=()=>{const s=process.env.SESSION_SECRET;if(!s||s.length<32)throw new Error('SESSION_SECRET must be set (32+ characters)');return crypto.createHash('sha256').update(s).digest()};
export const seal=(o:unknown)=>{const iv=crypto.randomBytes(12);const c=crypto.createCipheriv('aes-256-gcm',key(),iv);const e=Buffer.concat([c.update(JSON.stringify(o),'utf8'),c.final()]);return Buffer.concat([iv,c.getAuthTag(),e]).toString('base64url')};
export const unseal=<T>(v?:string):T|null=>{try{const b=Buffer.from(v||'','base64url');const d=crypto.createDecipheriv('aes-256-gcm',key(),b.subarray(0,12));d.setAuthTag(b.subarray(12,28));return JSON.parse(Buffer.concat([d.update(b.subarray(28)),d.final()]).toString('utf8'))}catch{return null}};
export type Session={tk:string;ts:string;uid:string;domain:string};
export const SESSION_COOKIE='sb_session',RT_COOKIE='sb_rt',SESSION_MAX_AGE=60*60*24*85; // Schoology OAuth1 tokens expire after 90 days
