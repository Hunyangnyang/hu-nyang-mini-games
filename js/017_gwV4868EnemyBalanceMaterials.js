
(()=>{
  const materialDefs=window.V38_materialDefs||(window.V38_materialDefs={});
  const defs=rpgSlimeDefs;
  if(!defs)return;
  const apply=(id,data)=>Object.assign(defs[id],data);
  apply('green',{rank:'일반',level:1,tier:1,hp:40,attack:8,defense:5,dex:1,count:[1,4],chance:60,rewardGoldMin:1,rewardGoldMax:2,rewardExp:3,dropChance:.40,gelKey:'slimeGelGreen',gelName:'녹색 점액'});
  apply('blue',{rank:'레어',level:4,tier:2,hp:70,attack:13,defense:8,dex:4,count:[1,3],chance:20,rewardGoldMin:2,rewardGoldMax:4,rewardExp:12,dropChance:.40,gelKey:'slimeGelBlue',gelName:'파란 점액'});
  apply('red',{rank:'엘리트',level:8,tier:4,hp:120,attack:23,defense:15,dex:8,count:[1,2],chance:8,rewardGoldMin:4,rewardGoldMax:7,rewardExp:22,dropChance:.35,gelKey:'slimeGelRed',gelName:'빨간 점액'});
  apply('wolf',{rank:'일반',level:6,tier:3,hp:65,attack:20,defense:10,dex:20,count:[1,2],chance:15,rewardGoldMin:3,rewardGoldMax:5,rewardExp:18,dropChance:.40,gelKey:'youngWolfFang',gelName:'어린 늑대의 송곳니'});
  if(defs.slimeBoss)Object.assign(defs.slimeBoss,{rank:'보스',level:12,tier:6,hp:840,attack:32,defense:22,dex:15,count:[1,1],chance:0,rewardGoldMin:20,rewardGoldMax:30,rewardExp:120,dropChance:.50,gelKey:'slimeCore',gelName:'슬라임의 핵'});
  if(defs.wolfBoss)Object.assign(defs.wolfBoss,{rank:'보스',level:15,tier:7,hp:500,attack:40,defense:17,dex:28,count:[1,1],chance:0,rewardGoldMin:35,rewardGoldMax:50,rewardExp:200,dropChance:.50,gelKey:'wolfKingBloodFang',gelName:'늑대왕의 핏빛 송곳니'});

  // material/item metadata for shop/inventory display
  Object.assign(materialDefs,{
    slimeGelGreen:{name:'녹색 점액',icon:'🟢',price:2,desc:'초록 슬라임에게서 얻는 흔한 점액. 기본 제작 재료로 쓰입니다.'},
    slimeGelBlue:{name:'파란 점액',icon:'🔵',price:5,desc:'파란 슬라임에게서 얻는 점액. 일반 점액보다 안정된 마력 반응을 보입니다.'},
    slimeGelRed:{name:'빨간 점액',icon:'🔴',price:8,desc:'빨간 슬라임에게서 얻는 진한 점액. 엘리트 개체 특유의 밀도가 남아 있습니다.'},
    youngWolfFang:{name:'어린 늑대의 송곳니',icon:'🐺',price:6,desc:'라비엔 초원의 회색 늑대에게서 얻은 송곳니. 야수계 제작 재료로 사용할 수 있습니다.'},
    enhancementStone:{name:'강화석',icon:'💎',price:12,desc:'장비 강화에 사용하는 기본 재료. 사냥과 재련으로 비교적 자주 확보할 수 있습니다.'},
    scrapMetal:{name:'고철',icon:'🔩',price:1,desc:'부서진 장비와 마물의 잔해에서 얻는 금속 조각. 길드 재련 의뢰에서 쓸만한 고철로 선별할 수 있습니다.'},
    brokenMeadowWeapon:{name:'망가진 초원의 무기',icon:'⚔️',price:4,desc:'초원 장비였던 흔적만 남은 망가진 무기. 슬라임의 핵과 함께 재련하면 초원 무기로 복원할 수 있습니다.'},
    brokenMeadowArmor:{name:'망가진 초원의 방어구',icon:'🛡️',price:4,desc:'초원 장비였던 흔적만 남은 망가진 방어구. 슬라임의 핵과 함께 재련하면 초원 방어구로 복원할 수 있습니다.'},
    slimeCore:{name:'슬라임의 핵',icon:'🫧',price:18,desc:'거대 슬라임의 중심부에서 굳어진 핵. 망가진 초원 장비를 복원하는 재련 재료로 사용됩니다.'},
    wolfKingBloodFang:{name:'늑대왕의 핏빛 송곳니',icon:'🦷',price:24,desc:'늑대왕에게서 얻은 붉게 물든 거대한 송곳니. 어딘가에 쓰이게 될 것 같다.'},
    wolfKingHide:{name:'늑대왕의 가죽',icon:'🧥',price:24,desc:'늑대왕의 질긴 가죽. 어딘가에 쓰이게 될 것 같다.'}
  });

  // planned forge recipes. UI is intentionally deferred to blacksmith patch.
  window.HuNyangForgeData=Object.assign(window.HuNyangForgeData||{}, {
    scrapToStone:{cost:{scrapMetal:5},result:{enhancementStone:1}},
    brokenMeadowWeapon:{cost:{brokenMeadowWeapon:1,slimeCore:1},result:'meadowWeapon'},
    brokenMeadowArmor:{cost:{brokenMeadowArmor:1,slimeCore:1},result:'meadowArmor'}
  });

  // equipment drop rule now follows the explicit per-enemy table.
  rpgRollEquipmentDrop=function(enemy){
    const def=defs[enemy?.type];if(!def)return null;
    if(def.id==='red'){
      if(Math.random()>=.05)return null;
      const slot=Math.random()<.5?'weapon':'armor',ordinaryWeapons=Object.keys(rpgWeaponDefs).filter(w=>w!=='seriaTealStaff'),weaponType=ordinaryWeapons[Math.floor(Math.random()*ordinaryWeapons.length)],armorType=Object.keys(rpgArmorTypeDefs)[Math.floor(Math.random()*Object.keys(rpgArmorTypeDefs).length)];
      return rpgMakeEquipment({series:'slime',slot,weaponType,armorType,source:'drop',prefix:'슬라임의',rarity:'레어',level:4,weaponBonus:2,pdef:1,mdef:1,setAtk:2,extra:'슬라임 추가 공격력 +1',border:'blue'});
    }
    if(def.id==='wolfBoss'){
      if(Math.random()>=.60)return null;
      const slot=Math.random()<.5?'weapon':'armor',ordinaryWeapons=Object.keys(rpgWeaponDefs).filter(w=>w!=='seriaTealStaff'),weaponType=ordinaryWeapons[Math.floor(Math.random()*ordinaryWeapons.length)],armorType=Object.keys(rpgArmorTypeDefs)[Math.floor(Math.random()*Object.keys(rpgArmorTypeDefs).length)];
      return rpgMakeEquipment({series:'meadow',slot,weaponType,armorType,source:'drop',prefix:'초원의',rarity:'엘리트',level:10,weaponBonus:5,pdef:3,mdef:2,setAtk:4,extra:'라비엔 지역 추가 공격력 +2',border:'purple'});
    }
    return null;
  };

  const addItem=(key,qty,loot)=>{if(!qty)return;rpgState.items[key]=(rpgState.items[key]||0)+qty;const n=materialDefs[key]?.name||key;loot.set(n,(loot.get(n)||0)+qty)};
  const randRange=(a,b)=>a>=b?a:(a-1+rpgRand(b-a+1));
  const questMatch=(quest,id)=>!!(quest&&!quest.rewarded&&(quest.enemyTypes||[]).includes(id));

  rpgBattleVictory=function(){
    const f=rpgState.field,b=f.battle,enemies=[...(b?.enemies||[])];
    let gold=0,xp=0,questKills=0;const lootCounts=new Map(),gearDrops=[];
    rpgState.items=rpgState.items||{};rpgEnsureEquipment(rpgState);
    const quest=(typeof activeQuest==='function'?activeQuest():(rpgState.quest&&!rpgState.quest.rewarded?rpgState.quest:null));
    const counters=rpgState.bossHuntCounters||(rpgState.bossHuntCounters={slime:0,wolf:0});
    for(const enemy of enemies){
      const def=defs[enemy?.type]||defs.green;
      gold+=randRange(def.rewardGoldMin||1,def.rewardGoldMax||1);
      if(!enemy._giantSplitElite)xp+=Number(def.rewardExp)||0;
      const playerDrop=(f.party[0]?.derived?.dropRate||0)/100;
      if(def.gelKey&&Math.random()<Math.min(1,((def.dropChance??.5)+playerDrop)*(window.HuNyangDevBoost52?.enabled()?100:1)))addItem(def.gelKey,1,lootCounts);
      if(def.id==='green'){if(Math.random()<Math.min(1,.20*(window.HuNyangDevBoost52?.enabled()?100:1)))addItem('scrapMetal',1,lootCounts);counters.slime=(counters.slime||0)+1}
      else if(def.id==='blue'){if(Math.random()<Math.min(1,.08*(window.HuNyangDevBoost52?.enabled()?100:1)))addItem('scrapMetal',1,lootCounts);counters.slime=(counters.slime||0)+1}
      else if(def.id==='red'){if(Math.random()<Math.min(1,.13*(window.HuNyangDevBoost52?.enabled()?100:1)))addItem('scrapMetal',1,lootCounts);counters.slime=(counters.slime||0)+1}
      else if(def.id==='wolf'){
        if(Math.random()<Math.min(1,.10*(window.HuNyangDevBoost52?.enabled()?100:1)))addItem('scrapMetal',1,lootCounts);
        if(Math.random()<Math.min(1,.05*(window.HuNyangDevBoost52?.enabled()?100:1)))addItem(Math.random()<.5?'brokenMeadowWeapon':'brokenMeadowArmor',1,lootCounts);
        counters.wolf=(counters.wolf||0)+1;
      }else if(def.id==='slimeBoss'){
        if(Math.random()<Math.min(1,.30*(window.HuNyangDevBoost52?.enabled()?100:1)))addItem('enhancementStone',randRange(1,2),lootCounts);
        if(Math.random()<Math.min(1,.20*(window.HuNyangDevBoost52?.enabled()?100:1)))addItem('scrapMetal',randRange(1,3),lootCounts);
      }else if(def.id==='wolfBoss'){
        if(Math.random()<Math.min(1,.50*(window.HuNyangDevBoost52?.enabled()?100:1)))addItem('wolfKingHide',1,lootCounts);
        if(Math.random()<Math.min(1,.30*(window.HuNyangDevBoost52?.enabled()?100:1)))addItem('enhancementStone',randRange(1,3),lootCounts);
        if(Math.random()<Math.min(1,.20*(window.HuNyangDevBoost52?.enabled()?100:1)))addItem('scrapMetal',randRange(2,4),lootCounts);
      }
      if(questMatch(quest,def.id))questKills++;
      const item=rpgRollEquipmentDrop(enemy);if(item&&rpgState.inventory.length<40){rpgState.inventory.push(item);gearDrops.push(item)}
    }
    rpgState.gold=(rpgState.gold||0)+gold;
    if(quest&&questKills)quest.kills=(quest.kills||0)+questKills;
    const levelUps=[];
    for(const u of (f.party||[]).slice(0,3)){
      const owner=u.id==='player'?rpgState:(u.id==='ai2'?rpgState.ai2:rpgState.ai);if(!owner||u.dead||(u.hp||0)<=0)continue;
      const beforeStats={...(owner.stats||{})},beforeSkills={...(owner.skills||{})};
      const up=rpgGainExp(owner,xp,u.name||owner.name);
      if(up.leveled){
        const aiAuto=(owner===rpgState.ai||owner===rpgState.ai2),statDelta={};for(const k of ['str','dex','int','hp','luck'])statDelta[k]=Math.max(0,(owner.stats?.[k]||0)-(beforeStats[k]||0));
        const skillDelta=[];if(aiAuto){for(const sd of rpgSkillDefs){const d=(owner.skills?.[sd.id]||0)-(beforeSkills[sd.id]||0);if(d>0)skillDelta.push(`${sd.name} +${d}`)}}
        levelUps.push({name:u.name||owner.name,face:rpgJobFace(owner.job,owner.gender),from:up.from,to:up.to,stats:{...(owner.stats||{})},statGained:up.statGained,skillGained:up.skillGained,aiAuto,statDelta,skillDelta});
      }
    }
    const lootText=[...lootCounts.entries()].map(([name,count])=>`${name} ×${count}`).join(' · ');
    rpgLog(`🏆 전투 승리 · EXP +${xp} · ${gold}G${lootText?` · ${lootText}`:''}${gearDrops.length?` · 장비 ${gearDrops.length}개`:''}`);
    gearDrops.forEach(i=>rpgLog(`🎁 장비 드랍 · ${i.name}`));
    if(quest&&quest.kills>=quest.target&&!quest.completed){quest.completed=true;rpgLog(`📜 의뢰 목표 달성! ${quest.enemyLabel} ${quest.kills}/${quest.target}`)}
    rpgFinalizeBattleState();rpgSyncVitalsFromField();rpgState._pendingVictoryTurn52=true;rpgBattleReturnPending=true;rpgRenderBattlePage();rpgShowBattleReward({xp:xp*(window.HuNyangDevBoost52?.enabled()?100:1),gold,gels:0,gelName:'',lootText,gearDrops},levelUps);
  };

  // persist boss quest clears so free-hunt boss respawn can unlock after the first clear.
  const prevFinish=rpgFinishQuest;
  rpgFinishQuest=function(){
    const q=(typeof activeQuest==='function'?activeQuest():rpgState.quest);
    const id=q?.id,shouldRecord=!!(q?.completed&&!q?.rewarded);
    prevFinish();
    if(shouldRecord&&id){
      rpgState.completedQuestIds=Array.isArray(rpgState.completedQuestIds)?rpgState.completedQuestIds:[];
      if(!rpgState.completedQuestIds.includes(id))rpgState.completedQuestIds.push(id);
      rpgSaveActiveSlot?.(null,'quest_clear_record');
    }
  };

  /* v4.9.62: Free-hunt boss spawning now happens in the central movement
     resolver (070) to avoid premature spawns before the movement completes. */

  try{HuNyangDiag.line('RPG_V4869_READY','wolf_tuning+material_drop_tuning+boss_center_anchor')}catch(_){}
})();
