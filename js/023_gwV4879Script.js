
(()=>{
'use strict';
const A79=window.GW79_ASSETS=Object.freeze({"hitMale": "assets/images/0073_553d25bc15.webp", "hitFemale": "assets/images/0074_0ea0a9fa6c.webp", "npc_morning": "assets/images/0075_71e7afe65a.webp", "npc_noon": "assets/images/0076_36121863da.webp", "npc_night": "assets/images/0077_11162bb046.webp", "npc_dawn": "assets/images/0078_839b791d1a.webp", "shop_dawn": "assets/images/0079_4bb31a1503.webp", "shop_morning": "assets/images/0080_e91e0e4c12.webp", "shop_noon": "assets/images/0081_cb6478c50a.webp", "shop_night": "assets/images/0082_61e4c1e42b.webp"});
const $79=(s,r=document)=>r.querySelector(s);
const pick79=a=>a[Math.floor(Math.random()*a.length)];
function part79(){return (typeof rpgPartFromTurn==='function'?rpgPartFromTurn(Number(rpgState?.worldTurn)||0):{key:'morning'}).key}
function applyScene79(){
 const p=part79();
 const shop={morning:A79.shop_morning,noon:A79.shop_noon,night:A79.shop_night,dawn:A79.shop_dawn}[p]||A79.shop_morning;
 for(const id of ['rpgShopSelectPage','rpgShopPage','rpgGeneralShopPage']){const el=$79('#'+id);if(el)el.style.backgroundImage=`url("${shop}")`}
}
const oldTown79=rpgOpenTownNpc;rpgOpenTownNpc=function(){applyScene79();return oldTown79.apply(this,arguments)};
const oldWS79=rpgOpenWeaponShop;rpgOpenWeaponShop=function(){applyScene79();return oldWS79.apply(this,arguments)};
const oldGS79=rpgOpenGeneralShop;rpgOpenGeneralShop=function(){applyScene79();return oldGS79.apply(this,arguments)};
const oldShop79=rpgOpenShop;rpgOpenShop=function(){applyScene79();return oldShop79.apply(this,arguments)};
const oldHyd79=rpgHydratePage;rpgHydratePage=function(page){if(['rpgShopSelectPage','rpgShopPage','rpgGeneralShopPage'].includes(page))applyScene79();return oldHyd79.apply(this,arguments)};
applyScene79();
window.GW79ApplyScene=applyScene79;
window.GW79SceneAssets=A79;

const WEAPON_SKILLS79={
 sword:{id:'weapon79_sword_slash',name:'베기',emoji:'🗡️',kind:'weaponPhysical',mult:1.08,hits:1,mp:5,cooldown:0,desc:'검으로 빠르게 베어 무기 물리 공격력의 108% 피해를 준다.'},
 greatsword:{id:'weapon79_greatsword_charge',name:'차지 어택',emoji:'⚔️',kind:'weaponPhysical',mult:1.28,hits:1,mp:5,cooldown:1,desc:'대검에 힘을 모아 무기 물리 공격력의 128% 피해를 준다.'},
 spear:{id:'weapon79_spear_thrust',name:'관통 찌르기',emoji:'🔱',kind:'weaponPhysical',mult:1.14,hits:1,mp:5,cooldown:0,desc:'창끝으로 깊게 찔러 무기 물리 공격력의 114% 피해를 준다.'},
 dagger:{id:'weapon79_dagger_twin',name:'쌍격',emoji:'🗡️',kind:'weaponPhysical',mult:.68,hits:2,mp:5,cooldown:0,desc:'단검으로 빠르게 2회 공격한다. 타격당 무기 물리 공격력의 68%.'},
 bow:{id:'weapon79_bow_double',name:'더블 샷',emoji:'🏹',kind:'weaponPhysical',mult:.67,hits:2,mp:5,cooldown:0,desc:'화살을 연속으로 2발 발사한다. 타격당 무기 물리 공격력의 67%.'},
 crossbow:{id:'weapon79_crossbow_aimed',name:'조준 사격',emoji:'🎯',kind:'weaponPhysical',mult:1.20,hits:1,mp:5,cooldown:1,desc:'석궁을 정밀 조준해 무기 물리 공격력의 120% 피해를 준다.'},
 staff:{id:'weapon79_staff_bolt',name:'마력탄',emoji:'✨',kind:'weaponMagic',mult:1.08,hits:1,mp:5,cooldown:0,desc:'지팡이의 마력을 응축해 마법 공격력의 108% 피해를 준다.'},
 grimoire:{id:'weapon79_grimoire_rune',name:'룬 샷',emoji:'📖',kind:'weaponMagic',mult:1.12,hits:1,mp:5,cooldown:0,desc:'마도서의 룬을 발사해 마법 공격력의 112% 피해를 준다.'},
 blunt:{id:'weapon79_blunt_smash',name:'스매시',emoji:'🔨',kind:'weaponPhysical',mult:1.18,hits:1,mp:5,cooldown:1,desc:'둔기로 강하게 내려쳐 무기 물리 공격력의 118% 피해를 준다.'},
 electricGuitar:{id:'weapon79_guitar_resonance',name:'공명 타격',emoji:'🎸',kind:'weaponPhysical',mult:1.16,hits:1,mp:5,cooldown:1,desc:'전자기타의 충격파를 실어 무기 물리 공격력의 116% 피해를 준다.'}
};
window.GW79_WEAPON_SKILLS=WEAPON_SKILLS79;
for(const [wt,s] of Object.entries(WEAPON_SKILLS79)){
 if(!rpgSkillDefs.some(x=>x.id===s.id))rpgSkillDefs.push({...s,type:'active',job:'adventurer',max:1,weaponType:wt,weaponBasic:true,base:s.mult,per:0,defenseScale:1});
}
function owner79(unit){return unit?.id==='ai2'?rpgState.ai2:(unit?.id==='ai'?rpgState.ai:rpgState)}
function weapon79(unit){return unit?.weaponType||unit?.equipment?.weapon?.weaponType||owner79(unit)?.equipment?.weapon?.weaponType||null}
const oldKnown79=rpgKnownActiveSkills;rpgKnownActiveSkills=function(unit){
 const base=oldKnown79(unit).filter(s=>!s.weaponBasic);
 const ws=WEAPON_SKILLS79[weapon79(unit)];
 if(ws){const def=rpgSkillDefs.find(s=>s.id===ws.id);if(def)base.unshift(def)}
 return base;
};
function hitEffect79(targetIndex,caster,hits=1){
 const target=$79(`#rpgBattleUnits [data-battle-enemy="${targetIndex}"]`);if(!target)return;
 const src=(caster?.gender||'').includes('여')?A79.hitFemale:A79.hitMale;
 for(let i=0;i<Math.max(1,hits);i++)setTimeout(()=>{const im=document.createElement('img');im.src=src;im.className='gwWeaponHit79';target.appendChild(im);setTimeout(()=>im.remove(),560)},i*155);
}
function weaponSkillUse79(caster,skill,targetIndex){
 const b=rpgState.field?.battle,target=b?.enemies?.[targetIndex];if(!target||target.dead)return false;
 const hits=Math.max(1,Number(skill.hits)||1),isMagic=skill.kind==='weaponMagic';
 let total=0,before=target.hp,absorbed=0,anyCrit=false;
 for(let i=0;i<hits;i++){
   let raw=isMagic?(caster.derived?.magicAtk||0):rpgWeaponPhysicalPower(caster);
   raw*=Number(skill.mult||skill.base||1);
   if(target.defending)raw*=.5;
   const evasion=target.derived?.evasion||0;if(Math.random()*100<evasion)continue;
   const critChance=Math.max(0,(caster.derived?.crit||0)-5),crit=Math.random()*100<critChance;anyCrit=anyCrit||crit;if(crit)raw*=1.5;
   const res=rpgApplyDamage(target,raw,isMagic);total+=res.hpDamage;absorbed+=res.absorbed;if(target.dead)break;
 }
 caster.skillCooldowns=caster.skillCooldowns||{};if(skill.cooldown)caster.skillCooldowns[skill.id]=skill.cooldown;
 const label=target.name||'적';
 rpgLog(`${skill.emoji} ${caster.name}의 ${skill.name}! ${anyCrit?'💥 ':''}${label}에게 ${total} 피해${absorbed?` · 보호막 ${absorbed} 흡수`:''} · HP ${before} → ${target.hp}`);
 requestAnimationFrame(()=>rpgShowDamage(`#rpgCombatEnemy .rpgCombatUnit[data-enemy="${targetIndex}"]`,`-${total}`,false));
 hitEffect79(targetIndex,caster,hits);
 return true;
}
const oldUse79=rpgUseActiveSkill;rpgUseActiveSkill=function(caster,skillId,targetIndex){
 const sk=rpgSkillDefs.find(s=>s.id===skillId);
 if(sk?.weaponBasic){
   if(weapon79(caster)!==sk.weaponType)return false;
   const cost=Math.max(0,Number(sk.mp)||0);
   if((Number(caster.mp)||0)<cost)return false;
   const beforeMp=Number(caster.mp)||0;
   const used=weaponSkillUse79(caster,sk,targetIndex);
   if(!used)return false;
   caster.mp=Math.max(0,beforeMp-cost);
   try{HuNyangDiag.line('RPG_WEAPON_SKILL_MP',`${caster.name}|${sk.id}|${beforeMp}->${caster.mp}|cost=${cost}`)}catch(_){}
   return true;
 }
 return oldUse79.apply(this,arguments);
};
const oldSkillPage79=rpgRenderPlayerSkillsPage;rpgRenderPlayerSkillsPage=function(view='passive'){
 if(view!=='active')return oldSkillPage79.apply(this,arguments);
 const h=$79('#rpgPlayerSkillsOnly');if(!h)return;
 const jobSkills=rpgActiveSkillsForJob(rpgState.job).filter(s=>!s.weaponBasic);
 const ws=WEAPON_SKILLS79[rpgState.equipment?.weapon?.weaponType];
 const skills=[...(ws?[rpgSkillDefs.find(s=>s.id===ws.id)].filter(Boolean):[]),...jobSkills];
 h.innerHTML=`<div class="rpgStatusSheet"><div class="rpgGrowthPoints"><span class="rpgGrowthChip">✨ 스킬 포인트 <strong>${rpgState.skillPoints}</strong></span></div><div class="rpgSkillList">${skills.length?skills.map(skill=>{const isW=!!skill.weaponBasic,rank=isW?1:(rpgState.skills?.[skill.id]||0);return `<div class="rpgSkillRow"><div class="rpgSkillInfo"><div class="rpgSkillName">${skill.emoji} ${skill.name} · Lv.${rank}/${skill.max}${isW?'<span class="gwWeaponSkillTag79">장착 무기 기본 스킬</span>':''}</div><div class="rpgSkillDesc">${skill.desc}</div></div>${isW?'<button class="rpgSkillInvest" disabled>AUTO</button>':`<button class="rpgSkillInvest" data-player-skill="${skill.id}" ${rpgState.skillPoints<=0||rank>=skill.max?'disabled':''}>${rank>=skill.max?'MAX':rank?'강화 · 1 SP':'습득 · 1 SP'}</button>`}</div>`}).join(''):'<div class="rpgDesc">현재 사용 가능한 액티브 스킬이 없습니다.</div>'}</div></div>`;
 h.querySelectorAll('[data-player-skill]').forEach(b=>b.onclick=()=>{rpgSpendSkill('player',b.dataset.playerSkill);rpgRenderPlayerSkillsPage(view)});
};

const CQ79={
 rubia:{name:'루비아',job:'전사',quest:'전사 전직 의뢰',id:'class79_warrior',artPos:()=>window.V38_ASSETS?.warriorHappy||'',artNeg:()=>window.V38_ASSETS?.warriorAnnoyed||'',
 introPos:['“이제 제법 몸이 풀렸네. 너도 어느 정도 숙련됐어. 혹시 전사라는 길에 관심 있어?”','“Lv.10까지 왔으면 초보 티는 많이 벗었지. 힘으로 전열을 버티는 전사, 한번 배워볼 생각 있어?”'],
 introNeg:['“실력은… 뭐, 인정할 만큼은 됐네. 전사 쪽에 관심은 있어?”','“성격은 여전히 마음에 안 들지만 실력은 늘었어. 전사에 관심 있으면 설명 정도는 해줄게.”'],
 noPos:['“그렇구나. 알겠어. 마음 바뀌면 다음에 다시 물어봐.”','“좋아, 서두를 필요는 없지. 다음 기회에 생각나면 말해.”'],
 noNeg:['“그래. 나도 굳이 억지로 알려주고 싶진 않아.”','“그럼 됐어. 관심도 없는데 붙잡고 설명할 생각은 없으니까.”'],
 explain:'“전사는 전열에서 적의 공격을 받아내면서 강한 근접 공격으로 흐름을 잡는 직업이야. 방어와 힘을 제대로 다루는 게 핵심이지. 시험을 받아볼래?”'},
 kain:{name:'카인',job:'도적',quest:'도적 전직 의뢰',id:'class79_rogue',artPos:()=>window.V38_ASSETS?.rogueNormal||'',artNeg:()=>window.V38_ASSETS?.rogueSerious||'',
 introPos:['“제법 익숙해졌네. 움직임도 전보다 나아졌고. 도적의 방식에 관심 있나?”','“Lv.10이면 이제 기본은 익혔겠지. 빠르게 파고들어 약점을 노리는 도적, 배워볼 생각 있어?”'],
 introNeg:['“실력만 놓고 보면 전보다 낫군. 도적에 관심 있으면 설명은 해주지.”','“네 성격과 별개로 움직임은 쓸 만해졌어. 도적의 방식에 관심 있나?”'],
 noPos:['“그렇군. 알겠어. 필요해지면 다시 와.”','“그래. 선택은 네 몫이지. 다음 기회에 생각나면 말해.”'],
 noNeg:['“그럼 됐어. 나도 너한테 억지로 알려주고 싶진 않아.”','“관심 없으면 끝이지. 쓸데없이 시간 낭비할 필요는 없고.”'],
 explain:'“도적은 빠른 ATB와 기동력으로 빈틈을 파고드는 직업이야. 정면으로 버티기보다 약점과 타이밍을 노리는 쪽이지. 시험을 받아볼래?”'}
};
function rel79(k){return window.V38_ensureRelations?.()?.[k]||{affinity:0}}
function setTalk79(k,text,choices){
 window.V38_cancelNpcTimer?.();window.V38_classTalkActive=true;
 const d=CQ79[k],r=rel79(k),sel=$79('#rpgGuildNpcSelect'),talk=$79('#rpgGuildNpcTalk'),speech=$79('#rpgGuildNpcSpeech'),name=$79('#rpgGuildNpcName'),art=$79('#rpgGuildNpcArt'),host=$79('#rpgGuildNpcChoices');
 if(sel)sel.style.display='none';if(talk)talk.style.display='';if(speech)speech.textContent=text;if(name)name.textContent=`${d.name}(${d.job})`;if(art)art.src=(Number(r.affinity)<0?d.artNeg():d.artPos());
 if(host){host.innerHTML='';host.classList.toggle('gwTwoChoice80',choices.length===2);for(const c of choices){const b=document.createElement('button');b.type='button';b.textContent=c.text;b.onclick=c.on;host.appendChild(b)}}
}
function classQuestBusy79(){return !!(rpgState.classQuest&&!rpgState.classQuest.rewarded)}
function startClassTalk79(k){
 if(window.GWClassStageDone4905?.(k,1)){toast('이미 완료한 1차 전직 의뢰입니다.');return}
 if((Number(rpgState.level)||1)<10)return;
 const d=CQ79[k],neg=Number(rel79(k).affinity)<0;
 setTalk79(k,pick79(neg?d.introNeg:d.introPos),[
  {text:'관심이 있다',on:()=>setTalk79(k,d.explain,[{text:'전직 시험을 받아본다',on:()=>acceptClass79(k)},{text:'조금 더 생각해본다',on:()=>declineClass79(k)}])},
  {text:'관심이 없다',on:()=>declineClass79(k)}
 ]);
}
function declineClass79(k){
 const d=CQ79[k],neg=Number(rel79(k).affinity)<0;
 setTalk79(k,pick79(neg?d.noNeg:d.noPos),[]);window.GW80ClassReturnReady?.();
}
function acceptClass79(k){
 const d=CQ79[k];
 if(window.GWClassStageDone4905?.(k,1)){toast('이미 완료한 1차 전직 의뢰입니다.');return}
 if(classQuestBusy79()){toast('이미 진행 중인 전직 의뢰가 있습니다.');return}
 rpgState.classQuest={id:d.id,mentor:k,mentorName:d.name,job:d.job,name:d.quest,stage:1,target:40,kills:0,completed:false,rewarded:false,acceptedAtTurn:Number(rpgState.worldTurn)||0};
 setTalk79(k,k==='rubia'
   ?'“좋아. 그럼 먼저 초원의 슬라임 계열을 40마리 상대해봐. 초록·파랑·빨강 슬라임이면 돼. 수를 채우고 다시 와.”'
   :'“좋아. 그럼 먼저 늑대와 파란·빨간 슬라임을 합쳐 40마리 상대해봐. 빠른 적을 상대하는 감각부터 확인하지.”',[]);
 rpgSaveActiveSlot?.(null,'class_quest_accept');refreshClassQuest79();updateClassBangs79();window.GW80ClassReturnReady?.();
 try{HuNyangDiag.line('RPG_CLASS_QUEST_ACCEPT',`${k}|target=40`)}catch(_){}
}
function ensureBang79(){
 document.querySelectorAll('.guildNpcPortraitPick').forEach(w=>{
  const k=w.querySelector('[data-guild-npc]')?.dataset.guildNpc;if(!k||w.querySelector('.gwClassQuestBang79'))return;
  const b=document.createElement('button');b.type='button';b.className='gwClassQuestBang79';b.textContent='!';b.setAttribute('aria-label',`${CQ79[k]?.name||k} 전직 대화`);b.onclick=e=>{e.preventDefault();e.stopPropagation();startClassTalk79(k)};w.appendChild(b);
 });
}
function updateClassBangs79(){
 ensureBang79();const lv=Number(rpgState.level)||1,busy=classQuestBusy79();
 document.querySelectorAll('.gwClassQuestBang79').forEach(b=>{
  const k=b.closest('.guildNpcPortraitPick')?.querySelector('[data-guild-npc]')?.dataset.guildNpc;
  b.classList.toggle('show',lv>=10&&!busy&&!window.GWClassStageDone4905?.(k,1));
 });
}
function classQuestText79(){
 const q=rpgState.classQuest;if(!q||q.rewarded)return '';
 const stage=Number(q.stage)||1,target=Math.max(1,Number(q.target)||(stage===1?40:1)),cur=Math.min(Number(q.kills)||0,target);
 let objective='';
 if(stage===1)objective=q.mentor==='rubia'?`슬라임 계열 ${cur}/${target}`:`늑대·파란/빨간 슬라임 ${cur}/${target}`;
 else if(stage===2)objective=`${q.bossName||(q.mentor==='rubia'?'거대 슬라임':'늑대왕')} 토벌 ${q.completed?1:cur}/${target}`;
 else objective=`최종 전직 시험 ${q.completed?1:cur}/${target}`;
 return `${q.completed?'✅':'🧭'} ${q.name} · ${objective}${q.completed?` · ${q.mentorName}에게 보고 가능`:''}`;
}
function refreshClassQuest79(){
 const text=classQuestText79();
 const line=$79('#rpgGuildStoryLine');if(line){
   let el=$79('#gwClassQuestGuild79');if(!el){el=document.createElement('div');el.id='gwClassQuestGuild79';el.className='gwClassQuestStatus79';line.insertAdjacentElement('afterend',el)}
   el.style.display=text?'':'none';el.classList.toggle('complete',!!rpgState.classQuest?.completed);el.textContent=text;
 }
 const fs=$79('#rpgFieldSummary');if(fs){
   let el=$79('#gwClassQuestField79');if(!el){el=document.createElement('div');el.id='gwClassQuestField79';el.className='gwClassQuestStatus79';fs.insertAdjacentElement('afterend',el)}
   el.style.display=text?'':'none';el.classList.toggle('complete',!!rpgState.classQuest?.completed);el.textContent=text;
 }
}
const oldGuild79=rpgRenderGuild;rpgRenderGuild=function(){const v=oldGuild79.apply(this,arguments);refreshClassQuest79();return v};
const oldField79=rpgRenderField;rpgRenderField=function(){const v=oldField79.apply(this,arguments);refreshClassQuest79();return v};
const oldBattle79=rpgRenderBattlePage;rpgRenderBattlePage=function(){const v=oldBattle79.apply(this,arguments);refreshClassQuest79();return v};
const oldVictory79=rpgBattleVictory;rpgBattleVictory=function(){
 const q=rpgState.classQuest,b=rpgState.field?.battle,stage=Number(q?.stage)||1;
 if(q&&!q.rewarded&&!q.completed&&stage===1&&Array.isArray(b?.enemies)){
   const gain=b.enemies.filter(e=>{
     if(!e?.dead||e?.boss||['slimeBoss','wolfBoss'].includes(e?.type))return false;
     if(q.mentor==='rubia')return ['green','blue','red'].includes(e.type)&&!e._giantSplitElite;
     if(q.mentor==='kain')return e.type==='wolf'||(['blue','red'].includes(e.type)&&!e._giantSplitElite);
     return false;
   }).length;
   if(gain>0){q.kills=Math.min(q.target||40,(Number(q.kills)||0)+gain);if(q.kills>=(q.target||40))q.completed=true;try{HuNyangDiag.line('RPG_CLASS_QUEST_PROGRESS',`${q.mentor}|stage=1|${q.kills}/${q.target||40}`)}catch(_){}}
 }
 const v=oldVictory79.apply(this,arguments);refreshClassQuest79();rpgSaveActiveSlot?.(null,'class_quest_progress');return v;
};
const oldShow79=showPage;showPage=function(id,navDirection='auto'){const v=oldShow79(id,navDirection);if(id==='rpgGuildNpcPage')setTimeout(()=>{updateClassBangs79();refreshClassQuest79()},0);if(['rpgNpcPage','rpgShopSelectPage','rpgShopPage','rpgGeneralShopPage'].includes(id))setTimeout(applyScene79,0);return v};
setTimeout(()=>{updateClassBangs79();refreshClassQuest79();applyScene79()},60);
try{HuNyangDiag.line('RPG_V4879_READY','weapon_skills=10|gender_hit_fx=2|npc_bg=4|shop_bg=4|class_quest=warrior,rogue|target=40')}catch(_){}
})();
