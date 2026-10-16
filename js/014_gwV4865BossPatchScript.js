
(()=>{
  const SLIME_BOSS_IMAGE='assets/images/0065_a1c7953ff3.webp';
  const WOLF_BOSS_IMAGE='assets/images/0066_1dfb91b234.webp';

  const bossFootprint=[1,3,4,5,7];

  if(window.rpgSlimeDefs){
    if(!rpgSlimeDefs.slimeBoss){
      rpgSlimeDefs.slimeBoss={id:'slimeBoss',name:'거대 슬라임',rank:'보스',level:12,tier:6,hp:260,attack:26,defense:12,dex:4,count:[1,1],chance:0,gelKey:'slimeBossCore',gelName:'거대 슬라임 핵점액',image:SLIME_BOSS_IMAGE,attackImage:SLIME_BOSS_IMAGE,hitImage:SLIME_BOSS_IMAGE,boss:true,footprint:[...bossFootprint],rewardGoldMin:14,rewardGoldMax:24,rewardExp:58,dropChance:.88};
    }
    if(!rpgSlimeDefs.wolfBoss){
      rpgSlimeDefs.wolfBoss={id:'wolfBoss',name:'늑대왕',rank:'보스',level:15,tier:7,hp:320,attack:34,defense:16,dex:8,count:[1,1],chance:0,gelKey:'wolfBossFang',gelName:'늑대왕 송곳니',image:WOLF_BOSS_IMAGE,attackImage:WOLF_BOSS_IMAGE,hitImage:WOLF_BOSS_IMAGE,boss:true,footprint:[...bossFootprint],rewardGoldMin:18,rewardGoldMax:30,rewardExp:76,dropChance:.92};
    }
  }

  if(window.materialDefs){
    materialDefs.slimeBossCore=materialDefs.slimeBossCore||{name:'거대 슬라임 핵점액',icon:'💧',price:18,desc:'거대 슬라임의 핵에서 굳어진 고농도 점액. 점성이 높아 고급 제작 재료로 쓰입니다.'};
    materialDefs.wolfBossFang=materialDefs.wolfBossFang||{name:'늑대왕 송곳니',icon:'🦴',price:24,desc:'광포한 늑대 보스의 거대한 송곳니. 희귀 야수 재료로 높은 값에 거래됩니다.'};
  }

  const questBosses=[
    {id:'f_boss_slime',type:'토벌 의뢰',name:'거대 슬라임 토벌',desc:'초원 깊은 곳에서 발견된 거대 슬라임을 처치합니다.',target:1,rewardExp:70,rewardGold:32,level:8,enemyTypes:['slimeBoss'],enemyLabel:'거대 슬라임',routeTotal:5,isBoss:true},
    {id:'f_boss_wolf',type:'토벌 의뢰',name:'늑대왕 토벌',desc:'북측 초원에 출몰한 늑대왕를 추적하여 토벌합니다.',target:1,rewardExp:95,rewardGold:48,level:10,enemyTypes:['wolfBoss'],enemyLabel:'늑대왕',routeTotal:6,isBoss:true}
  ];
  if(window.rpgQuestData){
    rpgQuestData.F=rpgQuestData.F||[];
    for(const q of questBosses){
      if(!(rpgQuestData.F||[]).some(x=>x.id===q.id))rpgQuestData.F.push(q);
    }
    for(const list of Object.values(rpgQuestData)){
      if(!Array.isArray(list))continue;
      for(const q of list){
        if(!Array.isArray(q.enemyTypes)||!q.enemyTypes.length)q.enemyTypes=['green','blue','red'];
        if(!q.enemyLabel)q.enemyLabel='슬라임';
        if(typeof q.isBoss!=='boolean')q.isBoss=false;
        if(!Number.isFinite(Number(q.routeTotal)))q.routeTotal=q.isBoss?6:Math.max(4,Math.min(8,Math.ceil((q.target||5)/2)));
      }
    }
  }

  function questDefByQuest(q){
    if(!q)return null;
    return (window.rpgQuestById?rpgQuestById(q.id,q.rank):null)||(rpgQuestData?.[q.rank]||[]).find(x=>x.id===q.id)||null;
  }
  function normalizeQuest(q){
    if(!q)return null;
    const def=questDefByQuest(q)||{};
    q.rank=q.rank||def.rank||'F';
    q.type=q.type||def.type||'토벌';
    q.enemyTypes=(Array.isArray(q.enemyTypes)&&q.enemyTypes.length)?q.enemyTypes:[...(def.enemyTypes||['green','blue','red'])];
    q.enemyLabel=q.enemyLabel||def.enemyLabel||'슬라임';
    q.routeTotal=Number(q.routeTotal)||Number(def.routeTotal)||5;
    q.isBoss=!!(q.isBoss||def.isBoss);
    return q;
  }
  function activeQuest(){
    const q=rpgState?.quest;
    if(!q||q.rewarded)return null;
    return normalizeQuest(q);
  }
  function questEnemyMatch(q,enemyType){
    const cur=normalizeQuest(q);
    return !!cur&&(cur.enemyTypes||[]).includes(enemyType);
  }
  function questObjectiveText(q){
    const cur=normalizeQuest(q);
    if(!cur)return '자유 사냥';
    return `${cur.enemyLabel} ${cur.target}${cur.isBoss?'체 토벌':'마리 처치'}`;
  }
  function ensureFieldMissionContext(resetProgress=false){
    const f=rpgState.field;if(!f)return;
    const q=activeQuest();
    f.freeEncounterRate=.20;
    if(!q){
      f.questRouteTotal=0;f.questRouteProgress=0;f.questObjectiveReached=false;f.questEncounterRate=.20;
      return;
    }
    f.questRouteTotal=Number(q.routeTotal)||5;
    if(resetProgress||!Number.isFinite(Number(f.questRouteProgress)))f.questRouteProgress=0;
    if(resetProgress||typeof f.questObjectiveReached!=='boolean')f.questObjectiveReached=!!q.completed;
    f.questEncounterRate=q.isBoss?1:.38;
  }
  function fillTravelDots(count){
    document.querySelectorAll('#rpgTravelDots i').forEach((x,i)=>x.classList.toggle('on',i<count));
  }
  function buildEncounter(enemies){
    const encounter={count:enemies.length,type:enemies.some(e=>e?.boss)?'boss':'mixed',enemies};
    const strongest=window.rpgStrongestEncounterEnemy?rpgStrongestEncounterEnemy(encounter):enemies[0];
    encounter.strongestType=strongest?.type||null;
    encounter.strongestName=strongest?.name||'마물';
    return encounter;
  }
  function buildBossEncounter(typeId){
    const def=rpgSlimeDefs[typeId]||rpgSlimeDefs.slimeBoss;
    const enemy=rpgCreateEncounterEnemy(def,4,0);
    enemy.position=4;enemy.boss=true;enemy.footprint=[...(def.footprint||bossFootprint)];
    return buildEncounter([enemy]);
  }
  function pickEncounterTypeWithCap(pool,counts,weighted=false){
    const available=pool.filter(def=>{const max=Math.max(1,Number(def?.count?.[1])||4);return (counts[def.id]||0)<max});
    if(!available.length)return pool[0]||rpgSlimeDefs.green;
    let def;
    if(weighted){
      const total=available.reduce((sum,d)=>sum+(Number(d.chance)||0),0)||available.length;
      let roll=Math.random()*total;
      def=available[0];
      for(const d of available){roll-=Number(d.chance)||1;if(roll<0){def=d;break}}
    }else def=available[Math.floor(Math.random()*available.length)];
    counts[def.id]=(counts[def.id]||0)+1;
    return def;
  }
  function buildQuestEncounter(q){
    const cur=normalizeQuest(q);if(!cur)return null;
    if(cur.isBoss)return buildBossEncounter(cur.enemyTypes?.[0]);
    const pool=(cur.enemyTypes||[]).map(id=>rpgSlimeDefs[id]).filter(Boolean);
    const total=1+Math.floor(Math.random()*3),positions=[],counts={};
    while(positions.length<total){const p=Math.floor(Math.random()*9);if(!positions.includes(p))positions.push(p)}
    const enemies=positions.map((position,i)=>rpgCreateEncounterEnemy(pickEncounterTypeWithCap(pool.length?pool:[rpgSlimeDefs.green],counts,false),position,i));
    return buildEncounter(enemies);
  }
  function buildRandomEncounter(){
    const total=1+Math.floor(Math.random()*4),positions=[],counts={};
    while(positions.length<total){const p=Math.floor(Math.random()*9);if(!positions.includes(p))positions.push(p)}
    const pool=[rpgSlimeDefs.green,rpgSlimeDefs.blue,rpgSlimeDefs.wolf,rpgSlimeDefs.red].filter(Boolean);
    const enemies=positions.map((position,i)=>rpgCreateEncounterEnemy(pickEncounterTypeWithCap(pool,counts,true),position,i));
    return buildEncounter(enemies);
  }
  function enemyFootprint(unit){
    return Array.isArray(unit?.footprint)&&unit.footprint.length?unit.footprint:[unit?.position];
  }

  rpgQuestTestAvailable=function(id){return ['f_slime5','f_boss_slime','f_boss_wolf'].includes(id)};

  const oldShowPage=showPage;
  const pageGuard={until:0};
  showPage=function(id,navDirection='auto'){
    const now=performance.now();
    if(now<pageGuard.until&&activePageId()!==id)return;
    const out=oldShowPage(id,navDirection);
    pageGuard.until=performance.now()+220;
    return out;
  };
  for(const type of ['pointerdown','click']){
    document.addEventListener(type,e=>{
      const interactive=e.target.closest('button,[role="button"],.rpgCombatUnit.targetable,.rpgBattleUnit2D.enemy,.rpgQuestTake,.rpgFieldAction,.rpgBattleAction,.rpgGrade');
      if(!interactive)return;
      if(performance.now()<pageGuard.until){
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation?.();
      }
    },true);
  }

  const oldCreateEncounterEnemy=rpgCreateEncounterEnemy;
  rpgCreateEncounterEnemy=function(type,position,index){
    const enemy=oldCreateEncounterEnemy(type,position,index);
    if(type?.boss){
      enemy.position=4;
      enemy.boss=true;
      enemy.footprint=[...(type.footprint||bossFootprint)];
      enemy.rank=type.rank||'보스';
      enemy.attackImage=type.attackImage||type.image||enemy.image;
      enemy.hitImage=type.hitImage||type.image||enemy.image;
    }
    return enemy;
  };

  rpgAcceptQuest=function(id='f_slime5',rank='F'){
    const q=(rpgQuestData[rank]||[]).find(x=>x.id===id)||rpgQuestData.F[0];
    rpgState.quest={rank,type:q.type,name:q.name,target:q.target,kills:0,completed:false,rewarded:false,rewardExp:q.rewardExp,rewardGold:q.rewardGold,id:q.id,enemyTypes:[...(q.enemyTypes||['green','blue','red'])],enemyLabel:q.enemyLabel||'슬라임',routeTotal:q.routeTotal||5,isBoss:!!q.isBoss};
    if(!Array.isArray(rpgState.acceptedQuestIds))rpgState.acceptedQuestIds=[];
    if(!rpgState.acceptedQuestIds.includes(q.id))rpgState.acceptedQuestIds.push(q.id);
    const countSuffix=q.isBoss?'체 토벌':'마리 처치';
    document.querySelector('#rpgAcceptedQuestBox').innerHTML=`<h3>${rank}급 · ${q.name}</h3><b>${q.type}</b><br>목표: ${q.enemyLabel||'슬라임'} ${q.target}${countSuffix}<br>보상: EXP ${q.rewardExp} · ${q.rewardGold}G`;
    const art=document.querySelector('#rpgAcceptedReceptionArt');if(art)art.src=rpgReceptionImages.quest;
    document.querySelector('#rpgAcceptedNpcLine')?.classList.remove('show');
    document.querySelector('#rpgAcceptedMoodEmoji')?.classList.remove('show');
    showPage('rpgQuestAcceptedPage');
    HuNyangDiag.line?.('RPG_QUEST_ACCEPT',q.name);
  };

  const oldStartJourney=rpgStartJourney;
  rpgStartJourney=function(){
    oldStartJourney();
    ensureFieldMissionContext(true);
    const q=activeQuest();
    if(q)rpgLog(`🧭 목표 지점까지 ${rpgState.field.questRouteTotal}회 이동 · ${questObjectiveText(q)}`);
    rpgRenderField();
  };

  rpgRenderTravel=function(){
    const f=rpgState.field;if(!f)return;
    const p=(rpgState.moveStepCounter||0)%3;
    const q=activeQuest();
    const ticker=document.querySelector('#rpgFieldPage .rpgTravelTicker');
    if(!q){
      if(ticker)ticker.style.display='';
      fillTravelDots(0);
      return;
    }
    if(ticker)ticker.style.display='';
    ensureFieldMissionContext(false);
    const total=Math.max(1,Number(f.questRouteTotal)||Number(q.routeTotal)||5);
    const progress=Math.max(0,Math.min(total,Number(f.questRouteProgress)||0));
    if(q.completed){
      document.querySelector('#rpgTravelText').textContent='의뢰 완료';
      document.querySelector('#rpgTravelTurnText').textContent='길드로 돌아가 완료 보고';
      fillTravelDots(3);
      return;
    }
    if(!f.questObjectiveReached){
      document.querySelector('#rpgTravelText').textContent=`의뢰 지점 이동 · ${progress}/${total}`;
      document.querySelector('#rpgTravelTurnText').textContent=`목표 ${questObjectiveText(q)}`;
      fillTravelDots(Math.min(3,Math.max(0,Math.ceil(progress/Math.max(1,total/3)))));
      return;
    }
    document.querySelector('#rpgTravelText').textContent=q.isBoss?'보스 흔적 추적 중':'의뢰 지점 도착';
    document.querySelector('#rpgTravelTurnText').textContent=q.isBoss?`${q.enemyLabel} 조우 준비`:`진행 ${q.kills||0}/${q.target||0}`;
    fillTravelDots(3);
  };

  rpgMoveStep=function(){
    const f=rpgState.field;if(!f||f.encounter||f.battle)return;
    ensureFieldMissionContext(false);
    const q=activeQuest();
    f.distance=(f.distance||0)+1;
    rpgState.moveStepCounter=(rpgState.moveStepCounter||0)+1;
    rpgLog(`👣 초원을 이동했습니다. · 누적 ${f.distance}회`);
    if(rpgState._travelFirstCycle52!==false&&rpgState._travelPos52===5){rpgState._travelFirstCycle52=false;rpgState._travelPos52=1}else if(rpgState._travelFirstCycle52===false&&rpgState._travelPos52===5){rpgState._travelPos52=1}else{rpgState._travelPos52=Math.min(5,(Number(rpgState._travelPos52)||0)+1)}if(rpgState.moveStepCounter>=5){rpgState.moveStepCounter-=5;rpgAdvanceTurns(1,'이동 5회')}

    if(q&&!q.completed&&!f.questObjectiveReached){
      f.questRouteProgress=Math.min(f.questRouteTotal||q.routeTotal||5,(f.questRouteProgress||0)+1);
      if(f.questRouteProgress>=(f.questRouteTotal||q.routeTotal||5)){
        f.questObjectiveReached=true;
        rpgLog(`📍 의뢰 지점 도착 · ${questObjectiveText(q)}`);
      }
    }

    let encounter=null;
    if(q&&!q.completed&&f.questObjectiveReached&&q.isBoss){
      encounter=buildBossEncounter(q.enemyTypes?.[0]);
    }else{
      const rate=!q?.completed&&q?((f.questObjectiveReached?.valueOf?.()??f.questObjectiveReached)?(q.isBoss?0:0.40):0.12):(f.freeEncounterRate||0.20);
      if(Math.random()<rate)encounter=q&&!q.completed&&f.questObjectiveReached?buildQuestEncounter(q):buildRandomEncounter();
    }

    if(encounter){
      f.encounter=encounter;
      rpgLog(`⚠️ ${encounter.strongestName} 조우 · ${rpgEncounterSummary(encounter)}`);
    }
    rpgRenderField();
  };

  rpgBattleVictory=function(){
    const f=rpgState.field,b=f.battle,enemies=[...(b?.enemies||[])];
    let gold=0,xp=0,questKills=0;const lootCounts=new Map(),gearDrops=[];
    rpgState.items=rpgState.items||{};rpgEnsureEquipment(rpgState);
    const quest=activeQuest();
    for(const enemy of enemies){
      const def=rpgSlimeDefs[enemy?.type]||rpgSlimeDefs.green;
      const gMin=Number.isFinite(Number(def.rewardGoldMin))?Number(def.rewardGoldMin):1;
      const gMax=Number.isFinite(Number(def.rewardGoldMax))?Number(def.rewardGoldMax):(def.id==='wolf'?4:3);
      gold+=gMin>=gMax?gMin:(gMin-1+rpgRand(gMax-gMin+1));
      if(!enemy._giantSplitElite)xp+=Number(def.rewardExp)||((def.id==='red')?18:(def.id==='blue')?12:(def.id==='wolf')?11:8);
      const baseDrop=Number.isFinite(Number(def.dropChance))?Number(def.dropChance):(def.id==='wolf'?.42:.5);
      const playerDrop=(f.party[0]?.derived?.dropRate||0)/100;
      const got=Math.random()<Math.min(1,(baseDrop+playerDrop)*(window.HuNyangDevBoost52?.enabled()?100:1))?1:0;
      if(got&&def.gelKey){
        rpgState.items[def.gelKey]=(rpgState.items[def.gelKey]||0)+1;
        lootCounts.set(def.gelName,(lootCounts.get(def.gelName)||0)+1);
        if(!['wolf','wolfBoss'].includes(def.id))rpgState.items.slimeGel=(rpgState.items.slimeGel||0)+1;
      }
      if(questEnemyMatch(quest,def.id))questKills++;
      const item=rpgRollEquipmentDrop(enemy);if(item&&rpgState.inventory.length<40){rpgState.inventory.push(item);gearDrops.push(item)}
    }
    rpgState.gold+=gold;
    if(quest&&questKills)quest.kills=(quest.kills||0)+questKills;
    const levelUps=[];
    for(const u of (f.party||[]).slice(0,3)){
      const owner=u.id==='player'?rpgState:(u.id==='ai2'?rpgState.ai2:rpgState.ai);if(!owner||u.dead||(u.hp||0)<=0)continue;
      const beforeStats={...(owner.stats||{})},beforeSkills={...(owner.skills||{})};
      const up=rpgGainExp(owner,xp,u.name||owner.name);
      if(up.leveled){
        const aiAuto=(owner===rpgState.ai||owner===rpgState.ai2);
        const statDelta={};for(const k of ['str','dex','int','hp','luck'])statDelta[k]=Math.max(0,(owner.stats?.[k]||0)-(beforeStats[k]||0));
        const skillDelta=[];if(aiAuto){for(const def of rpgSkillDefs){const d=(owner.skills?.[def.id]||0)-(beforeSkills[def.id]||0);if(d>0)skillDelta.push(`${def.name} +${d}`)}}
        levelUps.push({name:u.name||owner.name,face:rpgJobFace(owner.job,owner.gender),from:up.from,to:up.to,stats:{...(owner.stats||{})},statGained:up.statGained,skillGained:up.skillGained,aiAuto,statDelta,skillDelta});
      }
    }
    const lootText=[...lootCounts.entries()].map(([name,count])=>`${name} ×${count}`).join(' · ');
    rpgLog(`🏆 전투 승리 · EXP +${xp} · ${gold}G${lootText?` · ${lootText}`:''}${gearDrops.length?` · 장비 ${gearDrops.length}개`:''}`);
    gearDrops.forEach(i=>rpgLog(`🎁 장비 드랍 · ${i.name}`));
    if(quest&&quest.kills>=quest.target&&!quest.completed){quest.completed=true;rpgLog(`📜 의뢰 목표 달성! ${quest.enemyLabel} ${quest.kills}/${quest.target}`)}
    rpgFinalizeBattleState();rpgSyncVitalsFromField();rpgState._pendingVictoryTurn52=true;rpgBattleReturnPending=true;rpgRenderBattlePage();rpgShowBattleReward({xp:xp*(window.HuNyangDevBoost52?.enabled()?100:1),gold,gels:0,gelName:'',lootText,gearDrops},levelUps);
  };

  rpgFinishQuest=function(){
    const quest=activeQuest();
    if(!quest||!quest.completed||quest.rewarded)return;
    quest.rewarded=true;
    const gold=quest.rewardGold||10,exp=quest.rewardExp||30;
    rpgState.gold=(rpgState.gold||0)+gold;
    const alive=[];
    if(rpgRewardOwnerAlive61(rpgState)){rpgGainExp(rpgState,exp,rpgState.name);alive.push(rpgState.name)}
    if(rpgRewardOwnerAlive61(rpgState.ai)){rpgGainExp(rpgState.ai,exp,rpgState.ai.name);alive.push(rpgState.ai.name)}
    if(rpgRewardOwnerAlive61(rpgState.ai2)){rpgGainExp(rpgState.ai2,exp,rpgState.ai2.name);alive.push(rpgState.ai2.name)}
    document.querySelector('#rpgQuestCompleteRewardName').textContent=`${quest.rank}급 · ${quest.name}`;
    document.querySelector('#rpgQuestCompleteExp').textContent=alive.length?`+${exp} · 생존 ${alive.length}명`:'전원 전투 불능 · EXP 없음';
    document.querySelector('#rpgQuestCompleteGold').textContent=`+${gold}G`;
    document.querySelector('#rpgQuestCompleteLoot').textContent=`${quest.enemyLabel} 토벌 완료 기록`;
    rpgRenderGuild();
    rpgSaveActiveSlot('rpgGuildPage','quest_complete');
    setAppModal('rpgQuestCompleteRewardModal',true);
  };

  rpgUnitHtml=function(u,enemy=false,index=0){
    if(!u)return '<div class="rpgCombatUnit empty"></div>';
    const max=enemy?(u.maxHp||1):u.derived.maxHp,hp=Math.max(0,Math.min(100,u.hp/max*100)),g=Math.max(0,Math.min(100,u.gauge||0));
    const targetable=enemy&&rpgState.field.targetMode&&!u.dead?' targetable':'';
    if(enemy&&u._ghost){
      return `<div class="rpgCombatUnit bossGhost${targetable}${g>=100&&!u.dead?' ready':''}" data-enemy="${index}"><div class="rpgUnitIcon"><img class="rpgSlimeSprite bossEcho" src="${u.image||rpgSlimeDefs.green.image}" alt="${u.name||'보스'}"></div><div class="rpgUnitName">점유 중</div><div class="rpgMiniHp"><i style="width:${hp}%"></i></div><div class="rpgAtbGauge"><i style="width:${g}%"></i></div><div class="rpgUnitStatus">${u.dead?'전투 불능':'BOSS'}</div></div>`;
    }
    const icon=enemy?`<img class="rpgSlimeSprite${u.boss?' bossEcho':''}" src="${u.image||rpgSlimeDefs.green.image}" alt="${u.name||'슬라임'}">`:rpgJobFace(u.job,u.id==='player'?rpgState.gender:(u.id==='ai2'?rpgState.ai2?.gender:rpgState.ai?.gender));
    const nm=enemy?(u.boss?`${u.rank||'보스'} ${u.name||'마물'}`:`${u.rank||''} ${u.name||'슬라임'} ${index+1}`):u.name;
    return `<div class="rpgCombatUnit${targetable}${g>=100&&!u.dead?' ready':''}${enemy&&u.boss?' bossCore':''}" data-enemy="${enemy?index:''}"><div class="rpgUnitIcon">${icon}</div><div class="rpgUnitName">${nm}</div>${enemy&&u.boss?'<div class="rpgBossBadge">BOSS</div>':''}<div class="rpgMiniHp"><i style="width:${hp}%"></i></div><div class="rpgAtbGauge"><i style="width:${g}%"></i></div><div class="rpgUnitStatus">${u.dead?'전투 불능':g>=100?'READY':u.defending?'🛡️ 방어':u.boss?'위협적':''}</div></div>`;
  };

  rpgRenderCombatFormations=function(){
    const f=rpgState.field,p=document.querySelector('#rpgCombatParty'),e=document.querySelector('#rpgCombatEnemy');if(!f||!p||!e)return;
    const visible=!!(f.encounter||f.battle);p.classList.toggle('show',visible);e.classList.toggle('show',visible);
    const pslots=Array(9).fill(null);f.party.forEach(u=>pslots[u.position]=u);p.innerHTML=pslots.map(u=>rpgUnitHtml(u,false)).join('');
    const eslots=Array(9).fill(null);const source=f.battle?f.battle.enemies:(f.encounter?f.encounter.enemies:[]);
    source.forEach((u,i)=>{
      if(!u||u.dead)return;
      const occ=enemyFootprint(u);
      occ.forEach(pos=>{eslots[pos]={...u,_idx:i,_ghost:pos!==u.position}});
    });
    e.innerHTML=eslots.map(u=>u?rpgUnitHtml(u,true,u._idx):rpgUnitHtml(null,true)).join('');
    e.querySelectorAll('.rpgCombatUnit.targetable').forEach(el=>el.addEventListener('click',()=>rpgPlayerAttack(Number(el.dataset.enemy))));
  };

  rpgBattleUnit2DHtml=function(u,enemy=false,index=0){
    if(!u||u.dead)return '';
    const partyIndex=enemy?index:Math.max(0,(rpgState.field?.party||[]).indexOf(u)),rawGauge=Math.max(0,Math.min(100,u.gauge||0)),g=rpgGetVisualAtb(rpgAtbVisualKey(enemy?'e':'p',partyIndex),rawGauge),pos=rpgBattleScreenPos(u.position,enemy),gender=u.id==='player'?rpgState.gender:(u.id==='ai2'?rpgState.ai2?.gender:rpgState.ai?.gender),useArt=!enemy&&u.job?.id==='adventurer',art=gender==='여성'?rpgBattleFemaleArt.adventurerFemaleIdle:rpgBattleCharacterArt.adventurerMaleIdle,sprite=enemy?`<img src="${u.image||rpgSlimeDefs.green.image}" alt="${u.name||'적'}">`:useArt?`<span class="rpgPlayerBattleSpriteWrap" data-party-sprite="${u.id}"><img class="rpgPlayerBattleSprite" data-party-sprite-img="${u.id}" src="${art}" alt="${u.name} 전투 대기"></span>`:`<span class="allyFace">${rpgJobFace(u.job,gender)}</span>`,name=enemy?`${u.name||'적'}${u.boss?'':' '+(index+1)}`:u.name,scale=enemy&&u.boss?1:pos.scale;
    return `<button type="button" class="rpgBattleUnit2D ${enemy?'enemy':'party'}${useArt?' playerBattleArt':''}${enemy&&rpgState.field?.targetMode?' targetable':''}${g>=100?' ready gwAtbReady54':''}${enemy&&u.boss?' boss':''}" ${enemy?`data-battle-enemy="${index}"`:`data-party-unit="${u.id}"`} style="left:${pos.x}%;top:${pos.y}%;transform:translate(-50%,-50%) scale(${scale})" ${enemy&&rpgState.field?.targetMode?'':'tabindex="-1"'}><span class="shadow"></span>${enemy&&u.boss?'<span class="rpgBossTag2D">BOSS</span>':''}<span class="rpgBattleUnitSprite">${sprite}</span><span class="rpgBattleUnitName2D">${name}</span><span class="gwSideAtb54"><i style="height:${g}%"></i></span></button>`;
  };

  function battleGridCellIndex(localPos){
    const p=Math.max(0,Math.min(8,Number(localPos)||0));
    const row=Math.floor(p/3),line=p%3,col=6-line;
    return row*7+col;
  }
  function paintBattleGridOccupancy(){
    const cells=[...document.querySelectorAll('#rpgBattleGridPlane .rpgBattleGridCell')];
    if(!cells.length)return;
    cells.forEach(c=>c.classList.remove('bossOccupied','bossCore'));
    const source=rpgState.field?.battle?.enemies||rpgState.field?.encounter?.enemies||[];
    source.forEach(u=>{
      if(!u||u.dead||!u.boss)return;
      enemyFootprint(u).forEach(pos=>cells[battleGridCellIndex(pos)]?.classList.add('bossOccupied'));
      cells[battleGridCellIndex(u.position)]?.classList.add('bossCore');
    });
  }
  const oldRenderBattlePage=rpgRenderBattlePage;
  rpgRenderBattlePage=function(){oldRenderBattlePage();paintBattleGridOccupancy()};

  normalizeQuest(rpgState.quest);
  HuNyangDiag.line?.('RPG_V4865_READY','boss_quests+page_input_guard+quest_route_ui');
})();
