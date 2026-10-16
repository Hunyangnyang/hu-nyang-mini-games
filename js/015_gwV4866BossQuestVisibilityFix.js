
(()=>{
  const SLIME_BOSS_IMAGE='assets/images/0067_ae50f19562.webp';
  const WOLF_BOSS_IMAGE='assets/images/0068_fd90d48088.webp';
  const footprint=[1,3,4,5,7];

  // v4.8.65 used window.rpgQuestData/window.rpgSlimeDefs checks.
  // top-level const bindings are not window properties, so those checks skipped the additions.
  if(typeof rpgSlimeDefs!=='undefined'){
    rpgSlimeDefs.slimeBoss=rpgSlimeDefs.slimeBoss||{id:'slimeBoss',name:'거대 슬라임',rank:'보스',level:12,tier:6,hp:260,attack:26,defense:12,dex:4,count:[1,1],chance:0,gelKey:'slimeBossCore',gelName:'거대 슬라임 핵점액',image:SLIME_BOSS_IMAGE,attackImage:SLIME_BOSS_IMAGE,hitImage:SLIME_BOSS_IMAGE,boss:true,footprint:[...footprint],rewardGoldMin:14,rewardGoldMax:24,rewardExp:58,dropChance:.88};
    rpgSlimeDefs.wolfBoss=rpgSlimeDefs.wolfBoss||{id:'wolfBoss',name:'늑대왕',rank:'보스',level:15,tier:7,hp:320,attack:34,defense:16,dex:8,count:[1,1],chance:0,gelKey:'wolfBossFang',gelName:'늑대왕 송곳니',image:WOLF_BOSS_IMAGE,attackImage:WOLF_BOSS_IMAGE,hitImage:WOLF_BOSS_IMAGE,boss:true,footprint:[...footprint],rewardGoldMin:18,rewardGoldMax:30,rewardExp:76,dropChance:.92};
  }

  if(typeof materialDefs!=='undefined'){
    materialDefs.slimeBossCore=materialDefs.slimeBossCore||{name:'거대 슬라임 핵점액',icon:'💧',price:18,desc:'거대 슬라임의 핵에서 굳어진 고농도 점액. 고급 제작 재료로 거래됩니다.'};
    materialDefs.wolfBossFang=materialDefs.wolfBossFang||{name:'늑대왕 송곳니',icon:'🦴',price:24,desc:'광포한 늑대 보스에게서 얻은 거대한 송곳니. 희귀 야수 재료입니다.'};
  }

  if(typeof rpgQuestData!=='undefined'){
    const bossQuests=[
      {id:'f_boss_slime',type:'토벌 의뢰',name:'거대 슬라임 토벌',desc:'초원 깊은 곳에서 발견된 거대 슬라임을 처치합니다.',target:1,rewardExp:70,rewardGold:32,level:8,enemyTypes:['slimeBoss'],enemyLabel:'거대 슬라임',routeTotal:5,isBoss:true},
      {id:'f_boss_wolf',type:'토벌 의뢰',name:'늑대왕 토벌',desc:'북측 초원에 출몰한 늑대왕를 추적하여 토벌합니다.',target:1,rewardExp:95,rewardGold:48,level:10,enemyTypes:['wolfBoss'],enemyLabel:'늑대왕',routeTotal:6,isBoss:true}
    ];
    rpgQuestData.F=rpgQuestData.F||[];
    for(const q of bossQuests){
      const idx=rpgQuestData.F.findIndex(x=>x.id===q.id);
      if(idx<0)rpgQuestData.F.push(q); else Object.assign(rpgQuestData.F[idx],q);
    }
  }

  // Ensure the boss quests can actually be selected in the test build.
  rpgQuestTestAvailable=function(id){return ['f_slime5','f_boss_slime','f_boss_wolf'].includes(id)};

  // Re-render if the quest guide is already open when this patch executes.
  if(typeof activePageId==='function'&&activePageId()==='rpgQuestGuidePage'&&typeof rpgRenderQuestGuide==='function'){
    rpgRenderQuestGuide(rpgState.selectedQuestRank||'F');
  }
  try{HuNyangDiag.line('RPG_V4866_READY',`F_quests=${typeof rpgQuestData!=='undefined'?(rpgQuestData.F||[]).map(q=>q.id).join(','):'missing'}`)}catch(e){}
})();
