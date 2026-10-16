/* v4.9.59: Explicit local backup/restore. Future cloud adapter must be independent. */
(()=>{'use strict';
 const PREFIX='hu_nyang_rpg_save_v1_slot_';
 const MAX_FILE_BYTES=10*1024*1024;
 const $=(selector,root=document)=>root.querySelector(selector);
 const qs=(selector,root=document)=>Array.from(root.querySelectorAll(selector));
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const validSlot=i=>Number.isInteger(i)&&i>=1&&i<=3;
 const read=i=>{try{const raw=localStorage.getItem(PREFIX+i);return raw?JSON.parse(raw):null}catch(_){return null}};
 const isValidData=o=>!!o&&typeof o==='object'&&!Array.isArray(o)&&!!o.rpg&&typeof o.rpg==='object'&&!Array.isArray(o.rpg)&&typeof o.rpg.name==='string'&&o.rpg.name.trim().length>=1&&o.rpg.name.length<=64&&(!('inventory' in o.rpg)||Array.isArray(o.rpg.inventory))&&(!('items' in o.rpg)||!!o.rpg.items&&typeof o.rpg.items==='object'&&!Array.isArray(o.rpg.items));
 const notice=s=>{const n=$('#gwBackupNotice59');if(n)n.textContent=s;};
 const root=$('#rpgSavePage .screen');if(!root)return;
 const style=document.createElement('style');style.textContent=`
 .gwBackupPanel59{margin:16px 0 28px;padding:14px;border:1px solid #d9bba7;border-radius:14px;background:rgba(255,249,239,.94);color:#583c3f;box-shadow:0 3px 12px rgba(30,20,35,.07)}
 .gwBackupTitle59{font-size:16px;font-weight:900;margin-bottom:5px}.gwBackupInfo59{font-size:12px;line-height:1.55;opacity:.87;margin-bottom:12px}
 .gwBackupActions59{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.gwBackupActions59 button,.gwBackupRestoreBtn59{flex:1;min-width:120px;border-radius:10px;border:1px solid #be9b89;background:#f8ebe0;color:#633e3b;font-weight:800;padding:11px 8px;cursor:pointer}
 .gwBackupActions59 button:first-child{background:#c98e76;border-color:#b57b69;color:white}
 #gwBackupNotice59{font-size:12px;margin-top:10px;line-height:1.5;min-height:1em}
 .gwBackupRestore59{display:none;margin-top:12px;border-top:1px solid #dec5b4;padding-top:12px}
 .gwBackupRestore59.show{display:block}
 .gwBackupRestore59 .gwBackupRow59{display:flex;gap:9px;align-items:center;border:1px solid #dfcec3;background:#fff9f3;padding:10px;border-radius:10px;margin:7px 0}
 .gwBackupRow59 input{flex-shrink:0;width:19px;height:19px;accent-color:#be866a}
 .gwBackupRow59 div{flex:1;min-width:0;font-size:13px;line-height:1.4}.gwBackupRow59 small{display:block;color:#986b5d;font-size:11px;margin-top:3px}
 .gwBackupFoot59{font-size:11px;line-height:1.5;margin-top:10px;color:#76594f}
 .gwBackupText60{display:none;margin-top:10px}.gwBackupText60.show{display:block}.gwBackupText60 textarea{width:100%;box-sizing:border-box;min-height:108px;font:12px monospace;border:1px solid #bd9f87;border-radius:9px;padding:9px;background:#fff;color:#382f2f}.gwBackupText60 button{width:100%;margin-top:6px;background:#e4c9ac;color:#3c292c;border:1px solid #b88c72;border-radius:8px;padding:9px;font-weight:bold}
 `;document.head.appendChild(style);
 const panel=document.createElement('section');panel.className='gwBackupPanel59';panel.innerHTML=`
 <div class="gwBackupTitle59">💾 세이브 백업 · 복원</div>
 <div class="gwBackupInfo59">클라우드 백업 또는 JSON 파일을 이용해 모험 기록을 보관하세요.</div>
 <div class="gwBackupActions59"><button id="gwCloudBackup86" type="button">☁️ Cloud 백업</button><button id="gwCloudRestore86" type="button">☁️ Cloud 복원</button><button id="gwBackupDownload59" type="button">📥 Chrome 백업</button><button id="gwBackupChoose59" type="button">📂 Chrome 복원</button></div>
 <div class="gwBackupText60" id="gwBackupText60"><div class="gwBackupFoot59">아래 JSON 전체를 복사한 후 Acode에서 새 파일에 붙여넣고, 확장자가 .json인 이름으로 저장하세요.</div><textarea id="gwBackupJson60" spellcheck="false" readonly aria-label="복사용 세이브 백업 JSON"></textarea><button id="gwBackupSelect60" type="button">백업 내용 전체 선택</button></div>
 <input id="gwBackupFile59" type="file" accept=".json,application/json" style="display:none" aria-label="세이브 백업 JSON 파일 선택">
 <div id="gwBackupNotice59" role="status" aria-live="polite"></div>
 <div id="gwBackupRestore59" class="gwBackupRestore59" aria-label="복원 대상 슬롯 선택"><b>복원할 슬롯을 선택하세요</b><div id="gwBackupSlots59"></div><div class="gwBackupActions59"><button type="button" id="gwBackupCancel59">취소</button><button type="button" id="gwBackupApply59">선택 슬롯 복원</button></div><div class="gwBackupFoot59">기존 세이브가 있는 슬롯을 덮어쓰면 현재 기록이 바뀝니다. 복원하기 전에 현재 세이브도 백업하는 것을 권장합니다.</div></div>
 <div class="gwBackupFoot59">Cloud 백업·복원은 Cloudflare 서버 저장소 연결 후 사용할 수 있습니다. JSON 백업은 현재도 사용 가능합니다.</div>`;
 ($('#rpgSaveList')||root).insertAdjacentElement('afterend',panel);
 let pending=null;
 const restore=$('#gwBackupRestore59');
 function payloadJson60(){
  const slots={};for(let i=1;i<=3;i++){const data=read(i);if(isValidData(data))slots[String(i)]=data;}
  if(!Object.keys(slots).length)throw Error('백업할 캐릭터가 없습니다.');
  return {json:JSON.stringify({format:'nyangpg-local-backup',schema:1,exportedAt:new Date().toISOString(),slots},null,2),count:Object.keys(slots).length};
 }
 function clearCopy60(){const panel=$('#gwBackupText60');if(panel)panel.classList.remove('show');const area=$('#gwBackupJson60');if(area)area.value='';}
 async function copyBackup60(){
  try{
   const {json,count}=payloadJson60();
   const panel=$('#gwBackupText60'),area=$('#gwBackupJson60');
   area.value=json;panel.classList.add('show');
   try{
    if(!navigator.clipboard?.writeText)throw Error('clipboard unavailable');
    await navigator.clipboard.writeText(json);
    notice(`백업 ${count}개 슬롯을 복사했어요. Acode에서 새 파일을 만들고 붙여넣어 nyangpg-save-backup.json 으로 저장하세요.`);
   }catch(_){
    area.focus();area.select();
    notice(`백업 ${count}개 슬롯이 준비됐어요. 아래 내용 전체를 길게 눌러 복사한 다음 Acode에 붙여넣고 .json으로 저장하세요.`);
   }
  }catch(e){notice(`백업 준비 실패: ${e?.message||'저장소 접근 오류'}`);}
 }

 const close=()=>{pending=null;restore.classList.remove('show');$('#gwBackupFile59').value='';};
 function download(){
  try{
   const {json,count}=payloadJson60();
   // Acode's DownloadManager cannot handle blob: URLs and may crash its native app.
   // Block unsafe download in Acode / nonstandard embedded file previews. Use copy instead.
   const agent=navigator.userAgent||'';
   if((/Acode|com\.foxdebug|Foxdebug/i.test(agent)||(/Android/i.test(agent)&&(/; wv\)|Version\/4\.0/i.test(agent)||!/Chrome\/\d+/i.test(agent)))||location.protocol==='file:')){
    notice('Acode 또는 파일 미리보기에서는 직접 다운로드가 앱을 종료시킬 수 있어요. 왼쪽 「Acode용 백업 복사」를 사용하거나 Chrome으로 접속하세요.');
    return;
   }
   const blob=new Blob([json],{type:'application/json;charset=utf-8'});
   const url=URL.createObjectURL(blob);
   const stamp=new Date().toISOString().slice(0,19).replace(/[:T]/g,'-');
   const a=document.createElement('a');a.href=url;a.download=`nyangpg-save-backup-${stamp}.json`;document.body.appendChild(a);a.click();a.remove();
   setTimeout(()=>URL.revokeObjectURL(url),30000);
   notice(`백업 파일 저장을 요청했습니다. ${count}개 슬롯 · 다운로드 목록을 확인해 주세요.`);
  }catch(e){notice(`백업 실패: ${e?.message||'저장소 접근 오류'}`);}
 }
 function parseBackup(obj){
  if(!obj||obj.format!=='nyangpg-local-backup'||obj.schema!==1||!obj.slots||typeof obj.slots!=='object'||Array.isArray(obj.slots))throw Error('냥PG 월드 백업 파일 형식이 아닙니다.');
  const entries=[];
  for(const [id,value] of Object.entries(obj.slots)){
   const slot=Number(id);
   if(!validSlot(slot)||String(slot)!==id||!isValidData(value))throw Error(`슬롯 ${id}의 데이터가 손상됐습니다.`);
   entries.push([slot,value]);
  }
  if(!entries.length)throw Error('파일에 복원할 세이브가 없습니다.');
  return entries.sort((a,b)=>a[0]-b[0]);
 }
 async function chooseFile(file){
  close();if(!file)return;
  if(file.size>MAX_FILE_BYTES){notice('백업 파일이 너무 큽니다. 최대 10MB까지만 불러올 수 있어요.');return;}
  try{
   const parsed=JSON.parse(await file.text());const entries=parseBackup(parsed);pending=entries;
   const host=$('#gwBackupSlots59');host.replaceChildren();
   for(const [slot,data] of entries){
    const existing=read(slot),current=isValidData(existing)?existing.rpg.name:'비어 있음';
    const label=document.createElement('label');label.className='gwBackupRow59';
    label.innerHTML=`<input type="checkbox" data-slot="${slot}" ${existing?'':'checked'}><div><strong>SAVE ${slot} · ${esc(data.rpg.name)}</strong><small>현재 슬롯: ${esc(current)} ${existing?'· 덮어쓰기 주의':'· 새 슬롯 복원'}</small></div>`;
    host.appendChild(label);
   }
   restore.classList.add('show');notice(`파일을 확인했습니다. 총 ${entries.length}개 슬롯이 들어 있습니다.`);
  }catch(e){notice(`복원 파일을 읽을 수 없습니다: ${e?.message||'알 수 없는 오류'}`);}
 }
 function apply(){
  if(!pending)return;
  const selected=qs('#gwBackupSlots59 input:checked').map(i=>Number(i.dataset.slot));
  if(!selected.length){notice('복원할 슬롯을 하나 이상 선택해 주세요.');return;}
  const restoreItems=pending.filter(([id])=>selected.includes(id));
  const conflicts=restoreItems.filter(([slot])=>localStorage.getItem(PREFIX+slot)!==null);
  if(conflicts.length){
   const description=conflicts.map(([slot,record])=>`SAVE ${slot}: 현재 ${read(slot)?.rpg?.name||'기존 기록'} → 백업 ${record.rpg.name}`).join('\n');
   if(!confirm(`기존 세이브 ${conflicts.length}개를 덮어쓸까요?\n\n${description}\n\n되돌리기 어렵습니다. 현재 기록을 먼저 백업했는지 확인하세요.`))return;
  }
  const previous=new Map();
  try{
   for(const [slot] of restoreItems)previous.set(slot,localStorage.getItem(PREFIX+slot));
   for(const [slot,data] of restoreItems){localStorage.setItem(PREFIX+slot,JSON.stringify(data));}
   const restored=restoreItems.length;close();
   if(typeof rpgRenderSaveSlots==='function')rpgRenderSaveSlots();
   notice(`${restored}개 슬롯 복원 완료. 이어하기를 눌러 확인해 주세요.`);
  }catch(e){
   for(const [slot,raw] of previous){try{if(raw===null)localStorage.removeItem(PREFIX+slot);else localStorage.setItem(PREFIX+slot,raw);}catch(_){}}
   notice(`복원 실패: ${e?.message||'브라우저 저장소 용량 또는 권한 문제'}. 가능한 범위에서 원래 데이터를 유지했습니다.`);
  }
 }
 $('#gwCloudBackup86').addEventListener('click',()=>window.NyangMatch4986?.cloudBackup(payloadJson60,notice));
 $('#gwCloudRestore86').addEventListener('click',()=>window.NyangMatch4986?.cloudRestore(chooseFile,notice));
 $('#gwBackupSelect60')?.addEventListener('click',()=>{const a=$('#gwBackupJson60');a?.focus();a?.select();notice('전체 텍스트를 선택했어요. 복사하여 Acode 새 파일에 붙여넣고 .json으로 저장하세요.');});
 $('#gwBackupDownload59').addEventListener('click',download);
 $('#gwBackupChoose59').addEventListener('click',()=>$('#gwBackupFile59').click());
 $('#gwBackupFile59').addEventListener('change',e=>chooseFile(e.target.files?.[0]));
 $('#gwBackupCancel59').addEventListener('click',()=>{close();notice('복원을 취소했습니다. 기존 세이브에는 변화가 없습니다.');});
 $('#gwBackupApply59').addEventListener('click',apply);
 try{HuNyangDiag.line('RPG_V4960_READY','acode_copy_fallback=on|chrome_download=separate|restore_preview=on|overwrite_confirm=on');}catch(_){ }
})();
