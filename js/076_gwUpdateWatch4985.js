/* NyangPG v4.9.86: update notification, safe-page deferral and cache-busted manifest. */
(()=>{
'use strict';
const CLIENT_VERSION='4.9.90';
const VERSION_URL='./version.json';
const WORKER_URL='https://nyangpg-api.hwjung1102.workers.dev/api/version';
const INTERVAL=60000;
let pending=null, shownFor='', checking=false, modal=null;
const log=(event,data)=>{try{window.HuNyangDiag?.line(event,String(data||''))}catch(e){}};
const versionParts=s=>String(s||'').replace(/^v/i,'').split('.').map(x=>parseInt(x,10)||0);
function newer(a,b){const x=versionParts(a),y=versionParts(b);for(let i=0;i<Math.max(x.length,y.length);i++){if((x[i]||0)!==(y[i]||0))return (x[i]||0)>(y[i]||0)}return false}
const active=()=>document.querySelector('.page.active')?.id||'';
function safe(){const page=active();return page==='homePage'||page==='rpgSavePage'||page==='rpgVillagePage'||page==='splashPage'}
function getSavedPage(){return active()}
function hide(){if(modal){modal.remove();modal=null}}
function show(){if(!pending||shownFor===pending.version||!safe()||document.visibilityState==='hidden')return;
 shownFor=pending.version;
 const shade=document.createElement('div'); shade.id='nyangUpdatePrompt4985';
 shade.style.cssText='position:fixed;inset:0;z-index:2147483600;background:rgba(0,0,0,.64);display:flex;align-items:center;justify-content:center;padding:20px;box-sizing:border-box';
 const card=document.createElement('div');card.style.cssText='width:min(370px,100%);box-sizing:border-box;border-radius:16px;border:2px solid #d6aabb;background:#fff5fa;color:#4d3441;padding:22px 18px;text-align:center;box-shadow:0 12px 36px #0005;font-family:inherit';
 const heading=document.createElement('div');heading.textContent='📢 새로운 업데이트 발견';heading.style.cssText='font-size:19px;font-weight:800;margin-bottom:12px';card.appendChild(heading);
 const desc=document.createElement('div');desc.textContent='업데이트 내역이 있습니다. 새로고침을 시도해주세요.';desc.style.cssText='font-size:14px;line-height:1.6;white-space:pre-wrap';card.appendChild(desc);
 const v=document.createElement('div');v.textContent=`v${CLIENT_VERSION} → v${pending.version}`;v.style.cssText='font-size:12px;color:#906c80;margin:12px 0';card.appendChild(v);
 const buttons=document.createElement('div');buttons.style.cssText='display:flex;gap:10px;margin-top:15px';
 const later=document.createElement('button');later.type='button';later.textContent='나중에';later.style.cssText='flex:1;padding:12px;border:1px solid #ccadc0;border-radius:10px;background:white;color:#785668;font-weight:bold';later.onclick=()=>{hide();log('RPG_UPDATE_POSTPONED',pending.version)};
 const reload=document.createElement('button');reload.type='button';reload.textContent='새로고침';reload.style.cssText='flex:1;padding:12px;border:0;border-radius:10px;background:#bb789c;color:white;font-weight:bold';reload.onclick=()=>{if(!safe()){hide();log('RPG_UPDATE_RELOAD_BLOCKED',active());return}try{if(active()==='rpgVillagePage'&&typeof window.rpgSaveActiveSlot==='function'){const ok=window.rpgSaveActiveSlot('rpgVillagePage','update_v4988');log('RPG_UPDATE_PRESAVE',ok?'ok':'not_saved')}}catch(err){log('RPG_UPDATE_PRESAVE_ERROR',err)}log('RPG_UPDATE_RELOAD',pending.version);window.location.reload()};
 buttons.append(later,reload);card.appendChild(buttons);shade.appendChild(card);document.body.appendChild(shade);modal=shade;log('RPG_UPDATE_PROMPT',`${CLIENT_VERSION}->${pending.version}`)
}
async function json(url){const controller=new AbortController();const t=setTimeout(()=>controller.abort(),7000);try{const separator=url.includes('?')?'&':'?';const r=await fetch(url+separator+'_t='+Date.now(),{cache:'no-store',signal:controller.signal});if(!r.ok)throw Error('HTTP '+r.status);return await r.json()}finally{clearTimeout(t)}}
async function check(){if(checking)return;checking=true;try{
 // The manifest is published together with Pages and is the deployment-ready source of truth.
 const manifest=await json(VERSION_URL);
 const latest=String(manifest?.version||'');
 if(!/^\d+\.\d+\.\d+$/.test(latest))throw Error('invalid manifest version');
 if(newer(latest,CLIENT_VERSION)){pending={version:latest,patchNotes:manifest.patchNotes||[]};log('RPG_UPDATE_FOUND',`${CLIENT_VERSION}->${latest}`);show()}
 // Worker API is independently observed; it must not announce an unverified Pages release.
 try{const server=await json(WORKER_URL);if(server?.version&&server.version!==latest)log('RPG_UPDATE_API_VERSION_MISMATCH',`pages=${latest}|worker=${server.version}`)}catch(e){log('RPG_UPDATE_API_UNAVAILABLE',e?.message||e)}
 }catch(e){log('RPG_UPDATE_CHECK_ERROR',e?.message||e)}finally{checking=false}}
function start(){log('RPG_UPDATE_WATCH_READY',CLIENT_VERSION);setTimeout(check,3500);setInterval(check,INTERVAL);setInterval(()=>{if(pending)show()},2500);document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'){check();show()}})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
