
(()=>{
  const materialDefs=window.V38_materialDefs||(window.V38_materialDefs={});
  const QDAY=()=>Math.floor((Number(rpgState.worldTurn)||0)/96)+1;
  const EXP_NEED={1:40,2:70,3:110,4:160,5:230,6:310,7:410,8:520,9:650};
  rpgExpNeed=function(level){return EXP_NEED[Math.max(1,Math.min(9,Number(level)||1))]||650};
  {
    Object.assign(materialDefs,{
      usableScrap:{name:'쓸만한 고철',icon:'⚙️',price:4,desc:'길드와 대장장이가 선별한 상태 좋은 금속 조각. 2개를 재련하면 강화석 1개로 바꿀 수 있습니다.'},
      scrapMetal:{name:'고철',icon:'🔩',price:1,desc:'녹슬고 찌그러진 금속 조각. 일부 의뢰에서 선별을 맡기면 쓸만한 고철로 돌려받을 수 있습니다.'}
    });
  }
  window.HuNyangForgeData=Object.assign(window.HuNyangForgeData||{}, {usableScrapToStone:{cost:{usableScrap:2},result:{enhancementStone:1}}});
  window.HuNyangForgeData=Object.assign(window.HuNyangForgeData||{},{scrapToStone:{cost:{scrapMetal:5},result:{enhancementStone:1}}});

  const normal=[
    {id:'f_n_green5',category:'normal',type:'토벌 의뢰',name:'초원 입구 정리',desc:'마을 가까이 늘어난 초록 슬라임을 정리합니다.',level:1,difficulty:1,target:5,enemyTypes:['green'],enemyLabel:'초록 슬라임',rewardExp:18,rewardGold:7},
    {id:'f_n_green8',category:'normal',type:'토벌 의뢰',name:'끈적한 길목',desc:'통행을 방해하는 초록 슬라임 무리를 줄입니다.',level:1,difficulty:1,target:8,enemyTypes:['green'],enemyLabel:'초록 슬라임',rewardExp:25,rewardGold:10},
    {id:'f_n_slime10',category:'normal',type:'토벌 의뢰',name:'슬라임 개체수 조절',desc:'종류와 관계없이 초원의 슬라임 개체 수를 줄입니다.',level:2,difficulty:2,target:10,enemyTypes:['green','blue','red'],enemyLabel:'슬라임',rewardExp:35,rewardGold:14},
    {id:'f_n_blue3',category:'normal',type:'토벌 의뢰',name:'푸른 점액 흔적',desc:'최근 늘어난 파란 슬라임을 정리합니다.',level:3,difficulty:2,target:3,enemyTypes:['blue'],enemyLabel:'파란 슬라임',rewardExp:38,rewardGold:16},
    {id:'f_n_gel5',category:'normal',type:'수집 의뢰',name:'점액 표본 납품',desc:'연구용 녹색 점액을 길드에 납품합니다.',level:1,difficulty:1,collect:{slimeGelGreen:5},rewardExp:20,rewardGold:10},
    {id:'f_n_gel8',category:'normal',type:'수집 의뢰',name:'점액 대량 수거',desc:'처리하기 곤란한 녹색 점액을 모아 납품합니다.',level:2,difficulty:2,collect:{slimeGelGreen:8},rewardExp:30,rewardGold:13},
    {id:'f_n_bluegel3',category:'normal',type:'수집 의뢰',name:'푸른 점액 납품',desc:'파란 점액을 모아 길드 연구 담당자에게 전달합니다.',level:3,difficulty:2,collect:{slimeGelBlue:3},rewardExp:38,rewardGold:17},
    {id:'f_n_mixgel',category:'normal',type:'수집 의뢰',name:'점액 비교 표본',desc:'녹색과 파란 점액을 함께 납품합니다.',level:4,difficulty:3,collect:{slimeGelGreen:5,slimeGelBlue:2},rewardExp:48,rewardGold:20},
    {id:'f_n_scrap2',category:'normal',type:'재련 의뢰',name:'고철 선별 작업',desc:'고철을 길드에 맡겨 재련 가능한 금속을 선별합니다.',level:5,difficulty:2,collect:{scrapMetal:2},rewardExp:35,rewardGold:12,rewardItems:{usableScrap:1}},
    {id:'f_n_scrap4',category:'normal',type:'재련 의뢰',name:'대장간 자재 정리',desc:'모아둔 고철을 정리해 쓸만한 금속을 확보합니다.',level:6,difficulty:3,collect:{scrapMetal:4},rewardExp:50,rewardGold:18,rewardItems:{usableScrap:2}}
  ];
  const elite=[
    {id:'f_e_wolf3',category:'elite',type:'정예 토벌',name:'회색 늑대 개체수 조절',desc:'초원 길목의 회색 늑대를 줄입니다.',level:5,difficulty:4,target:3,enemyTypes:['wolf'],enemyLabel:'회색 늑대',rewardExp:75,rewardGold:30},
    {id:'f_e_wolf5',category:'elite',type:'정예 토벌',name:'늑대 무리 소탕',desc:'위협적인 회색 늑대 무리를 집중적으로 토벌합니다.',level:6,difficulty:5,target:5,enemyTypes:['wolf'],enemyLabel:'회색 늑대',rewardExp:105,rewardGold:42},
    {id:'f_e_blue6',category:'elite',type:'정예 토벌',name:'희귀 슬라임 추적',desc:'파란 슬라임을 집중적으로 추적해 정리합니다.',level:5,difficulty:4,target:6,enemyTypes:['blue'],enemyLabel:'파란 슬라임',rewardExp:85,rewardGold:34},
    {id:'f_e_red2',category:'elite',type:'정예 토벌',name:'붉은 경보',desc:'위험성이 높은 빨간 슬라임을 처치합니다.',level:6,difficulty:5,target:2,enemyTypes:['red'],enemyLabel:'빨간 슬라임',rewardExp:100,rewardGold:40},
    {id:'f_e_refine',category:'elite',type:'재련 의뢰',name:'재련용 소재 확보',desc:'점액과 송곳니를 모아 대장간 재련 실험을 돕습니다.',level:7,difficulty:5,collect:{slimeGelBlue:4,youngWolfFang:2},rewardExp:115,rewardGold:45,rewardItems:{usableScrap:2}},
    {id:'f_e_stone',category:'elite',type:'재련 의뢰',name:'대장장이의 긴급 주문',desc:'빨간 점액을 납품해 고급 재련 실험을 지원합니다. 드물게 강화석을 보상합니다.',level:7,difficulty:6,collect:{slimeGelRed:3,scrapMetal:2},rewardExp:135,rewardGold:52,rewardItems:{enhancementStone:1}}
  ];
  const strong=[
    {id:'f_boss_slime',category:'strong',type:'강적 의뢰',name:'거대 슬라임 토벌',desc:'초원 깊은 곳의 거대 슬라임을 토벌합니다.',level:8,difficulty:8,target:1,enemyTypes:['slimeBoss'],enemyLabel:'거대 슬라임',routeTotal:5,isBoss:true,rewardExp:180,rewardGold:90,rewardItems:{slimeCore:1},choiceReward:'brokenMeadowWeapon'},
    {id:'f_boss_wolf',category:'strong',type:'강적 의뢰',name:'늑대왕 토벌',desc:'초원을 지배하는 광포한 늑대왕을 토벌합니다.',level:10,difficulty:9,target:1,enemyTypes:['wolfBoss'],enemyLabel:'늑대왕',routeTotal:6,isBoss:true,rewardExp:260,rewardGold:140,choiceReward:'meadowEquipment'}
  ];
  const promotion=[{id:'f_promote_e',category:'promotion',type:'승격 의뢰',name:'F → E 등급 승격 시험',desc:'길드가 지정한 던전을 돌파하면 E등급 의뢰가 개방됩니다. 현재 던전 준비 중입니다.',level:10,difficulty:10,rewardExp:0,rewardGold:0,promotion:true,unavailable:true}];
  const all=[...normal,...elite,...strong,...promotion];
  if(typeof rpgQuestData!=='undefined')rpgQuestData.F=all;

  function hashSeed(str){let h=2166136261;for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
  function rng(seed){let x=seed>>>0;return()=>{x=(Math.imul(1664525,x)+1013904223)>>>0;return x/4294967296}}
  function pick(pool,n,rand){const a=[...pool],o=[];while(a.length&&o.length<n){o.push(a.splice(Math.floor(rand()*a.length),1)[0])}return o}
  function ensureBoard(){
    const day=QDAY();
    if(rpgState.fQuestBoard?.day===day&&rpgState.fQuestBoard?.schema===78&&Array.isArray(rpgState.fQuestBoard.normalIds))return rpgState.fQuestBoard;
    const rand=rng(hashSeed(`${day}|${rpgState.name||'adventurer'}|F`));
    const eliteCount=rand()<.5?1:2;
    const coreElite=elite.filter(q=>q.id!=='f_e_refine'&&q.id!=='f_e_stone');
    let eliteIds=pick(coreElite,eliteCount,rand).map(q=>q.id);
    const rareRoll=rand();
    if(rareRoll<.07){eliteIds[eliteIds.length-1]='f_e_refine'}
    else if(rareRoll<.11){eliteIds[eliteIds.length-1]='f_e_stone'}
    rpgState.fQuestBoard={day,schema:78,normalIds:pick(normal,3,rand).map(q=>q.id),eliteIds};
    return rpgState.fQuestBoard;
  }
  function repeatEnabled(){try{return localStorage.getItem('hunyang_test_repeat_quest_v1')==='1'}catch(_){return false}}
  function completedIds(){return Array.isArray(rpgState.completedQuestIds)?rpgState.completedQuestIds:[]}
  function questAvailable(q){
    if(!q||q.unavailable)return false;
    if((rpgState.level||1)<q.level)return false;
    if((q.category==='strong'||q.category==='promotion')&&completedIds().includes(q.id)&&!repeatEnabled())return false;
    return true;
  }
  function boardQuests(){const b=ensureBoard(),ids=new Set([...b.normalIds,...b.eliteIds]);return [...normal.filter(q=>ids.has(q.id)),...elite.filter(q=>ids.has(q.id)),...strong.filter(q=>(rpgState.level||1)>=q.level&&!completedIds().includes(q.id)||repeatEnabled()),...promotion.filter(q=>(rpgState.level||1)>=q.level)];}
  function collectText(q){if(!q.collect)return `${q.enemyLabel||'대상'} ${q.target||1}마리`;return Object.entries(q.collect).map(([k,n])=>`${materialDefs[k]?.name||k} ${n}개`).join(' · ')}
  function rewardText(q){const mats=Object.entries(q.rewardItems||{}).map(([k,n])=>`${materialDefs[k]?.name||k} ×${n}`);if(q.choiceReward==='brokenMeadowWeapon')mats.push('망가진 초원 무기 1종 선택');if(q.choiceReward==='meadowEquipment')mats.push('초원 장비 1종 선택');return [`EXP ${q.rewardExp}`,`${q.rewardGold}G`,...mats].join(' · ')}
  function skulls(n){return '☠'.repeat(Math.max(1,Math.min(10,n||1)))}
  function categoryName(c){return c==='elite'?'정예 의뢰':c==='strong'?'강적 의뢰':c==='promotion'?'승격 의뢰':'일반 의뢰'}
  function questCard(q,featured=false){
    const levelLocked=(rpgState.level||1)<q.level,cleared=completedIds().includes(q.id)&&!repeatEnabled(),current=rpgState.quest?.id===q.id&&!rpgState.quest?.rewarded,unavailable=!!q.unavailable;
    let label='의뢰 수주',disabled='';if(current){label='진행 중';disabled='disabled'}else if(cleared){label='완료';disabled='disabled'}else if(unavailable){label='준비 중';disabled='disabled'}else if(levelLocked){label=`Lv.${q.level} 필요`;disabled='disabled'}
    return `<div class="rpgQuestCard${featured?'':' compact'}${levelLocked||unavailable?' gwQuestLocked70':''}"><div class="gwQuestTop70"><span class="gwQuestClass70 ${q.category}">${categoryName(q.category)} · ${q.type}</span><span class="gwSkulls70" aria-label="난이도 ${q.difficulty}">${skulls(q.difficulty)}</span></div><h3>${q.name}</h3><p>${q.desc}</p><p><b>권장:</b> Lv.${q.level}+ · <b>목표:</b> ${collectText(q)}</p><div class="gwQuestReward70"><b>보상</b> · ${rewardText(q)}</div><div class="questActions"><button class="rpgQuestTake${current||cleared?' done':''}" type="button" data-quest-id="${q.id}" data-rank="F" ${disabled}>${label}</button></div></div>`
  }
  function findQ(id){return all.find(q=>q.id===id)||null}
  function recommendationDone70(q){
    if(!q)return true;
    if(repeatEnabled())return false;
    if((q.category==='strong'||q.category==='promotion')&&completedIds().includes(q.id))return true;
    if(q.category==='normal'||q.category==='elite'){
      const cycle=rpgState.questCycleClears4900||{},done=cycle[QDAY()];
      if(Array.isArray(done)&&done.includes(q.id))return true;
    }
    return false;
  }
  function recommendationCapacity70(){
    const members=[rpgState,rpgState.ai,rpgState.ai2].filter(Boolean);
    const avgLv=members.length?members.reduce((s,m)=>s+Math.max(1,Number(m.level)||1),0)/members.length:Math.max(1,Number(rpgState.level)||1);
    const eq=[rpgState.equipment?.weapon,rpgState.equipment?.armor].filter(Boolean);
    const eqLv=eq.length?Math.max(...eq.map(x=>Number(x.level)||1)):0;
    const gearBonus=eqLv>=10?2:eqLv>=5?1:0;
    return Math.max(1,Math.min(9,1+Math.floor((avgLv-1)*.65)+gearBonus));
  }
  function recommended(list){
    const cap=recommendationCapacity70(),activeId=rpgState.quest&&!rpgState.quest.rewarded?rpgState.quest.id:null;
    const available=list.filter(q=>questAvailable(q)&&q.category!=='promotion'&&!recommendationDone70(q)&&q.id!==activeId&&(Number(q.difficulty)||1)<=cap);
    if(!available.length)return null;
    const priority=q=>q.category==='strong'?3:q.category==='elite'?2:1;
    return available.sort((a,b)=>(Number(b.difficulty)||1)-(Number(a.difficulty)||1)||priority(b)-priority(a)||(Number(b.level)||1)-(Number(a.level)||1))[0]||null;
  }
  rpgQuestTestAvailable=function(id){const q=findQ(id);return !!q&&questAvailable(q)};
  window.rpgRenderQuestGuide=rpgRenderQuestGuide=function(filter=rpgState.selectedQuestFilter||'all'){
    const valid=['all','normal','elite','strong','promotion'];if(!valid.includes(filter))filter='all';rpgState.selectedQuestFilter=filter;
    const list=boardQuests();const shown=filter==='all'?list:list.filter(q=>q.category===filter);const rec=recommended(list);
    document.querySelectorAll('#rpgQuestTypeTabs [data-qfilter]').forEach(b=>b.classList.toggle('active',b.dataset.qfilter===filter));
    document.querySelector('#rpgRecommendedQuest').innerHTML=rec?questCard(rec,true):'<div class="gwQuestEmpty70">현재 추천 가능한 의뢰가 없습니다.</div>';
    document.querySelector('#rpgQuestListTitle').textContent=filter==='all'?'오늘의 전체 의뢰':categoryName(filter);
    document.querySelector('#rpgQuestList').innerHTML=shown.length?shown.map(q=>questCard(q,false)).join(''):'<div class="gwQuestEmpty70">현재 표시할 의뢰가 없습니다.</div>';
    document.querySelectorAll('#rpgQuestList .rpgQuestTake:not(:disabled),#rpgRecommendedQuest .rpgQuestTake:not(:disabled)').forEach(b=>b.addEventListener('click',()=>rpgRequestQuest(b.dataset.questId,'F',b)));
  };
  document.querySelectorAll('#rpgQuestTypeTabs [data-qfilter]').forEach(b=>b.addEventListener('click',()=>rpgRenderQuestGuide(b.dataset.qfilter)));

  function collectionReady(q){if(!q?.collect)return false;return Object.entries(q.collect).every(([k,n])=>(Number(rpgState.items?.[k])||0)>=n)}
  function setCollectComplete(){const q=rpgState.quest;if(q&&!q.rewarded&&q.collect){q.completed=collectionReady(q);q.kills=q.completed?q.target||1:0}}
  rpgAcceptQuest=function(id='f_n_green5',rank='F'){
    const q=findQ(id)||normal[0];if(!questAvailable(q))return;
    rpgState.quest={...q,rank:'F',kills:0,completed:false,rewarded:false,target:q.target||1};
    if(!Array.isArray(rpgState.acceptedQuestIds))rpgState.acceptedQuestIds=[];if(!rpgState.acceptedQuestIds.includes(q.id))rpgState.acceptedQuestIds.push(q.id);
    setCollectComplete();
    document.querySelector('#rpgAcceptedQuestBox').innerHTML=`<h3>F급 · ${q.name}</h3><b>${q.type}</b><br>목표: ${collectText(q)}<br>보상: ${rewardText(q)}`;
    const art=document.querySelector('#rpgAcceptedReceptionArt');if(art&&typeof rpgReceptionImages!=='undefined')art.src=rpgReceptionImages.quest;
    showPage('rpgQuestAcceptedPage');try{HuNyangDiag.line('RPG_QUEST_ACCEPT',q.name)}catch(_){ }
  };
  const oldGuildRender=rpgRenderGuild;
  rpgRenderGuild=function(){setCollectComplete();oldGuildRender();const q=rpgState.quest;if(q?.collect&&!q.rewarded){const ready=collectionReady(q),line=document.querySelector('#rpgGuildStoryLine');if(line&&!ready)line.textContent=`현재 의뢰: ${q.name} · ${collectText(q)} (보유 재료를 제출할 수 있습니다.)`}}

  function takeCollect(q){if(!q.collect)return true;for(const [k,n] of Object.entries(q.collect)){if((Number(rpgState.items?.[k])||0)<n)return false}for(const [k,n] of Object.entries(q.collect))rpgState.items[k]-=n;return true}
  function grantItems(items){const names=[];for(const [k,n] of Object.entries(items||{})){rpgState.items=rpgState.items||{};rpgState.items[k]=(rpgState.items[k]||0)+n;names.push(`${materialDefs[k]?.name||k} ×${n}`)}return names}
  function makeMeadowEquipment(slot,weaponType,armorType){return rpgMakeEquipment({series:'meadow',slot,weaponType,armorType,source:'quest',prefix:'초원의',rarity:'엘리트',level:10,weaponBonus:5,pdef:3,mdef:2,setAtk:4,extra:'라비엔 지역 추가 공격력 +2',border:'purple'})}
  function rewardChoice(q){
    if(!q.choiceReward)return [];
    rpgState.pendingQuestChoice70={questId:q.id,type:q.choiceReward};
    return ['선택 보상 대기'];
  }
  function ensureChoiceModal(){
    if(document.querySelector('#rpgQuestChoice70'))return;
    const wrap=document.createElement('div');wrap.className='appModalOverlay';wrap.id='rpgQuestChoice70';wrap.setAttribute('aria-hidden','true');
    wrap.innerHTML='<div class="appModalCard" role="dialog" aria-modal="true"><div class="rpgRewardIcon">🎁</div><div class="appModalTitle">선택 보상</div><div class="appModalDesc" id="rpgQuestChoiceDesc70">받을 장비를 선택하세요.</div><div class="gwChoiceGrid70" id="rpgQuestChoiceGrid70"></div></div>';document.body.appendChild(wrap);
  }
  function openChoiceModal(){
    const pending=rpgState.pendingQuestChoice70;if(!pending)return;ensureChoiceModal();const grid=document.querySelector('#rpgQuestChoiceGrid70');const desc=document.querySelector('#rpgQuestChoiceDesc70');
    const weapons=Object.entries(rpgWeaponDefs).filter(([k])=>k!=='seriaTealStaff');let opts=[];
    if(pending.type==='brokenMeadowWeapon'){desc.textContent='복원에 사용할 망가진 초원 무기를 1개 선택합니다.';opts=weapons.map(([k,d])=>({k,label:`⚔️ ${d.name}`,kind:'brokenWeapon'}));}
    else{desc.textContent='초원 장비 1개를 선택합니다.';opts=weapons.map(([k,d])=>({k,label:`⚔️ 초원의 ${d.name}`,kind:'meadowWeapon'}));for(const [k,d] of Object.entries(rpgArmorTypeDefs||{}))opts.push({k,label:`🛡️ 초원의 ${d.name||k}`,kind:'meadowArmor'});}
    grid.innerHTML=opts.map((o,i)=>`<button type="button" data-choice-i="${i}">${o.label}</button>`).join('');
    grid.querySelectorAll('[data-choice-i]').forEach(b=>b.addEventListener('click',()=>{const o=opts[Number(b.dataset.choiceI)];if(!o)return;rpgState.items=rpgState.items||{};rpgState.inventory=rpgState.inventory||[];let got='';
      if(o.kind==='brokenWeapon'){const key='brokenMeadowWeapon_'+o.k;materialDefs[key]=materialDefs[key]||{name:`망가진 초원의 ${rpgWeaponDefs[o.k]?.name||'무기'}`,icon:'⚔️',price:4,desc:`망가진 초원 ${rpgWeaponDefs[o.k]?.name||'무기'}. 슬라임의 핵과 재련하면 초원 장비로 복원할 수 있습니다.`};rpgState.items[key]=(rpgState.items[key]||0)+1;got=materialDefs[key].name;window.HuNyangForgeData[key]={cost:{[key]:1,slimeCore:1},result:{series:'meadow',slot:'weapon',weaponType:o.k}};}
      else if(o.kind==='meadowWeapon'){const item=makeMeadowEquipment('weapon',o.k,null);if(rpgState.inventory.length<40){rpgState.inventory.push(item);got=item.name}else{toast('인벤토리가 가득 찼습니다.');return}}
      else{const item=makeMeadowEquipment('armor',null,o.k);if(rpgState.inventory.length<40){rpgState.inventory.push(item);got=item.name}else{toast('인벤토리가 가득 찼습니다.');return}}
      rpgState.pendingQuestChoice70=null;setAppModal('rpgQuestChoice70',false);const lootEl=document.querySelector('#rpgQuestCompleteLoot');if(lootEl)lootEl.textContent=String(lootEl.textContent||'').replace('선택 보상 대기',got);toast(`${got} 획득!`);rpgSaveActiveSlot?.(null,'quest_choice_reward');
    }));setAppModal('rpgQuestChoice70',true);
  }
  rpgFinishQuest=function(){
    const q=rpgState.quest;if(!q||!q.completed||q.rewarded)return;
    if(!takeCollect(q)){q.completed=false;toast('제출할 재료가 부족합니다.');rpgRenderGuild();return}
    q.rewarded=true;const gold=q.rewardGold||0,exp=q.rewardExp||0;rpgState.gold=(rpgState.gold||0)+gold;const alive=[];
    if(rpgRewardOwnerAlive61(rpgState)){rpgGainExp(rpgState,exp,rpgState.name);alive.push(rpgState.name)}if(rpgRewardOwnerAlive61(rpgState.ai)){rpgGainExp(rpgState.ai,exp,rpgState.ai.name);alive.push(rpgState.ai.name)}if(rpgRewardOwnerAlive61(rpgState.ai2)){rpgGainExp(rpgState.ai2,exp,rpgState.ai2.name);alive.push(rpgState.ai2.name)}
    const loot=[...grantItems(q.rewardItems),...rewardChoice(q)];
    rpgState.completedQuestIds=Array.isArray(rpgState.completedQuestIds)?rpgState.completedQuestIds:[];if((q.category==='strong'||q.category==='promotion')&&!rpgState.completedQuestIds.includes(q.id))rpgState.completedQuestIds.push(q.id);
    document.querySelector('#rpgQuestCompleteRewardName').textContent=`F급 · ${q.name}`;document.querySelector('#rpgQuestCompleteExp').textContent=alive.length?`+${exp} · 생존 ${alive.length}명`:'전원 전투 불능 · EXP 없음';document.querySelector('#rpgQuestCompleteGold').textContent=`+${gold}G`;document.querySelector('#rpgQuestCompleteLoot').textContent=loot.length?loot.join(' · '):'의뢰 완료 기록';
    rpgRenderGuild();rpgSaveActiveSlot?.('rpgGuildPage','quest_complete');setAppModal('rpgQuestCompleteRewardModal',true);if(q.choiceReward)setTimeout(openChoiceModal,120);
  };
  try{HuNyangDiag.line('RPG_V4870_READY',`day=${QDAY()}|normal=10|elite=6|strong=2|expCap=2500`);HuNyangDiag.line('RPG_V4871_READY','quest_material_registry=V38_materialDefs|runtime_fix=ok');HuNyangDiag.line('RPG_V4872_READY','auto_potion_bridge=ok|enemy_tick_resume=ok|wolf_weight=15|red_weight=8');HuNyangDiag.line('RPG_V4873_READY','quest_kill_counter_fallback=rpgState.quest|boss_count=ok');HuNyangDiag.line('RPG_V4874_READY','inventory_materials=visible|quest_change_buttons=equal|elite_usable_scrap=7pct|elite_stone=4pct')}catch(_){ }
})();
