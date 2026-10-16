
(()=>{
  'use strict';
  const q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>[...r.querySelectorAll(s)];
  const pick=a=>a[Math.floor(Math.random()*a.length)];

  /* ---------- persistent class progression ---------- */
  function hist4905(){
    return rpgState.classQuestHistory4905||(rpgState.classQuestHistory4905={});
  }
  function rec4905(k){
    const h=hist4905();
    return h[k]||(h[k]={completedStages:[],acceptedStages:[]});
  }
  function markAccepted4905(k,stage){
    const r=rec4905(k);
    if(!r.acceptedStages.includes(stage))r.acceptedStages.push(stage);
  }
  function markDone4905(k,stage){
    const r=rec4905(k);
    if(!r.completedStages.includes(stage))r.completedStages.push(stage);
  }
  function isDone4905(k,stage){
    return !!rec4905(k).completedStages.includes(stage);
  }
  window.GWClassStageDone4905=isDone4905;

  /* Migrate an already-active stage 2 save so stage 1 is permanently considered done. */
  (()=>{
    const cq=rpgState.classQuest;
    if(cq?.mentor&&(Number(cq.stage)||1)>=2){
      markAccepted4905(cq.mentor,1);
      markDone4905(cq.mentor,1);
      markAccepted4905(cq.mentor,2);
    }
  })();

  /* ---------- hide ! once stage 2 is active, and block old stage-1 handler ---------- */
  function syncBang4905(){
    const cq=rpgState.classQuest;
    qa('#rpgGuildNpcPage .gwClassQuestBang79').forEach(b=>{
      const k=b.closest('.guildNpcPortraitPick')?.querySelector('[data-guild-npc]')?.dataset.guildNpc;
      const stage=Number(cq?.stage)||1;
      const activeSame=cq&&!cq.rewarded&&cq.mentor===k;
      const locked=isDone4905(k,1)||(activeSame&&stage>=2);
      b.classList.toggle('gwStageLocked4905',locked);
      if(locked)b.classList.remove('show','gwStage2Ready4904');
    });
  }
  document.addEventListener('click',e=>{
    const bang=e.target.closest?.('#rpgGuildNpcPage .gwClassQuestBang79');
    if(!bang)return;
    const k=bang.closest('.guildNpcPortraitPick')?.querySelector('[data-guild-npc]')?.dataset.guildNpc;
    const cq=rpgState.classQuest;
    if(isDone4905(k,1)||((Number(cq?.stage)||1)>=2&&cq?.mentor===k)){
      e.preventDefault();e.stopImmediatePropagation();
    }
  },true);

  /* ---------- stage-2 dialogue ---------- */
  const RESPONSES={
    rubia:{
      choices:[
        {text:'이번엔 진짜 전사다운 상대를 기대하고 있었어.',delta:+1,res:['그 자신감, 마음에 드는데? 그럼 제대로 보여줘.','좋아. 그 정도 기세면 다음 시험도 기대해볼 만하겠네.']},
        {text:'네가 인정할 정도면 나도 꽤 성장한 거네.',delta:+1,res:['흥, 자만하지만 않으면 괜찮아. 그래도 성장한 건 맞아.','그 말은 틀리지 않네. 처음보다 훨씬 나아졌어.']},
        {text:'다음 시험도 맡겨줘. 깔끔하게 끝내고 올게.',delta:+1,res:['좋아. 그런 대답을 기다렸어.','마음에 드네. 그럼 설명은 한 번만 할게, 잘 들어.']},
        {text:'칭찬은 됐고, 다음 상대나 알려줘.',delta:-1,res:['...정말 분위기 깨는 재주는 확실하네. 좋아, 알려줄게.','흥! 한마디를 예쁘게 못 하지? 그래도 시험은 시험이니까 설명해줄게.']},
        {text:'40마리 잡았는데 또 뭘 시키려고?',delta:-1,res:['벌써 투덜대? 전사는 그 정도로 끝나는 직업이 아니거든.','귀찮으면 여기서 그만둬도 돼. ...그래도 계속할 거잖아?']},
        {text:'이 정도면 그냥 전사 시켜줘도 되는 거 아냐?',delta:-1,res:['꿈도 크네. 다음 시험부터 통과하고 그런 소리 해.','웃기고 있네. 아직 확인할 게 남았어.']}
      ],
      boss:['다음 2차 시험은 라비엔 초원의 거대 슬라임 토벌이야. 몸집만 큰 게 아니라 분열과 방어 패턴까지 쓰니까, 전열에서 버티면서 흐름을 읽어야 해.','이번 상대는 거대 슬라임이야. 공격만 밀어붙이지 말고 분열과 방어 타이밍을 보고 버텨. 그걸 해내야 전사로서 다음 단계로 넘어갈 수 있어.'],
      sendPos:['난 네가 해낼 거라고 생각해. 무사히 끝내고 돌아와.','잘 다녀와. 이번엔 네가 어디까지 버틸 수 있는지 보여줘.'],
      sendNeg:['설명 끝났으니까 빨리 가봐. 여기서 더 시간 끌지 말고.','자, 이제 거대 슬라임이나 잡으러 가. 실패하고 변명하러 오진 말고.'],
      bossType:'slimeBoss',bossName:'거대 슬라임',quest:'전사 전직 의뢰 · 2차'
    },
    kain:{
      choices:[
        {text:'다음 상대가 누군데? 벌써 기대되는데.',delta:+1,res:['기세는 좋군. 그럼 네 속도가 어디까지 통하는지 보자.','좋아. 다음 시험은 네 움직임을 제대로 시험할 상대다.']},
        {text:'네가 인정해주니까 조금 기분 좋은데.',delta:+1,res:['...그런 말을 대놓고 하는군. 나쁘진 않아.','흥미롭군. 아무튼 실력이 오른 건 사실이야.']},
        {text:'이번에도 제대로 끝내고 돌아올게.',delta:+1,res:['좋은 대답이다. 그러면 설명하지.','그 정도 자신감이면 충분해. 다음 목표를 알려주지.']},
        {text:'칭찬은 필요 없고 다음 시험이나 말해.',delta:-1,res:['성급하군. 그래도 원하는 대로 바로 본론으로 가지.','말투는 마음에 안 들지만 효율적이긴 하네. 들어.']},
        {text:'또 사냥이야? 생각보다 귀찮네.',delta:-1,res:['도적 시험이 산책일 거라고 생각했나?','귀찮으면 포기해도 돼. 하지만 여기까지 와서 그러진 않겠지.']},
        {text:'이 정도면 이미 충분히 빠른 것 같은데.',delta:-1,res:['자기평가는 후하군. 늑대왕 앞에서도 같은 소리가 나오는지 보자.','그 자신감이 진짜인지 확인할 상대가 있어.']}
      ],
      boss:['2차 시험은 늑대왕 토벌이다. 일반 늑대보다 훨씬 빠르고 공격적인 상대야. 움직임을 읽고 빈틈을 노려.','다음 목표는 늑대왕이다. 속도에 끌려다니지 말고 네 타이밍으로 파고들어야 해.'],
      sendPos:['널 믿어보지. 무사히 끝내고 돌아와.','잘 다녀와. 네 방식대로 빈틈을 잡으면 충분할 거다.'],
      sendNeg:['설명은 끝났다. 빨리 가서 처리하고 와.','이제 가. 오래 서 있을수록 서로 귀찮아지니까.'],
      bossType:'wolfBoss',bossName:'늑대왕',quest:'도적 전직 의뢰 · 2차'
    }
  };

  function affinity4905(k){
    return Number(window.V38_ensureRelations?.()?.[k]?.affinity)||0;
  }
  function addAffinity4905(k,delta){
    const rel=window.V38_ensureRelations?.();
    if(!rel?.[k])return;
    rel[k].affinity=(Number(rel[k].affinity)||0)+delta;
    try{rpgSaveActiveSlot?.(null,'class_stage2_disposition_v4905')}catch(_){}
    try{HuNyangDiag.line('RPG_CLASS_STAGE2_DISPOSITION',`${k}|delta=${delta}|affinity=${rel[k].affinity}`)}catch(_){}
  }
  function mentorArt4905(k){
    const a=window.V38_ASSETS||{},neg=affinity4905(k)<0;
    return k==='rubia'
      ? (neg?(a.warriorAnnoyed||a.warriorHappy):(a.warriorHappy||''))
      : (neg?(a.rogueSerious||a.rogueNormal):(a.rogueNormal||''));
  }
  function showTalk4905(k,text,choice){
    window.V38_cancelNpcTimer?.();window.V38_classTalkActive=true;
    const sel=q('#rpgGuildNpcSelect'),talk=q('#rpgGuildNpcTalk'),speech=q('#rpgGuildNpcSpeech'),name=q('#rpgGuildNpcName'),art=q('#rpgGuildNpcArt'),host=q('#rpgGuildNpcChoices');
    if(sel)sel.style.display='none';if(talk)talk.style.display='';
    if(speech)speech.textContent=text;
    if(name)name.textContent=k==='rubia'?'루비아(전사)':'카인(도적)';
    if(art)art.src=mentorArt4905(k);
    if(host){
      host.innerHTML='';
      host.classList.remove('gwTwoChoice80');
      host.classList.toggle('gwStage2Choice4905',!!choice);
      if(choice){
        const b=document.createElement('button');
        b.type='button';b.textContent=choice.text;b.onclick=choice.on;host.appendChild(b);
      }
    }
  }
  function finalReturn4905(){
    const host=q('#rpgGuildNpcChoices');if(host){host.innerHTML='';host.classList.remove('gwStage2Choice4905')}
    window.GW80ClassReturnReady?.();
    const hint=q('#guildNpcReturnHint');if(hint)hint.textContent='터치하여 되돌아가기';
  }
  function acceptStage2_4905(k){
    const cq=rpgState.classQuest,d=RESPONSES[k];if(!cq||!d)return;
    markAccepted4905(k,1);markDone4905(k,1);markAccepted4905(k,2);
    cq.stage=2;cq.name=d.quest;cq.target=1;cq.kills=0;cq.completed=false;cq.rewarded=false;
    cq.bossType=d.bossType;cq.bossName=d.bossName;cq.stage2AcceptedAtTurn=Number(rpgState.worldTurn)||0;
    rpgSaveActiveSlot?.(null,'class_quest_stage2_accept_v4905');
    try{HuNyangDiag.line('RPG_CLASS_QUEST_STAGE2_ACCEPT',`${k}|boss=${d.bossType}`)}catch(_){}
    syncBang4905();
  }
  function beginStage2Flow4905(k){
    const cq=rpgState.classQuest,d=RESPONSES[k];
    if(!cq||!d||cq.mentor!==k||!cq.completed||(Number(cq.stage)||1)!==1||isDone4905(k,1))return;
    const intro=k==='rubia'
      ? (affinity4905(k)<0?'...빨리 왔네. 기록은 확인했어.':'생각보다 빨리 끝냈네. 제법인데?')
      : (affinity4905(k)<0?'빨리 끝냈군. 기록은 확인했다.':'꽤 빠르군. 첫 시험은 충분히 통과했어.');
    const choice=pick(d.choices);
    showTalk4905(k,intro,{
      text:choice.text,
      on:()=>{
        addAffinity4905(k,choice.delta);
        showTalk4905(k,pick(choice.res),{
          text:'다음 시험에 대해 듣는다',
          on:()=>{
            showTalk4905(k,pick(d.boss),{
              text:'알겠어',
              on:()=>{
                acceptStage2_4905(k);
                const send=affinity4905(k)<0?d.sendNeg:d.sendPos;
                showTalk4905(k,pick(send),null);
                finalReturn4905();
              }
            });
          }
        });
      }
    });
  }

  /* Override old stage-1-report click before v4.9.04's capture handler. */
  document.addEventListener('click',e=>{
    const bang=e.target.closest?.('#rpgGuildNpcPage .gwClassQuestBang79');
    if(!bang)return;
    const cq=rpgState.classQuest,k=bang.closest('.guildNpcPortraitPick')?.querySelector('[data-guild-npc]')?.dataset.guildNpc;
    if(cq&&cq.mentor===k&&cq.completed&&(Number(cq.stage)||1)===1&&!isDone4905(k,1)){
      e.preventDefault();e.stopImmediatePropagation();
      beginStage2Flow4905(k);
    }
  },true);

  /* Mark stage 2 completed once its boss is actually defeated. 3rd stage support uses the same one-time history. */
  const oldVictory4905=rpgBattleVictory;
  rpgBattleVictory=function(){
    const cq=rpgState.classQuest;
    const stage=Number(cq?.stage)||1,k=cq?.mentor,bossType=cq?.bossType;
    const enemies=[...(rpgState.field?.battle?.enemies||[])];
    const stage2BossKilled=stage===2&&bossType&&enemies.some(e=>e?.type===bossType&&e.dead);
    const v=oldVictory4905.apply(this,arguments);
    if(stage2BossKilled&&k){
      markDone4905(k,2);
      try{rpgSaveActiveSlot?.(null,'class_stage2_done_v4905')}catch(_){}
    }
    return v;
  };

  /* Keep old bang renderer from resurrecting the ! after stage changes. */
  const oldShow4905=showPage;
  showPage=function(id,dir='auto'){
    const v=oldShow4905(id,dir);
    if(id==='rpgGuildNpcPage')setTimeout(syncBang4905,0);
    return v;
  };
  const npcContent=q('#rpgGuildNpcPageContent');
  if(npcContent)new MutationObserver(()=>queueMicrotask(syncBang4905)).observe(npcContent,{childList:true,subtree:true});
  setTimeout(syncBang4905,60);

  try{HuNyangDiag.line('RPG_V4905_READY','encounter_buttons=row_center|scrollbar=hidden_all|victory=transparent_korean|class_stages=one_time|stage2_dialogue=disposition_choice_reaction_boss_sendoff_touch_return')}catch(_){}
})();
