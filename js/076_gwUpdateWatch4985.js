(()=>{'use strict';
const CURRENT='4.9.85', API='https://nyangpg-api.hwjung1102.workers.dev/api/version';
let pending='', lastShown='', busy=false, dialog=null;
const log=(key,v)=>{try{window.HuNyangDiag?.line(key,String(v||''))}catch(_){}};
const page=()=>document.querySelector('.page.active')?.id||'';
const safe=()=>['homePage','splashPage','rpgSavePage','rpgVillagePage'].includes(page());
function newer(a,b){const x=String(a).split('.').map(Number),y=String(b).split('.').map(Number);return x.some((v,i)=>v>(y[i]||0)&&x.slice(0,i).every((n,j)=>n===(y[j]||0)))}
async function get(url){const ac=new AbortController(),id=setTimeout(()=>ac.abort(),7000);try{const r=await fetch(url+(url.includes('?')?'&':'?')+'v='+Date.now(),{cache:'no-store',signal:ac.signal});if(!r.ok)throw Error('HTTP '+r.status);return r.json()}finally{clearTimeout(id)}}
function notify(){if(!pending||lastShown===pending||!safe()||document.visibilityState==='hidden')return;lastShown=pending;
const backdrop=document.createElement('div');backdrop.id='nyangUpdateNotice4985';backdrop.style.cssText='position:fixed;inset:0;z-index:2147483600;display:flex;align-items:center;justify-content:center;padding:20px;background:#000a;box-sizing:border-box';
const panel=document.createElement('div');panel.style.cssText='width:min(370px,100%);padding:23px 18px;border-radius:16px;background:#fff5f9;color:#513743;border:2px solid #d5aac0;text-align:center;box-sizing:border-box;font-family:inherit;box-shadow:0 15px 35px #0004';
const title=document.createElement('h3');title.textContent='📢 새로운 업데이트 발견';title.style.cssText='font-size:19px;margin:0 0 13px';panel.append(title);
const txt=document.createElement('p');txt.textContent='업데이트 내역이 있습니다. 새로고침을 시도해주세요.';txt.style.cssText='line-height:1.6;font-size:14px;margin:0';panel.append(txt);
const ver=document.createElement('p');ver.textContent='v'+CURRENT+' → v'+pending;ver.style.cssText='font-size:12px;color:#89677a;margin:12px 0';panel.append(ver);
const row=document.createElement('div');row.style.cssText='display:flex;gap:10px';
for(const [label,action,primary] of [['나중에',()=>{backdrop.remove();dialog=null;log('RPG_UPDATE_POSTPONE',pending)},false],['새로고침',()=>{if(!safe()){backdrop.remove();dialog=null;return}try{if(page()==='rpgVillagePage')log('RPG_UPDATE_SAVE',window.rpgSaveActiveSlot?.('rpgVillagePage','update_reload')?'ok':'skip')}catch(e){log('RPG_UPDATE_SAVE_ERROR',e)}location.reload()},true]]){const btn=document.createElement('button');btn.type='button';btn.textContent=label;btn.style.cssText='flex:1;padding:12px;border-radius:10px;font-weight:bold;border:1px solid #d6a7bd;background:'+(primary?'#bd7a9f':'#fff')+';color:'+(primary?'#fff':'#654454');btn.onclick=action;row.append(btn)}
panel.append(row);backdrop.append(panel);document.body.append(backdrop);dialog=backdrop;log('RPG_UPDATE_NOTICE',CURRENT+'->'+pending)}
async function poll(){if(busy)return;busy=true;try{
const deployed=await get('./version.json');const latest=String(deployed?.version||'');if(!/^\d+\.\d+\.\d+$/.test(latest))throw Error('manifest invalid');
if(newer(latest,CURRENT)){pending=latest;log('RPG_UPDATE_FOUND',CURRENT+'->'+latest);notify()}
try{const api=await get(API);if(api?.version&&api.version!==latest)log('RPG_UPDATE_API_MISMATCH','pages='+latest+',worker='+api.version)}catch(e){log('RPG_UPDATE_API_ERROR',e.message||e)}
}catch(e){log('RPG_UPDATE_CHECK_ERROR',e.message||e)}finally{busy=false}}
function start(){log('RPG_UPDATE_WATCH_READY',CURRENT);setTimeout(poll,4000);setInterval(poll,60000);setInterval(notify,2500);document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'){poll();notify()}})}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',start,{once:true}):start();
})();