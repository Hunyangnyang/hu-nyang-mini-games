
(()=>{
  'use strict';
  const q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>[...r.querySelectorAll(s)];
  const pick=a=>a[Math.floor(Math.random()*a.length)];

  /* 4. Add a wolf class to normal wolf 2D battle sprites. */
  const oldUnit4904=rpgBattleUnit2DHtml;
  rpgBattleUnit2DHtml=function(u,enemy=false,index=0){
    let html=oldUnit4904.apply(this,arguments);
    if(enemy&&u?.type==='wolf'&&!u?.boss){
      html=html.replace('class="rpgBattleUnit2D enemy','class="rpgBattleUnit2D enemy gwWolf4904');
    }
    return html;
  };

  /* 5. Auto toggle: capture the whole row so center/top/bottom all work. */
  function toggleAuto4904(e){
    const row=e.target.closest?.('#rpgBattlePage .gwAutoRow53');
    if(!row)return;
    e.preventDefault();e.stopImmediatePropagation();
    const f=rpgState.field;if(!f?.battle)return;
    const now=performance.now();
    if(f._autoToggle4904&&now-f._autoToggle4904<220)return;
    f._autoToggle4904=now;
    f.autoBattle=!f.autoBattle;
    if(!rpgBattleTicker)rpgStartBattleTicker();
    window.gwSyncAuto53?.();
    rpgRenderBattlePage?.();
    try{HuNyangDiag.line('RPG_AUTO_TOGGLE',f.autoBattle?'ON':'OFF');HuNyangDiag.line('RPG_AUTO_STATE',`enabled=${f.autoBattle}`)}catch(_){}
    rpgSaveActiveSlot?.('rpgBattlePage','auto_battle_toggle');
  }
  /* v4.9.10 retired: document-level row capture caused UI/hitbox mismatch. */

  /* 6. Defer reward modal behind an explicit victory screen click. */
  const oldShowReward4904=rpgShowBattleReward;
  let pendingReward4904=null;
  function removeVictory4904(){q('#gwVictory4904')?.remove()}
  function showVictory4904(reward,levelUps){
    pendingReward4904={reward,levelUps};
    removeVictory4904();
    const stage=q('#rpgBattlePage');
    if(!stage){oldShowReward4904(reward,levelUps);pendingReward4904=null;return}
    const v=document.createElement('div');
    v.className='gwVictory4904';v.id='gwVictory4904';
    v.innerHTML='<div class="gwVictoryBox4904"><div class="gwVictoryTitle4904">승리</div><div class="gwVictoryTap4904">화면을 클릭하세요</div></div>';
    const resolveVictory4904=()=>{
      const p=pendingReward4904;if(!p)return;
      pendingReward4904=null;removeVictory4904();
      oldShowReward4904(p.reward,p.levelUps);
    };
    v.addEventListener('click',resolveVictory4904,{once:true});
    stage.appendChild(v);
    // The full-screen transparent hit target stays clickable; center only the label in the battle stage.
    const battleArea=q('#rpgBattleStage')||stage;
    const alignVictory=()=>{
      if(!v.isConnected)return;
      const rect=battleArea.getBoundingClientRect();
      const box=v.querySelector('.gwVictoryBox4904');
      if(!box)return;
      box.style.position='fixed';
      box.style.left=(rect.left+rect.width/2)+'px';
      box.style.top=(rect.top+rect.height/2)+'px';
      box.style.transform='translate(-50%, -50%)';
    };
    alignVictory();
    window.addEventListener('resize',alignVictory);
    v.addEventListener('click',()=>window.removeEventListener('resize',alignVictory),{once:true});
  }
  rpgShowBattleReward=showVictory4904;

  /* 7. Stage-1 class quest report and stage-2 boss assignment. */
  const REPORT={
    rubia:{
      pos:['전사에 재능이 있나 봐~ 생각보다 훨씬 빨랐네.','마음에 드는걸? 전열에서 버틸 근성은 충분해 보여.','좋아, 이 정도면 첫 시험은 제대로 통과했네.'],
      neg:['...빨리 왔네. 의외로 끈기는 있나 봐.','거짓말하는 건 아니겠지? 흥! 기록은 제대로 되어 있네.','벌써 끝냈어? 괜히 허세 부린 건 아닌 모양이네.'],
      bossPos:['다음은 진짜 시험이야. 라비엔 초원의 거대 슬라임을 쓰러뜨려 봐. 힘만 세다고 되는 상대는 아니야.','이번엔 거대 슬라임이야. 패턴을 보고 버티면서 쓰러뜨려야 전사라고 부를 수 있지.'],
      bossNeg:['다음은 거대 슬라임이야. 설마 여기까지 와서 겁먹고 도망가진 않겠지?','거대 슬라임을 잡고 와. 말로는 안 믿으니까 결과로 보여줘.'],
      sendPos:['잘 다녀와. 무리하진 말고, 네가 얼마나 성장했는지 보여줘.','기대하고 있을게. 이번에도 멋지게 끝내고 돌아와.'],
      sendNeg:['자, 이제 가봐. 귀찮게 여기서 시간 끌지 말고.','빨리 갔다 와. 실패했다고 징징거리면 진짜 귀찮으니까.'],
      bossType:'slimeBoss',quest:'전사 전직 의뢰 · 2차',bossName:'거대 슬라임'
    },
    kain:{
      pos:['꽤 빠르군. 도적에 필요한 감각이 있는 모양이야.','마음에 드는 속도네. 발도 빠르고 판단도 나쁘지 않아.','첫 시험은 충분히 합격점이야. 생각보다 제법인데.'],
      neg:['...빨리 왔군. 거짓말은 아닌 것 같네.','기록은 맞군. 허풍만 치는 타입은 아니었나 봐.','벌써 끝냈나? 최소한 시간 낭비는 안 하는군.'],
      bossPos:['다음 상대는 늑대왕이다. 빠른 움직임을 읽고 빈틈을 잡아야 해.','2차 시험은 늑대왕 토벌이다. 속도에 휘둘리지 말고 네 타이밍을 만들어.'],
      bossNeg:['다음은 늑대왕이다. 물려서 돌아오지만 마라. 귀찮으니까.','늑대왕을 잡아. 네가 정말 빠른지 그 녀석 상대로 확인하지.'],
      sendPos:['조심해서 다녀와. 네 방식대로 빈틈을 잡으면 충분할 거다.','잘 갔다 와. 돌아오면 다음 이야기를 하지.'],
      sendNeg:['이제 가. 오래 서 있으면 서로 피곤하잖아.','빨리 끝내고 와. 기다리는 것도 귀찮으니까.'],
      bossType:'wolfBoss',quest:'도적 전직 의뢰 · 2차',bossName:'늑대왕'
    }
  };
  function rel4904(k){return Number(window.V38_ensureRelations?.()?.[k]?.affinity)||0}
  function mentorArt4904(k,neg){
    const a=window.V38_ASSETS||{};
    return k==='rubia'?(neg?(a.warriorAnnoyed||a.warriorHappy):(a.warriorHappy||'')):(neg?(a.rogueSerious||a.rogueNormal):(a.rogueNormal||''));
  }
  function setTalk4904(k,text,next){
    window.V38_cancelNpcTimer?.();window.V38_classTalkActive=true;
    const neg=rel4904(k)<0,sel=q('#rpgGuildNpcSelect'),talk=q('#rpgGuildNpcTalk'),speech=q('#rpgGuildNpcSpeech'),name=q('#rpgGuildNpcName'),art=q('#rpgGuildNpcArt'),host=q('#rpgGuildNpcChoices');
    if(sel)sel.style.display='none';if(talk)talk.style.display='';
    if(speech)speech.textContent=text;if(name)name.textContent=k==='rubia'?'루비아(전사)':'카인(도적)';
    if(art)art.src=mentorArt4904(k,neg);
    if(host){host.innerHTML='';host.classList.remove('gwTwoChoice80');if(next){const b=document.createElement('button');b.type='button';b.textContent='계속';b.onclick=next;host.appendChild(b)}}
  }
  function acceptStage2_4904(k){
    const qst=rpgState.classQuest,d=REPORT[k];if(!qst||!d)return;
    qst.stage=2;qst.name=d.quest;qst.target=1;qst.kills=0;qst.completed=false;qst.rewarded=false;
    qst.bossType=d.bossType;qst.bossName=d.bossName;qst.stage2AcceptedAtTurn=Number(rpgState.worldTurn)||0;
    rpgSaveActiveSlot?.(null,'class_quest_stage2_accept');
    try{HuNyangDiag.line('RPG_CLASS_QUEST_STAGE2_ACCEPT',`${k}|boss=${d.bossType}`)}catch(_){}
    window.GW80ClassReturnReady?.();
    refreshStage2Bang4904();
  }
  function stage2Talk4904(k){
    const d=REPORT[k],neg=rel4904(k)<0;if(!d)return;
    setTalk4904(k,pick(neg?d.neg:d.pos),()=>{
      setTalk4904(k,pick(neg?d.bossNeg:d.bossPos),()=>{
        setTalk4904(k,pick(neg?d.sendNeg:d.sendPos),()=>{
          acceptStage2_4904(k);
          setTalk4904(k,`${d.bossName} 토벌이 2차 전직 의뢰로 등록됐어. 끝내고 다시 와.`,null);
        });
      });
    });
  }
  function stage1ReportReady4904(){
    const cq=rpgState.classQuest;
    return !!(cq&&!cq.rewarded&&cq.completed&&(Number(cq.stage)||1)===1&&cq.mentor);
  }
  function refreshStage2Bang4904(){
    const cq=rpgState.classQuest,ready=stage1ReportReady4904();
    qa('#rpgGuildNpcPage .gwClassQuestBang79').forEach(b=>{
      const k=b.closest('.guildNpcPortraitPick')?.querySelector('[data-guild-npc]')?.dataset.guildNpc;
      const show=ready&&k===cq.mentor;
      b.classList.toggle('gwStage2Ready4904',show);
      if(show)b.classList.add('show');
      else if(cq&&!cq.rewarded)b.classList.remove('gwStage2Ready4904');
    });
  }
  document.addEventListener('click',e=>{
    const bang=e.target.closest?.('#rpgGuildNpcPage .gwClassQuestBang79');
    if(!bang||!stage1ReportReady4904())return;
    const k=bang.closest('.guildNpcPortraitPick')?.querySelector('[data-guild-npc]')?.dataset.guildNpc;
    if(k!==rpgState.classQuest?.mentor)return;
    e.preventDefault();e.stopImmediatePropagation();
    stage2Talk4904(k);
  },true);

  /* Stage-2 completion: normal battles no longer count; only assigned boss does. */
  const oldVictory4904=rpgBattleVictory;
  rpgBattleVictory=function(){
    const cq=rpgState.classQuest,stage2=!!(cq&&!cq.rewarded&&(Number(cq.stage)||1)===2),bossType=cq?.bossType;
    const enemies=[...(rpgState.field?.battle?.enemies||[])],bossKilled=stage2&&enemies.some(e=>e?.type===bossType&&e.dead);
    let savedRewarded;
    if(stage2){savedRewarded=cq.rewarded;cq.rewarded=true}
    const v=oldVictory4904.apply(this,arguments);
    if(stage2){
      cq.rewarded=savedRewarded||false;
      if(bossKilled){cq.kills=1;cq.completed=true;try{rpgLog(`⚔️ 2차 전직 의뢰 목표 달성! ${cq.bossName||'보스'} 토벌 완료`);HuNyangDiag.line('RPG_CLASS_QUEST_STAGE2_COMPLETE',bossType)}catch(_){}}
      rpgSaveActiveSlot?.(null,'class_quest_stage2_progress');
    }
    return v;
  };

  /* v4.9.62: Stage-2 boss appearances are handled by the unified free-hunt
     rules in 070. The old delayed 2150ms spawn could overwrite a guild encounter. */

  /* Re-assert the mentor marker after the old v4.8.79 updater hides it. */
  const obsTarget=q('#rpgGuildNpcPageContent');
  if(obsTarget)new MutationObserver(()=>queueMicrotask(refreshStage2Bang4904)).observe(obsTarget,{childList:true,subtree:true});
  const oldShow4904=showPage;
  showPage=function(id,dir='auto'){
    const v=oldShow4904(id,dir);
    if(id==='rpgGuildNpcPage')setTimeout(refreshStage2Bang4904,40);
    return v;
  };
  setTimeout(refreshStage2Bang4904,100);

  try{HuNyangDiag.line('RPG_V4904_READY','field_party=prayer_cards|field_scrollbar=hidden|encounter_buttons=center|wolf_size=up|auto_toggle=row_hitbox|victory_click_reward=on|class_stage2=mentor_report+boss_quest')}catch(_){}
})();
