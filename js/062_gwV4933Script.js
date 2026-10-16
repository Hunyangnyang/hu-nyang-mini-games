
(()=>{
'use strict';
const q=(s,r=document)=>r.querySelector(s);
function missionBoss933(){const id=rpgState.quest?.id; if(id==='f_boss_slime')return '거대 슬라임';if(id==='f_boss_wolf')return '늑대왕';const ids=Array.isArray(rpgState.acceptedQuestIds)?rpgState.acceptedQuestIds:[];if(ids.includes('f_boss_slime'))return '거대 슬라임';if(ids.includes('f_boss_wolf'))return '늑대왕';return null}
window.gwSeriaBossMission933=missionBoss933;
function missionReady933(){return !!missionBoss933()&&!rpgState.seriaStaffReceived932}
function prayerArt933(){return q('#gwPrayerArt77')?.src||''}
function setSeriaText933(t){const el=q('#gwSeriaDialogueText933');if(el)el.textContent=t}
function updateSeriaQuest933(){q('#gwSeriaQuestBtn933')?.classList.toggle('show',missionReady933())}
function cleanupSeriaStaffVariants933(){
  try{delete rpgState.items?.brokenMeadowWeapon_seriaTealStaff;delete window.materialDefs?.brokenMeadowWeapon_seriaTealStaff;delete window.HuNyangForgeData?.catalogMeadowWeapon_seriaTealStaff}catch(_){}
  if(Array.isArray(rpgState.inventory))rpgState.inventory=rpgState.inventory.filter(i=>!(i?.weaponType==='seriaTealStaff'&&!i?.specialSeriaStaff932));
}
function openSeriaDialogue933(){
  cleanupSeriaStaffVariants933();
  const art=q('#gwSeriaDialogueArt933');if(art)art.src=prayerArt933();
  showPage('rpgSeriaDialoguePage');updateSeriaQuest933();
  try{HuNyangDiag.line('RPG_SERIA_STAFF_ELIGIBILITY_4976',`mission=${missionBoss933()||'none'}|received=${!!rpgState.seriaStaffReceived932}|current=${rpgState.quest?.id||'none'}|history=${(rpgState.acceptedQuestIds||[]).filter(x=>x==='f_boss_slime'||x==='f_boss_wolf').join(',')||'none'}`)}catch(_){}
  if(!rpgState.seriaDialogueIntroSeen933){rpgState.seriaDialogueIntroSeen933=true;rpgState.seriaMet932=true;setSeriaText933('처음 뵙네요. 저는 이 라비엔 기도원을 지키는 사제, 세리아라고 해요. 다치거나 지친 날에는 언제든 찾아와 주세요.');rpgSaveActiveSlot?.('rpgSeriaDialoguePage','seria_first_meeting_4933')}
  else setSeriaText933('어서 오세요. 오늘은 무슨 이야기를 나눠볼까요?');
}
window.gwOpenSeriaDialogue933=openSeriaDialogue933;

function dailyTalk933(){
 const count=Math.max(0,Number(rpgState.prayerReviveCount4927)||0),special=Math.random()<.32;let t='';
 if(special){const bank=count<5?[`지금까지 부활은 ${count}번이네요. 이 정도면 꽤 든든한 모험가인걸요.`,`부활 기록이 ${count}번이라니, 생각보다 정말 잘 버티고 계세요.`]:count<10?[`부활이 벌써 ${count}번이에요. 강한 것도 좋지만 조금은 조심하셔야 해요.`,`지금까지 ${count}번 부활하셨어요. 다음에는 조금 더 몸을 아껴 주세요.`]:[`부활이 ${count}번이라니… 너무 무리하는 거 아니에요? 살아 돌아오는 것도 모험의 일부예요.`,`벌써 ${count}번이에요. 이번에는 정말 조금 다그쳐야겠네요. 목숨은 하나라고 생각하고 움직여 주세요.`];t=bank[Math.floor(Math.random()*bank.length)]}
 else{const part=typeof rpgPrayerPartKey4927==='function'?rpgPrayerPartKey4927():'noon',bank=(typeof rpgPrayerTalk4927!=='undefined'&&rpgPrayerTalk4927[part])||['오늘도 무사히 돌아오셨군요.'];t=bank[Math.floor(Math.random()*bank.length)]}
 setSeriaText933(t);
}
let missionStep933=-1;
function questTalk933(){
 const boss=missionBoss933();if(!boss||rpgState.seriaStaffReceived932){setSeriaText933('지금은 따로 부탁드릴 일이 없어요.');updateSeriaQuest933();return}
 const lines=[`${rpgState.name}님, 정말 많이 성장하셨네요. 이제 제법 믿음직한 모험가가 되셨어요.`,`이번에는 ${boss}을 잡으러 가신다고 들었어요. 그렇다면 이걸 가져가 주세요.`,`제가 사제가 되기 전에 사용했던 청록의 지팡이예요. 이 지팡이가 여러분을 지켜 줄 무기가 되었으면 좋겠어요.`];
 missionStep933++;if(missionStep933<lines.length){setSeriaText933(lines[missionStep933]);const b=q('#gwSeriaQuestBtn933');if(b){b.querySelector('strong').textContent=missionStep933===lines.length-1?'✓':'›';b.querySelector('small').textContent=missionStep933===lines.length-1?'지팡이 받기':'계속 듣기'};return}
 missionStep933=-1;
 return grantStaff933();
}
function grantStaff933(){
 if((rpgState.inventory||[]).length>=40){setSeriaText933('인벤토리가 가득 찼어요. 자리를 하나 비운 뒤 다시 와 주세요.');return}
 const maker=()=>({uid:`seria_staff_${Date.now()}`,series:'seria932',slot:'weapon',weaponType:'seriaTealStaff',armorType:null,source:'quest',name:'청록의 지팡이',rarity:'유니크',level:1,weaponBonus:0,pdef:0,mdef:0,setAtk:0,extra:'지능 +10 · 기본 스킬: 힐링 / 힐링 웨이브 / 큐어 · 강화 불가',border:'teal',price:0,noEnhance:true,noSell:false,specialSeriaStaff932:true});
 const already=(rpgState.inventory||[]).some(i=>i?.specialSeriaStaff932)||rpgState.equipment?.weapon?.specialSeriaStaff932;if(!already)rpgState.inventory.push(maker());
 rpgState.seriaStaffReceived932=true;setSeriaText933('잘 간직해 주세요. 청록의 지팡이가 위험한 순간에 여러분을 지켜주길 바랄게요.');rpgSaveActiveSlot?.('rpgSeriaDialoguePage','seria_teal_staff_4933');updateSeriaQuest933();toast?.('청록의 지팡이를 받았다냥 🐾');return true;
}
window.gwSeriaGrantStaff64=grantStaff933;
q('#gwSeriaDailyBtn933')?.addEventListener('click',dailyTalk933);q('#gwSeriaBackBtn933')?.addEventListener('click',()=>{rpgRenderPrayer();showPage('rpgPrayerPage')});q('#gwSeriaQuestBtn933')?.addEventListener('click',questTalk933);
// Capture phase blocks the old direct speech listener and routes to the dedicated screen.
q('#rpgPrayerTalkBtn4927')?.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();openSeriaDialogue933()},true);

