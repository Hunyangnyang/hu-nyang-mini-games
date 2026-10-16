
(()=>{
'use strict';
const q=s=>document.querySelector(s);
const now=()=>performance.now();
const rand=n=>Math.floor(Math.random()*(n+1));
const PARRY_FX='assets/images/0105_dbefef983e.png';

/* ---------- Seria + Teal Staff ---------- */
if(!rpgWeaponDefs.seriaTealStaff)rpgWeaponDefs.seriaTealStaff={name:'청록의 지팡이',range:'magic',physical:{melee:.20},magic:.80,speed:-.4,hand:'two'};
const SERIA_SKILLS=[
 {id:'seria932_healing',name:'힐링',emoji:'💚',type:'active',job:'adventurer',kind:'seriaHeal',mp:5,max:1,weaponBasic:true,weaponType:'seriaTealStaff',desc:'아군 단일의 HP를 지능 × 1.5만큼 회복한다.'},
 {id:'seria932_healing_wave',name:'힐링 웨이브',emoji:'🌊',type:'active',job:'adventurer',kind:'seriaHealAll',mp:5,max:1,weaponBasic:true,weaponType:'seriaTealStaff',desc:'아군 전체의 HP를 각각 지능 × 1.2만큼 회복한다.'},
 {id:'seria932_cure',name:'큐어',emoji:'✨',type:'active',job:'adventurer',kind:'seriaCure',mp:5,max:1,weaponBasic:true,weaponType:'seriaTealStaff',desc:'아군 단일의 디버프를 무작위로 1개 제거한다.'}
];
for(const sk of SERIA_SKILLS)if(!rpgSkillDefs.some(x=>x.id===sk.id))rpgSkillDefs.push(sk);
function isSeriaStaff(w){return !!w?.specialSeriaStaff932||w?.weaponType==='seriaTealStaff'}
function ownerOf(u){return u?.id==='ai2'?rpgState.ai2:(u?.id==='ai'?rpgState.ai:rpgState)}
function equippedSeria(u){const o=ownerOf(u);return isSeriaStaff(u?.weaponItem)||isSeriaStaff(o?.equipment?.weapon)}
const OLD_DERIVED932=rpgDerived;
rpgDerived=function(job,stats,skills={},equipment=null){if(isSeriaStaff(equipment?.weapon)){const st={...(stats||{}),int:(Number(stats?.int)||1)+10};return OLD_DERIVED932(job,st,skills,equipment)}return OLD_DERIVED932.apply(this,arguments)};
const OLD_KNOWN932=rpgKnownActiveSkills;
rpgKnownActiveSkills=function(unit){let base=OLD_KNOWN932(unit);if(!equippedSeria(unit))return base;base=base.filter(x=>!x.weaponBasic||x.weaponType==='seriaTealStaff');return [...SERIA_SKILLS,...base.filter(x=>!SERIA_SKILLS.some(s=>s.id===x.id))]};
const OLD_ITEM_TEXT932=rpgItemStatsText;
rpgItemStatsText=function(i){if(isSeriaStaff(i))return '근거리 공격력 20% · 마법 공격력 80% · 지능 +10 · 강화 불가';return OLD_ITEM_TEXT932(i)};
function partyTargetByLowHp(){return (rpgState.field?.party||[]).filter(u=>!u.dead).sort((a,b)=>(a.hp/a.derived.maxHp)-(b.hp/b.derived.maxHp))[0]||null}
function debuffsOf(u){const a=[];if((u._wolfRoarTurns932||0)>0)a.push('포효');if((u._wolfBleedTurns932||0)>0)a.push('출혈');if((u._gsCorrosionStacks||0)>0)a.push('부식');return a}
function removeDebuff(u,key){if(key==='포효')u._wolfRoarTurns932=0;else if(key==='출혈')u._wolfBleedTurns932=0;else if(key==='부식'){u._gsCorrosionStacks=0;u._gsCorrosionTurns=0}}
const OLD_USE_ACTIVE932=rpgUseActiveSkill;
rpgUseActiveSkill=function(caster,skillId,targetIndex){const sk=SERIA_SKILLS.find(x=>x.id===skillId);if(!sk)return OLD_USE_ACTIVE932.apply(this,arguments);if(!equippedSeria(caster)||(caster.mp||0)<sk.mp)return false;caster.mp=Math.max(0,(caster.mp||0)-sk.mp);const intel=Math.max(1,Number(caster.stats?.int)||1)+(equippedSeria(caster)?10:0),living=(rpgState.field?.party||[]).filter(u=>!u.dead);if(!living.length)return false;if(sk.kind==='seriaHeal'){const t=(Number.isInteger(targetIndex)?living[targetIndex]:null)||partyTargetByLowHp();const amt=Math.max(1,Math.round(intel*1.5)),before=t.hp;t.hp=Math.min(t.derived.maxHp,t.hp+amt);const heal=t.hp-before;rpgLog(`💚 ${caster.name}의 힐링! ${t.name} HP +${heal}`);requestAnimationFrame(()=>rpgShowDamage(`#rpgBattleUnits [data-party-unit="${t.id}"]`,`+${heal}`,true));return true}if(sk.kind==='seriaHealAll'){for(const t of living){const amt=Math.max(1,Math.round(intel*1.2)),before=t.hp;t.hp=Math.min(t.derived.maxHp,t.hp+amt);const heal=t.hp-before;requestAnimationFrame(()=>rpgShowDamage(`#rpgBattleUnits [data-party-unit="${t.id}"]`,`+${heal}`,true))}rpgLog(`🌊 ${caster.name}의 힐링 웨이브! 아군 전체를 회복했습니다.`);return true}if(sk.kind==='seriaCure'){const pool=living.filter(u=>debuffsOf(u).length);const t=(Number.isInteger(targetIndex)?living[targetIndex]:null)||pool.sort((a,b)=>(a.hp/a.derived.maxHp)-(b.hp/b.derived.maxHp))[0]||living[0],ds=debuffsOf(t);if(ds.length){const key=ds[Math.floor(Math.random()*ds.length)];removeDebuff(t,key);rpgLog(`✨ ${caster.name}의 큐어! ${t.name}의 ${key} 디버프를 제거했습니다.`)}else rpgLog(`✨ ${caster.name}의 큐어! 제거할 디버프가 없습니다.`);return true}return false};
function makeSeriaStaff(){return {uid:`seria_staff_${Date.now()}`,series:'seria932',slot:'weapon',weaponType:'seriaTealStaff',armorType:null,source:'quest',name:'청록의 지팡이',rarity:'유니크',level:1,weaponBonus:0,pdef:0,mdef:0,setAtk:0,extra:'지능 +10 · 기본 스킬: 힐링 / 힐링 웨이브 / 큐어 · 강화 불가',border:'teal',price:0,noEnhance:true,noSell:false,specialSeriaStaff932:true}}
function bossMissionName(){const q=rpgState.quest;if(q?.id==='f_boss_slime')return '거대 슬라임';if(q?.id==='f_boss_wolf')return '늑대왕';return null}
function ensureSeriaUi(){const hero=q('#rpgPrayerPage .gwPrayerHero55');if(!hero)return;q('#gwSeriaName932')?.remove();if(!q('#gwSeriaQuest932')){const b=document.createElement('button');b.id='gwSeriaQuest932';b.type='button';b.textContent='!';b.addEventListener('click',startSeriaMission);hero.appendChild(b)}if(!q('#gwSeriaMissionModal932')){const m=document.createElement('div');m.id='gwSeriaMissionModal932';m.innerHTML='<div class="gwSeriaMissionCard932"><h3>세리아</h3><p id="gwSeriaMissionText932"></p><button type="button" id="gwSeriaMissionNext932">다음</button></div>';document.body.appendChild(m)}}
function refreshSeriaQuest(){ensureSeriaUi();const show=!!bossMissionName()&&!rpgState.seriaStaffReceived932;q('#gwSeriaQuest932')?.classList.toggle('show',show)}
let seriaMissionLines932=[],seriaMissionIndex932=0;
function startSeriaMission(){const boss=bossMissionName();if(!boss||rpgState.seriaStaffReceived932)return;seriaMissionLines932=[`${rpgState.name}님, 정말 많이 성장하셨네요. 처음 뵀을 때와는 눈빛부터 달라졌어요.`,`이번에는 ${boss}을 잡으러 가신다고 들었어요. 그렇다면 이걸 가져가 주세요.`,`제가 사제가 되기 전에 사용했던 청록의 지팡이예요. 이 지팡이가 여러분을 지켜 줄 무기가 되었으면 좋겠어요.`];seriaMissionIndex932=0;const m=q('#gwSeriaMissionModal932'),t=q('#gwSeriaMissionText932'),b=q('#gwSeriaMissionNext932');m?.classList.add('show');if(t)t.textContent=seriaMissionLines932[0];if(b)b.textContent='다음';b.onclick=()=>{seriaMissionIndex932++;if(seriaMissionIndex932<seriaMissionLines932.length){t.textContent=seriaMissionLines932[seriaMissionIndex932];b.textContent=seriaMissionIndex932===seriaMissionLines932.length-1?'받기':'다음';return}if((rpgState.inventory||[]).length>=40){t.textContent='인벤토리가 가득 찼어요. 자리를 하나 비운 뒤 다시 와 주세요.';b.textContent='닫기';b.onclick=()=>m.classList.remove('show');return}rpgEnsureEquipment(rpgState);rpgState.inventory.push(makeSeriaStaff());rpgState.seriaStaffReceived932=true;rpgSaveActiveSlot?.('rpgPrayerPage','seria_teal_staff');m.classList.remove('show');refreshSeriaQuest();rpgRenderPrayer();toast('청록의 지팡이를 받았다냥 🐾')}};
const OLD_PRAYER_TALK932=rpgPrayerTalkNow4927;
rpgPrayerTalkNow4927=function(){if(!rpgState.seriaMet932){rpgState.seriaMet932=true;const sp=q('#gwPrayerSpeech77');if(sp)sp.textContent='처음 뵙네요. 저는 이 라비엔 기도원을 지키는 사제, 세리아라고 해요. 다치거나 지친 날에는 언제든 찾아와 주세요.';rpgSaveActiveSlot?.('rpgPrayerPage','seria_first_meeting');return}return OLD_PRAYER_TALK932.apply(this,arguments)};
const OLD_SKILL_PAGE932=rpgRenderPlayerSkillsPage;
rpgRenderPlayerSkillsPage=function(view='passive'){if(view!=='active'||!isSeriaStaff(rpgState.equipment?.weapon))return OLD_SKILL_PAGE932.apply(this,arguments);const h=q('#rpgPlayerSkillsOnly');if(!h)return;const jobSkills=rpgActiveSkillsForJob(rpgState.job).filter(x=>!x.weaponBasic),skills=[...SERIA_SKILLS,...jobSkills];h.innerHTML=`<div class="rpgStatusSheet"><div class="rpgGrowthPoints"><span class="rpgGrowthChip">✨ 스킬 포인트 <strong>${rpgState.skillPoints}</strong></span></div><div class="rpgSkillList">${skills.map(skill=>{const isW=SERIA_SKILLS.some(s=>s.id===skill.id),rank=isW?1:(rpgState.skills?.[skill.id]||0);return `<div class="rpgSkillRow"><div class="rpgSkillInfo"><div class="rpgSkillName">${skill.emoji} ${skill.name} · Lv.${rank}/${skill.max}${isW?'<span class="gwWeaponSkillTag79">청록의 지팡이 기본 스킬</span>':''}</div><div class="rpgSkillDesc">${skill.desc}</div></div>${isW?'<button class="rpgSkillInvest" disabled>AUTO</button>':`<button class="rpgSkillInvest" data-player-skill="${skill.id}" ${rpgState.skillPoints<=0||rank>=skill.max?'disabled':''}>${rank>=skill.max?'MAX':rank?'강화 · 1 SP':'습득 · 1 SP'}</button>`}</div>`}).join('')}</div></div>`;h.querySelectorAll('[data-player-skill]').forEach(b=>b.onclick=()=>{rpgSpendSkill('player',b.dataset.playerSkill);rpgRenderPlayerSkillsPage(view)})};
const OLD_RENDER_PRAYER932=rpgRenderPrayer;
rpgRenderPrayer=function(){const r=OLD_RENDER_PRAYER932.apply(this,arguments);ensureSeriaUi();refreshSeriaQuest();return r};
const OLD_OPEN_PRAYER932=rpgOpenPrayer;
rpgOpenPrayer=function(){const r=OLD_OPEN_PRAYER932.apply(this,arguments);setTimeout(refreshSeriaQuest,0);return r};

/* ---------- Wolf King patterns ---------- */
function isWolf(e){return !!e&&e.type==='wolfBoss'}
function ws(e){if(!e._wolf932)e._wolf932={turn:0,normalCount:0,cast:null,castRate:1,busy:false,rage1:false,rage2:false,qualification:false,qualified:false,qualificationResolved4938:false,rageActive:false,rageLevel:0,rageHit:0,perfect:0,parryInput:null,nextRoar:5+rand(2),nextSweep:9999,sweepBefore70:false,sweepBefore40:false,sweepCastStage:0,nextBite:9999,biteUses:0,chainUsed:false,breakMode:false,breakHp:600,breakMax:600,baseDefense:Number(e.defense)||0,baseMagicDefense:Number(e.magicDefense)||Number(e.defense)||0};return e._wolf932}
function findWolf(){const b=rpgState.field?.battle;if(!b)return null;const i=b.enemies.findIndex(isWolf);return i<0?null:{e:b.enemies[i],i}}
let wolfNoticeTimer932=0;
function ensureWolfHud(){const stage=q('#rpgBattleStage');if(!stage)return;if(!q('#gwWolfNotice932')){const n=document.createElement('div');n.id='gwWolfNotice932';stage.appendChild(n)}if(!q('#gwWolfAtb932')){const d=document.createElement('div');d.id='gwWolfAtb932';d.innerHTML='<div class="gwWolfHudHead932"><span>늑대왕 ATB</span><span id="gwWolfAtbText932">0%</span></div><div class="gwWolfTrack932"><i id="gwWolfAtbFill932"></i></div>';stage.appendChild(d)}if(!q('#gwWolfBreak932')){const d=document.createElement('div');d.id='gwWolfBreak932';d.innerHTML='<div class="gwWolfHudHead932"><span>BREAK</span><span id="gwWolfBreakText932">600 / 600</span></div><div class="gwWolfTrack932"><i id="gwWolfBreakFill932"></i></div>';stage.appendChild(d)}if(!q('#gwWolfParryFx932')){const im=document.createElement('img');im.id='gwWolfParryFx932';im.src=PARRY_FX;stage.appendChild(im)}if(!q('#gwWolfParry932')){const d=document.createElement('div');d.id='gwWolfParry932';d.innerHTML='<button type="button" id="gwWolfParryBtn932">패링!</button>';(q('#rpgBattlePage .rpgBattleLower')||stage.parentElement).prepend(d);q('#gwWolfParryBtn932').addEventListener('click',wolfParryInput)}if(!q('#gwWolfChain932')){const d=document.createElement('div');d.id='gwWolfChain932';d.innerHTML='<button type="button" id="gwWolfChainAtk932">연계 공격</button><button type="button" class="def" id="gwWolfChainDef932">연계 방어</button>';(q('#rpgBattlePage .rpgBattleLower')||stage.parentElement).prepend(d);q('#gwWolfChainAtk932').addEventListener('click',wolfChainAttack);q('#gwWolfChainDef932').addEventListener('click',wolfChainDefense)}}
function wolfNotice(text,ms=2500){if(!/(격노|자격|바람|광역|휩쓸기)/.test(String(text||'')))return;ensureWolfHud();const n=q('#gwWolfNotice932');if(!n)return;n.textContent=text;n.classList.add('show');clearTimeout(wolfNoticeTimer932);wolfNoticeTimer932=setTimeout(()=>n.classList.remove('show'),ms)}
function playerUnit(){return (rpgState.field?.party||[]).find(u=>u.id==='player')||null}
function wolfPartyEl(u){return q(`#rpgBattleUnits [data-party-unit="${u?.id}"]`)}
function wolfBossEl(e){const i=rpgState.field?.battle?.enemies?.indexOf(e)??-1;return i>=0?q(`#rpgBattleUnits [data-battle-enemy="${i}"]`):null}
function syncWolfHud(){ensureWolfHud();const hit=findWolf(),atb=q('#gwWolfAtb932'),br=q('#gwWolfBreak932'),pb=q('#gwWolfParry932'),cb=q('#gwWolfChain932');if(!hit){q('#gwWolfParryFx932')?.classList.remove('show');atb?.classList.remove('show');br?.classList.remove('show');pb?.classList.remove('show');cb?.classList.remove('show');return}const s=ws(hit.e);const parryVisible=s.rageActive||(Date.now()<(s.rageResultUntil4946||0));if(!parryVisible)q('#gwWolfParryFx932')?.classList.remove('show');atb?.classList.toggle('show',parryVisible&&gwWolfIsLocalMarked4937(s));const pct=Math.max(0,Math.min(100,Number(hit.e.gauge)||0));const af=q('#gwWolfAtbFill932'),at=q('#gwWolfAtbText932');if(af)af.style.width=pct+'%';if(at)at.textContent=Math.floor(pct)+'%';br?.classList.toggle('show',s.breakMode);const bp=Math.max(0,Math.min(100,s.breakHp/s.breakMax*100)),bf=q('#gwWolfBreakFill932'),bt=q('#gwWolfBreakText932');if(bf)bf.style.width=bp+'%';if(bt)bt.textContent=`${Math.max(0,Math.ceil(s.breakHp))} / ${s.breakMax}`;pb?.classList.toggle('show',parryVisible&&gwWolfIsLocalMarked4937(s));const btn=q('#gwWolfParryBtn932');if(btn){btn.disabled=!s.rageActive;btn.textContent=s.rageActive?'패링!':'패링 종료';}const living=(rpgState.field?.party||[]).filter(u=>!u.dead),ready=living.length&&living.every(u=>(u.gauge||0)>=100);cb?.classList.toggle('show',s.breakMode&&ready&&!s.chainUsed);document.querySelectorAll('.gwWolfMarked932').forEach(x=>x.classList.remove('gwWolfMarked932'));if(s.rageActive)wolfPartyEl((rpgState.field?.party||[]).find(u=>u.id===s.markedId4936)||playerUnit())?.classList.add('gwWolfMarked932');const el=wolfBossEl(hit.e);if(el){el.classList.toggle('gwWolfRage1_932',s.rageActive&&s.rageLevel===1);el.classList.toggle('gwWolfRage2_932',s.rageActive&&s.rageLevel===2)}}
function wolfParryFx(u){const stage=q('#rpgBattleStage'),fx=q('#gwWolfParryFx932'),el=wolfPartyEl(u);if(!stage||!fx||!el||!PARRY_FX)return;const r=el.getBoundingClientRect(),sr=stage.getBoundingClientRect();fx.style.left=(r.left-sr.left+r.width/2)+'px';fx.style.top=(r.top-sr.top+r.height/2)+'px';fx.classList.remove('show');void fx.offsetWidth;fx.classList.add('show')}
function wolfParryInput(){const hit=findWolf();if(!hit)return;const s=ws(hit.e);if(!s.rageActive||s.parryInput!==null||!gwWolfIsLocalMarked4937(s))return;s.parryInput=Math.max(0,Math.min(100,Number(hit.e.gauge)||0));try{HuNyangDiag.line('RPG_WOLF_PARRY_INPUT_4934',`level=${s.rageLevel}|hit=${s.rageHit+1}|atb=${s.parryInput.toFixed(2)}`)}catch(_){}window.gwWolfJudge935?.('INPUT',`ATB ${s.parryInput.toFixed(1)}%`)}
function wolfDamage(u,raw,label){if(!u||u.dead)return 0;const before=u.hp,res=rpgApplyDamage(u,raw,false);requestAnimationFrame(()=>rpgShowDamage(`#rpgBattleUnits [data-party-unit="${u.id}"]`,`-${res.hpDamage}`,false));rpgLog(`🐺 ${label} · ${u.name} ${res.hpDamage} 피해 · HP ${before} → ${u.hp}`);return res.hpDamage}
function wolfAttackPower(e,mul=1){return Math.max(1,(Number(e.attack)||1)*mul)}

/* v4.9.37 Wolf sprite engine: single mapped PNG set, no duplicate image layers. */
const GW_WOLF_4936={"normal":"assets/images/0106_ebfcdce56c.png","claw":"assets/images/0107_51b62cfce9.png","hit":"assets/images/0108_6756ae20ac.png","roar":"assets/images/0109_ec06e9fd21.png","bite":"assets/images/0110_7b975375ee.png","biteHit":"assets/images/0111_785c0d3b77.png","sweep":"assets/images/0112_d89b0b4611.png","sweepHit":"assets/images/0113_c07ca480e7.png","rage1":"assets/images/0114_ce0cdfac53.png","rage1Attack":"assets/images/0115_d8b1f24f2e.png","rage1Hit":"assets/images/0116_77b97c9d65.png","rage2":"assets/images/0117_982cfe7f94.png","rage2Attack":"assets/images/0118_56b0e28578.png","rage2Hit":"assets/images/0119_dda527b69e.png","qualification":"assets/images/0120_f7f2f67106.png","qualified":"assets/images/0121_1206c6c302.png","qualifiedAttack":"assets/images/0122_9643c0b260.png","qualifiedHit":"assets/images/0123_c304ca25f1.png","stunned":"assets/images/0124_7fee117470.png","sweepAttack":"assets/images/0125_82a2a22fdc.png"};
// v4.9.44: ONE sprite slot. Separate idle from normal attack; no image overlays.
let gwWolfMotionToken4936=0;
function gwWolfImage4943(e){
 const el=wolfBossEl(e);if(!el)return null;
 el.classList.remove('gwWolfSingleArt4941');
 el.querySelectorAll(':scope > .gwWolfSprite4936').forEach(n=>n.remove());
 const img=el.querySelector('.rpgBattleUnitSprite img');
 if(img&&!img.dataset.wolfBase4943)img.dataset.wolfBase4943=img.src;
 return img;
}
function gwWolfSprite4936(e,key,duration=0){
 const img=gwWolfImage4943(e);if(!img)return;
 if(key==='normal'){img.src=img.dataset.wolfBase4943;}
 else if(key==='attack'){img.src=GW_WOLF_4936.normal;}
 else if(GW_WOLF_4936[key]){img.src=GW_WOLF_4936[key];}
 else return;
 img.dataset.wolfKey=key;
 img.classList.remove('gwWolfStep4943');
 img.style.animation='none';
 if(duration>0){void img.offsetWidth;img.classList.add('gwWolfStep4943');img.style.animation='gwWolfStep4943 '+duration+'ms ease-in-out both';}
 // Preserve transient attack art through a battle rerender caused by an incoming hit.
 if(duration>0)e._wolfSpriteMotion4936={key,until:performance.now()+duration};
 const token=++gwWolfMotionToken4936;
 if(duration>0)setTimeout(()=>{if(token===gwWolfMotionToken4936){e._wolfSpriteMotion4936=null;img.classList.remove('gwWolfStep4943');gwWolfStateSprite4936(e)}},duration);
}
function gwWolfStateSprite4936(e){
 const img=gwWolfImage4943(e);if(!img)return;
 const st=ws(e);
 const motion=e._wolfSpriteMotion4936;
 const moving=motion&&performance.now()<motion.until;
 const key=moving?motion.key:(st.stunned4936?'stunned':st.breakMode?'qualification':st.cast==='sweep'?'sweep':st.cast==='roar'?'roar':st.rageActive?(st.rageLevel===2?'rage2':'rage1'):st.qualified?'qualified':'normal');
 if(moving){const src=GW_WOLF_4936[key];if(src&&img.getAttribute('src')!==src){img.src=src;img.dataset.wolfKey=key}return;}
 if(img.classList.contains('gwWolfStep4943'))return;if(img.dataset.wolfKey===key && img.getAttribute('src')===(key==='normal'?img.dataset.wolfBase4943:(key==='attack'?GW_WOLF_4936.normal:GW_WOLF_4936[key])))return;
 gwWolfSprite4936(e,key,0);
}
window.gwWolfStateSprite4936=gwWolfStateSprite4936;
function gwWolfHit4936(u,key,count=1){
 const el=wolfPartyEl(u);if(!el||!GW_WOLF_4936[key])return;
 for(let i=0;i<count;i++)setTimeout(()=>{
  if(!el.isConnected)return;
  const fx=document.createElement('img');fx.className='gwWolfHit4936';fx.src=GW_WOLF_4936[key];el.appendChild(fx);setTimeout(()=>fx.remove(),510);
 },i*230);
}
/* v4.9.37 Split build 2: local marked HUD, weighted player mark, BREAK sprite. */
function gwWolfLocalPlayerId4937(){return String(rpgState?.localPlayerId||rpgState?.multiplayer?.localPlayerId||rpgState?.multiplayer?.playerId||'player')}
function gwWolfIsLocalMarked4937(st){return String(st?.markedId4936||'')===gwWolfLocalPlayerId4937()}
function gwWolfParryTarget4936(){
 const living=(rpgState.field?.party||[]).filter(u=>!u.dead);
 const humans=living.filter(u=>u.id==='player'||u.isPlayer===true||u.isHuman===true||u.isRemotePlayer===true);
 if(!humans.length)return playerUnit();
 if(humans.length===1)return humans[0];
 const candidates=humans.map(u=>{
  const row=String(u.line||u.row||u.formationLine||'').toLowerCase();
  const numeric=Number(u.position);
  const index=Number.isFinite(numeric)?((numeric%3)+3)%3:null;
  // Existing RPG formation uses front=2, middle=1, rear=0.
  const weight=row==='rear'||row==='back'||row==='후열'||index===0?10:row==='middle'||row==='mid'||row==='중열'||index===1?20:70;
  return {unit:u,weight};
 });
 const sum=candidates.reduce((v,c)=>v+c.weight,0);
 let roll=Math.random()*sum;
 for(const c of candidates){roll-=c.weight;if(roll<0)return c.unit}
 return candidates[candidates.length-1].unit;
}

function wolfNormal(e,index){const s=ws(e);if(s.stunned4936){s.stunned4936=false;gwWolfStateSprite4936(e)}const living=(rpgState.field?.party||[]).filter(u=>!u.dead);if(!living.length)return;s.turn++;s.normalCount++;const t=rpgPickPartyTargetByLine(living).target;rpgResetGauge(e);gwWolfSprite4936(e,s.qualified?'qualifiedAttack':'attack',620);gwWolfHit4936(t,s.qualified?'qualifiedHit':'hit');rpgPhysicalHit(e,t,e.name,t.name,`#rpgBattleUnits [data-party-unit="${t.id}"]`,wolfAttackPower(e,1));syncWolfHud()}
function wolfClaw(e){const s=ws(e),living=(rpgState.field?.party||[]).filter(u=>!u.dead);if(!living.length)return;s.turn++;s.normalCount=0;const t=rpgPickPartyTargetByLine(living).target;rpgResetGauge(e);gwWolfSprite4936(e,s.qualified?'qualifiedAttack':'claw',800);gwWolfHit4936(t,s.qualified?'qualifiedHit':'hit',2);rpgLog(`🐾 ${e.name}의 연속 할퀴기!`);for(let i=0;i<2;i++)setTimeout(()=>{if(!t.dead)rpgPhysicalHit(e,t,e.name,t.name,`#rpgBattleUnits [data-party-unit="${t.id}"]`,wolfAttackPower(e,.60+Math.random()*.10))},i*180);syncWolfHud()}
function beginWolfCast(e,type,rate){const s=ws(e);s.cast=type;s.castRate=rate;e.gauge=0;if(type==='sweep')gwWolfSprite4936(e,'sweep',0);wolfNotice(type==='roar'?'늑대왕이 포효를 준비합니다.':type==='sweep'?'늑대 왕의 몸에 바람이 휘몰아칩니다.':'');syncWolfHud()}
function wolfRoar(e){const s=ws(e);s.cast=null;s.castRate=1;s.turn++;s.nextRoar=s.turn+5+rand(2);rpgResetGauge(e);gwWolfSprite4936(e,'roar',0);setTimeout(()=>{if(!ws(e).rageActive)gwWolfStateSprite4936(e)},900);for(const u of (rpgState.field?.party||[]).filter(u=>!u.dead))u._wolfRoarTurns932=2;rpgLog('📣 늑대왕의 포효! 아군 전체 공격력 -20% · ATB 충전 속도 -30% · ATB 2턴');try{rpgRenderBattlePartyStrip()}catch(_){}wolfNotice('포효! 공격력 -20% · ATB 속도 -30% · 2턴');syncWolfHud()}
function wolfFixedDamage932(u,amount,label){if(!u||u.dead)return 0;if(window.HuNyangDevInvincible?.enabled?.())return 0;let dmg=Math.max(0,Math.round(amount));if((u._wolfChainDefenseTurns932||0)>0)dmg=Math.max(0,Math.round(dmg*.05));const before=u.hp;u.hp=Math.max(0,u.hp-dmg);if(u.hp<=0)u.dead=true;requestAnimationFrame(()=>rpgShowDamage(`#rpgBattleUnits [data-party-unit="${u.id}"]`,`-${dmg}`,false));rpgLog(`🌪️ ${label} · ${u.name} ${dmg} 고정 피해 · HP ${before} → ${u.hp}`);return dmg}
function wolfSweep(e){const s=ws(e),targets=(rpgState.field?.party||[]).filter(u=>!u.dead),n=Math.max(1,targets.length);s.cast=null;s.castRate=1;s.turn++;s.nextSweep=9999;if(s.sweepCastStage===1)s.sweepBefore70=true;if(s.sweepCastStage===2)s.sweepBefore40=true;s.sweepCastStage=0;rpgResetGauge(e);gwWolfSprite4936(e,s.qualified?'qualifiedAttack':'sweepAttack',740);for(const u of targets){gwWolfHit4936(u,s.qualified?'qualifiedHit':'sweepHit');const dmg=Math.max(1,Math.round((u.derived?.maxHp||u.hp||1)*.80/n));wolfFixedDamage932(u,dmg,'바람 휩쓸기')}wolfNotice('바람 휩쓸기! 아군 전체 고정 피해');syncWolfHud()}
function frontTarget(){const live=(rpgState.field?.party||[]).filter(u=>!u.dead);for(const mod of [2,1,0]){const a=live.filter(u=>u.position%3===mod);if(a.length)return a[Math.floor(Math.random()*a.length)]}return live[0]||null}
function wolfBite(e){const s=ws(e),t=frontTarget();if(!t)return;s.turn++;s.biteUses++;s.nextBite=s.turn+6;rpgResetGauge(e);gwWolfSprite4936(e,s.qualified?'qualifiedAttack':'bite',780);gwWolfHit4936(t,s.qualified?'qualifiedHit':'biteHit');rpgPhysicalHit(e,t,e.name,t.name,`#rpgBattleUnits [data-party-unit="${t.id}"]`,wolfAttackPower(e,1.5));if(!t.dead){t._wolfBleedTurns932=5;rpgLog(`🩸 ${t.name}에게 출혈 · ATB 행동마다 최대 HP 2% · 5턴`);try{rpgRenderBattlePartyStrip()}catch(_){}}wolfNotice(`물어뜯기! ${t.name}에게 출혈`);syncWolfHud()}
function cancelWolfReserved(e){const s=ws(e);s.cast=null;s.castRate=1;s.busy=false;e.gauge=0}
function beginRage(e,level){const s=ws(e);cancelWolfReserved(e);if(level===1)s.rage1=true;else s.rage2=true;s.rageActive=true;s.rageLevel=level;s.rageHit=0;s.perfect=0;s.perfectByLevel=s.perfectByLevel||{1:0,2:0};s.perfectByLevel[level]=0;s.parryInput=null;s.rageSession=(Number(s.rageSession)||0)+1;s.markedId4936=(gwWolfParryTarget4936()?.id||'player');const marked=(rpgState.field?.party||[]).find(u=>u.id===s.markedId4936);if(marked)marked.gauge=0;gwWolfSprite4936(e,'roar',0);setTimeout(()=>{if(ws(e).rageActive&&ws(e).rageLevel===level)gwWolfSprite4936(e,level===2?'rage2':'rage1',0)},650);const p=(rpgState.field?.party||[]).find(u=>u.id===s.markedId4936)||playerUnit();wolfNotice(`늑대왕이 ${p?.name||rpgState.name}에 대해 격노합니다. 게이지가 100%가 될 때 버튼을 눌러 패리하세요.`,4200);rpgLog(`🔥 격노 ${level}단계 시작 · 플레이어 표식 · 최대 5연격 · PERFECT 3회 시 즉시 종료`);try{HuNyangDiag.line('RPG_WOLF_RAGE_BEGIN_4934',`level=${level}|session=${s.rageSession}|perfect=0|hit=0`)}catch(_){}syncWolfHud()}
function endRage(e){const s=ws(e);s.rageActive=false;s.rageResultUntil4946=Date.now()+1000;s.rageLevel=0;s.parryInput=null;e.gauge=0;gwWolfStateSprite4936(e);if(s.rage1&&s.nextBite===9999)s.nextBite=s.turn+1;wolfNotice('격노 패턴 종료');syncWolfHud()}
function resolveRageHit(e){const s=ws(e),p=(rpgState.field?.party||[]).find(u=>u.id===s.markedId4936)||playerUnit();if(!p||p.dead){endRage(e);return}const pct=s.parryInput==null?-1:s.parryInput,perfect=pct>=95&&pct<=100,parry=pct>=90&&pct<95,attackMul=s.rageLevel===2?4:3;const def=Math.max(0,Number(p?.derived?.physicalDefense??p?.derived?.defense??p?.defense)||0);const base=Math.max(0,(wolfAttackPower(e,attackMul)-def)/5);gwWolfSprite4936(e,s.rageLevel===2?'rage2Attack':'rage1Attack',540);if(!perfect)gwWolfHit4936(p,s.rageLevel===2?'rage2Hit':'rage1Hit');s.rageHit++;s.perfectByLevel=s.perfectByLevel||{1:0,2:0};let result='FAIL',dmg=0;if(perfect){s.perfect++;s.perfectByLevel[s.rageLevel]=(Number(s.perfectByLevel[s.rageLevel])||0)+1;wolfParryFx(p);window.gwWolfJudge935?.('PERFECT',`PERFECT PARRY · ${s.perfectByLevel[s.rageLevel]} / 3`);rpgLog(`✨ PERFECT PARRY · 격노 ${s.rageLevel}단계 ${s.rageHit}타 피해 0`);result='PERFECT'}else if(parry){dmg=wolfDamage(p,base*.8+def,'격노 패링');window.gwWolfJudge935?.('PARRY',`PARRY · 피해 ${dmg}`);result='PARRY'}else{dmg=wolfDamage(p,base+def,'격노 연격');window.gwWolfJudge935?.('FAIL',`FAIL · 피해 ${dmg}`)}try{HuNyangDiag.line('RPG_WOLF_PARRY_RESULT_4934',`level=${s.rageLevel}|hit=${s.rageHit}|atb=${pct.toFixed(2)}|result=${result}|damage=${dmg}|perfectStage=${s.perfectByLevel[s.rageLevel]||0}`)}catch(_){}s.parryInput=null;e.gauge=0;if((s.perfectByLevel[s.rageLevel]||0)>=3||s.rageHit>=5)endRage(e);syncWolfHud()}
function beginQualification(e){const s=ws(e);if(s.qualificationResolved4938||s.qualified||s.breakMode)return;cancelWolfReserved(e);s.qualificationResolved4938=true;s.qualification=true;s.breakMode=true;s.breakHp=s.breakMax=600;s.chainUsed=false;s.qualificationStarted4947=performance.now();e.gauge=0;gwWolfSprite4936(e,'qualification',0);wolfNotice('늑대왕의 자격 · BREAK 600 · 연계 공격 또는 연계 방어 중 하나를 선택하세요.',4200);rpgLog('👑 늑대왕의 자격 충전 시작 · BREAK 600');syncWolfHud()}
function qualify(e){const s=ws(e);if(!s.breakMode||s.stunned4936)return;s.breakMode=false;s.qualification=false;s.qualificationResolved4938=true;s.qualified=true;s.chainUsed=true;e.attack=Math.round((Number(e.attack)||1)*3);e.defense=Math.max(0,(Number(e.defense)||0)-20);e.magicDefense=Math.max(0,(Number(e.magicDefense)||Number(e.defense)||0)-20);e.gauge=0;gwWolfSprite4936(e,'qualified',0);wolfNotice('늑대왕의 자격 발동! 공격력 ×3 · 공격속도 ×4 · 방어력 -20',3600);rpgLog('👑 늑대왕의 자격 발동!');syncWolfHud()}
function currentAtk932(u){const p=typeof rpgWeaponPhysicalPower==='function'?rpgWeaponPhysicalPower(u):0,m=typeof rpgWeaponMagicPower==='function'?rpgWeaponMagicPower(u):0;return Math.max(p,m,u?.derived?.meleeAtk||0,u?.derived?.rangedAtk||0,u?.derived?.magicAtk||0)}
function wolfChainAttack(){const hit=findWolf();if(!hit)return;const s=ws(hit.e),living=(rpgState.field?.party||[]).filter(u=>!u.dead);if(!s.breakMode||s.chainUsed||!living.length||!living.every(u=>(u.gauge||0)>=100))return;s.chainUsed=true;for(const u of living)u.gauge=0;syncWolfHud();const apply=()=>{const dmg=Math.max(1,Math.round(living.reduce((a,u)=>a+currentAtk932(u),0)*1.5));s.breakHp=Math.max(0,s.breakHp-dmg);rpgLog(`⚔️ 연계 공격! BREAK -${dmg}`);if(s.breakHp<=0){s.breakMode=false;s.qualification=false;s.qualificationResolved4938=true;s.stunned4936=true;hit.e.gauge=0;gwWolfSprite4936(hit.e,'stunned',0);wolfNotice('BREAK 성공! 늑대왕의 자격을 저지했습니다.',3300);rpgLog('💥 늑대왕의 자격 저지 성공!')}syncWolfHud()};if(typeof window.gwPlayChainCinematic4926==='function')window.gwPlayChainCinematic4926('attack',living,hit.i,apply);else apply()}
function wolfChainDefense(){const hit=findWolf();if(!hit)return;const s=ws(hit.e),living=(rpgState.field?.party||[]).filter(u=>!u.dead);if(!s.breakMode||s.chainUsed||!living.length||!living.every(u=>(u.gauge||0)>=100))return;s.chainUsed=true;for(const u of living)u.gauge=0;syncWolfHud();const apply=()=>{for(const u of living)u._wolfChainDefenseTurns932=5;wolfNotice('연계 방어! 아군 전체 피해감소 95% · ATB 5턴');rpgLog('🛡️ 연계 방어 · 아군 전체 ATB 5턴간 피해감소 95%');syncWolfHud()};if(typeof window.gwPlayChainCinematic4926==='function')window.gwPlayChainCinematic4926('defense',living,hit.i,apply);else apply()}
function wolfThreshold(e){const s=ws(e);if(e.dead||s.rageActive||s.breakMode||s.qualified||Date.now()<(s.rageResultUntil4946||0))return;const p=(e.hp||0)/Math.max(1,e.maxHp||1);if(s.cast)return;
// Priority: qualification > rage at 40/70% > scripted sweep at 60/85%.
if(p<=.20&&!s.qualification&&!s.qualified&&!s.qualificationResolved4938){beginQualification(e);return}
if(p<=.40&&!s.rage2){beginRage(e,2);return}
if(p<=.70&&!s.rage1){beginRage(e,1);return}
// Once per band: 90–80% before rage1; 70–50% after rage1 and before rage2.
if(!s.rage1&&!s.sweepBefore70&&p<=.85&&p>=.80){s.sweepCastStage=1;beginWolfCast(e,'sweep',.8);return}
if(s.rage1&&!s.rage2&&!s.sweepBefore40&&p<=.60&&p>=.50){s.sweepCastStage=2;beginWolfCast(e,'sweep',.8);return}
}
const OLD_APPLY_932=rpgApplyDamage;
rpgApplyDamage=function(target,amount,magic=false){let a=amount;if(isWolf(target)){const s=ws(target);if(s.breakMode){const def=magic?(target.magicDefense||0):(target.defense||0),d=Math.max(0,rpgRound(Math.max(0,a)-def));s.breakHp=Math.max(0,s.breakHp-d);syncWolfHud();if(s.breakHp<=0){s.breakMode=false;s.qualification=false;s.qualificationResolved4938=true;s.stunned4936=true;target.gauge=0;gwWolfStateSprite4936(target);wolfNotice('BREAK 성공! 늑대왕의 자격을 저지했습니다.',3200)}return {hpDamage:d,absorbed:0,before:target.hp,after:target.hp,breakDamage:d}}if(s.rageActive)a*=s.rageLevel===2?.20:.50}const party=rpgState.field?.party||[];if(party.includes(target)&&(target._wolfChainDefenseTurns932||0)>0)a*=.05;const res=OLD_APPLY_932(target,a,magic);if(isWolf(target))setTimeout(()=>{wolfThreshold(target);gwWolfStateSprite4936(target)},0);return res};
const OLD_SPEED932=rpgUnitAttackSpeed;
rpgUnitAttackSpeed=function(unit){let sp=OLD_SPEED932(unit);if(isWolf(unit)){const s=ws(unit);if(s.rageActive)sp*=s.rageLevel===2?3.5:2.5;if(s.qualified)sp*=5;/* Cast-rate applied once in the active ATB tick. */}else if((unit?._wolfRoarTurns932||0)>0)sp*=.70;return rpgClamp(sp,.1,10)};
function withRoarAttackDebuff932(caster,fn){if(!(caster?._wolfRoarTurns932>0)||!caster.derived)return fn();const d=caster.derived,old={meleeAtk:d.meleeAtk,rangedAtk:d.rangedAtk,magicAtk:d.magicAtk,patk:d.patk,matk:d.matk};d.meleeAtk*=.8;d.rangedAtk*=.8;d.magicAtk*=.8;d.patk*=.8;d.matk*=.8;try{return fn()}finally{Object.assign(d,old)}}
const OLD_PHIT932=rpgPhysicalHit;rpgPhysicalHit=function(attacker,...args){return withRoarAttackDebuff932(attacker,()=>OLD_PHIT932(attacker,...args))};
const OLD_UAS932=rpgUseActiveSkill;rpgUseActiveSkill=function(caster,...args){return withRoarAttackDebuff932(caster,()=>OLD_UAS932(caster,...args))};
function tickWolfEffects932(u){if(!u)return;if((u._wolfRoarTurns932||0)>0)u._wolfRoarTurns932--;if((u._wolfBleedTurns932||0)>0&&!u.dead){const beforeTurns=Number(u._wolfBleedTurns932)||0;u._wolfBleedTurns932=Math.max(0,beforeTurns-1);const dmg=Math.max(1,Math.round((u.derived?.maxHp||u.hp||1)*.02));const before=u.hp;const actual=window.HuNyangDevInvincible?.enabled?.()?0:dmg;u.hp=Math.max(0,u.hp-actual);if(u.hp<=0)u.dead=true;rpgLog(`🩸 출혈 · ${u.name} ${actual} 고정 피해 · HP ${before} → ${u.hp} · 남은 ${u._wolfBleedTurns932}턴`);try{HuNyangDiag.line('RPG_WOLF_BLEED_TICK_4935',`target=${u.id}|damage=${actual}|hp=${before}->${u.hp}|turn=${beforeTurns}->${u._wolfBleedTurns932}`)}catch(_){}requestAnimationFrame(()=>rpgShowDamage(`#rpgBattleUnits [data-party-unit="${u.id}"]`,`-${actual}`,false))}if((u._wolfChainDefenseTurns932||0)>0)u._wolfChainDefenseTurns932--}
window.gwTickWolfEffectsOnAtb52=tickWolfEffects932;
const OLD_PLAYER_ACTION932=rpgExecutePlayerAction;rpgExecutePlayerAction=function(action){const p=playerUnit(),g=p?.gauge||0,r=OLD_PLAYER_ACTION932.apply(this,arguments);return r};
const OLD_AI_ACTION932=rpgAiAtbAction;rpgAiAtbAction=function(ai){const breakWolf=findWolf();if(breakWolf&&ws(breakWolf.e).breakMode&&Number(breakWolf.e.gauge)>=50)return;const g=ai?.gauge||0,r=OLD_AI_ACTION932.apply(this,arguments);return r};
const OLD_ENEMY_932=rpgEnemyAtbAction;
rpgEnemyAtbAction=function(e,index){if(!isWolf(e))return OLD_ENEMY_932.apply(this,arguments);if(e.dead)return;const s=ws(e);wolfThreshold(e);if(s.rageActive){if(e.gauge>=100)resolveRageHit(e);return}if(s.breakMode){if(e.gauge>=100){try{HuNyangDiag.line('RPG_WOLF_QUALIFY_TIME_4947',`seconds=${((performance.now()-(s.qualificationStarted4947||performance.now()))/1000).toFixed(2)}|gauge=${e.gauge}`)}catch(_){}qualify(e)}return}if(s.stunned4936){s.stunned4936=false;gwWolfStateSprite4936(e);rpgResetGauge(e);rpgLog('💫 늑대왕이 기절에서 회복했습니다.');syncWolfHud();return}if(s.cast){if(e.gauge<100)return;if(s.cast==='roar')return wolfRoar(e);if(s.cast==='sweep')return wolfSweep(e)}if(e.gauge<100)return;/* priority: normal < claw < roar <= sweep < bite */if(s.qualified)return wolfNormal(e,index);if(s.rage1&&s.biteUses<2&&s.turn>=s.nextBite)return wolfBite(e);if(s.turn>=s.nextRoar)return beginWolfCast(e,'roar',1);if(s.normalCount>=3)return wolfClaw(e);return wolfNormal(e,index)};
// Do not allow marked AI/player to act while rage parry is active.
const OLD_AI_ACTION_4946=rpgAiAtbAction;
rpgAiAtbAction=function(u){const w=findWolf();if(w&&ws(w.e).rageActive&&String(ws(w.e).markedId4936)===String(u?.id)){if(u)u.gauge=0;return}return OLD_AI_ACTION_4946.apply(this,arguments)};
const OLD_PLAYER_ACTION_4946=rpgExecutePlayerAction;
rpgExecutePlayerAction=function(action){const w=findWolf();if(w&&ws(w.e).rageActive&&String(ws(w.e).markedId4936)==='player'){const p=playerUnit();if(p)p.gauge=0;return false}return OLD_PLAYER_ACTION_4946.apply(this,arguments)};
const OLD_RENDER_BATTLE932=rpgRenderBattlePage;rpgRenderBattlePage=function(){const r=OLD_RENDER_BATTLE932.apply(this,arguments);ensureWolfHud();syncWolfHud();return r};
const OLD_BEGIN_BATTLE932=rpgBeginBattle;rpgBeginBattle=function(){const r=OLD_BEGIN_BATTLE932.apply(this,arguments);setTimeout(()=>{const h=findWolf();if(h){ws(h.e);wolfThreshold(h.e);syncWolfHud()}},0);return r};
const OLD_BATTLE_TICK932=rpgBattleTick;rpgBattleTick=function(){const r=OLD_BATTLE_TICK932.apply(this,arguments);const h=findWolf();if(h){wolfThreshold(h.e);syncWolfHud()}return r};

try{HuNyangDiag.line('RPG_WOLF_V4938_READY','qualification_once=on|break_success_reentry=blocked|stun_recovery=one_enemy_atb|multiplayer_deferred=on')}catch(_){}
try{HuNyangDiag.line('RPG_V4932_READY','wolf_patterns=normal+claw+roar+sweep+bite+rage70+rage40+qualification20|priority=normal<claw<roar<=sweep<bite|threshold_cancel=wolf70,40,20+giant70,30,10|seria=first_meet+lv8_boss_mission+teal_staff|version=4.9.32')}catch(_){}
})();