// Prayer speech disappears 5 seconds after entering.
const oldOpenPrayer933=rpgOpenPrayer;rpgOpenPrayer=function(){const r=oldOpenPrayer933.apply(this,arguments);setTimeout(()=>{const s=q('#gwPrayerSpeech77');if(s)s.textContent=''},5000);return r};
const oldRenderPrayer933=rpgRenderPrayer;rpgRenderPrayer=function(){const r=oldRenderPrayer933.apply(this,arguments);setTimeout(()=>{const s=q('#gwPrayerSpeech77');if(s)s.textContent=''},5000);return r};

function wolf933(){return rpgState.field?.battle?.enemies?.find(e=>e?.type==='wolfBoss'&&!e.dead)||null}
function syncWolfExtras933(){
 const e=wolf933(),s=e?._wolf932,par=q('#gwWolfParry932'),chain=q('#gwWolfChain932'),lower=q('#rpgBattlePage .rpgBattleLower');
 if(lower){if(par&&par.parentElement!==lower)lower.prepend(par);if(chain&&chain.parentElement!==lower)lower.prepend(chain)}
 q('#rpgBattlePartyStrip')?.querySelectorAll('.rpgBattlePartyCard').forEach((c,i)=>{c.classList.remove('gwWolfCardMarked933');c.querySelector('.gwWolfDebuffLine933')?.remove();const u=rpgState.field?.party?.[i];if(!u)return;if(s?.rageActive&&u.id==='player')c.classList.add('gwWolfCardMarked933');const vals=[];if((u._wolfRoarTurns932||0)>0)vals.push(`📣 포효 ${u._wolfRoarTurns932}턴`);if((u._wolfBleedTurns932||0)>0)vals.push(`🩸 출혈 ${u._wolfBleedTurns932}턴`);if(vals.length){const d=document.createElement('div');d.className='gwWolfDebuffLine933';d.innerHTML=vals.map(x=>`<span>${x}</span>`).join('');c.appendChild(d)}});
}
const oldRenderBattle933=rpgRenderBattlePage;rpgRenderBattlePage=function(){const r=oldRenderBattle933.apply(this,arguments);requestAnimationFrame(syncWolfExtras933);return r};
const oldTick933=rpgBattleTick;rpgBattleTick=function(){const r=oldTick933.apply(this,arguments);syncWolfExtras933();return r};
cleanupSeriaStaffVariants933();
try{HuNyangDiag.line('RPG_V4933_READY','seria_dialogue=separate|staff=unique_only|wolf_name=unified|boss_encounter=larger|parry_ui_fixed|motion_art=removed_pending_user_assets|battle_scroll=lowres|line_target=rear_missing_to_front|wolf_debuff_cards=on|version=4.9.33')}catch(_){}
})();
