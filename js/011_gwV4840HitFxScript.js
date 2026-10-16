
(()=>{
  const GW_ART={
    male:{idle:rpgBattleCharacterArt.adventurerMaleIdle,attack:rpgBattleCharacterArt.adventurerMaleAttack,hit:"assets/images/0062_752729b99d.png"},
    female:{idle:rpgBattleFemaleArt.adventurerFemaleIdle,attack:rpgBattleFemaleArt.adventurerFemaleAttack,hit:"assets/images/0063_0ed1390230.png"}
  };
  const GW_HIT_FX="assets/images/0064_241e0fe0e9.png";
  const allyLocks=new Set();
  const enemyLocks=new Set();
  let visualLockCount=0;

  // 전투 중 처음 타격될 때 이미지 디코딩 지연이 생기지 않도록 선로딩.
  const preloads=[];
  [GW_HIT_FX,...Object.values(GW_ART).flatMap(v=>[v.idle,v.attack,v.hit]),rpgSlimeDefs.wolf?.image,rpgSlimeDefs.wolf?.attackImage,rpgSlimeDefs.wolf?.hitImage].filter(Boolean).forEach(src=>{
    const im=new Image(); im.src=src;
    try{im.decode?.().catch(()=>{})}catch(e){}
    preloads.push(im);
  });

  function genderKey(u){
    const g=u?.id==='player'
      ? (rpgState.gender||'남성')
      : (u?.gender||rpgState.ai?.gender||'남성');
    return (g==='여성'||g==='여자'||g==='female')?'female':'male';
  }
  function isAdventurer(u){
    return !!u&&(u.job?.id==='adventurer'||u.job?.name==='모험가');
  }
  function artOf(u){ return GW_ART[genderKey(u)]; }
  function partyUnitEl(u){ return document.querySelector(`#rpgBattleUnits [data-party-unit="${u?.id}"]`); }
  function enemyUnitEl(index){ return document.querySelector(`#rpgBattleUnits [data-battle-enemy="${index}"]`); }
  function setEnemySprite(e,index,kind){
    if(!e)return;
    // Wolf boss owns its single sprite slot: never override its pattern or attack art from generic hit FX.
    if(e.type==='wolfBoss'){
      window.gwWolfStateSprite4936?.(e);
      return;
    }
    // v4.9.54 common priority: boss cast/attack/skill state outranks hit art.
    const gs=e._gs87;
    if(e.type==='slimeBoss'&&gs){
      if(gs.cast||gs.busy||gs.breakMode||gs.splitPhase||gs.visual&&gs.visual!=='idle')return;
    }
    if(kind==='hit'&&((e.gauge||0)>=100||enemyLocks.has(index)))return;
    const img=enemyUnitEl(index)?.querySelector('.rpgBattleUnitSprite img');
    if(!img)return;
    const src=kind==='attack'?(e.attackImage||e.image):kind==='hit'?(e.hitImage||e.image):e.image;
    if(src)img.src=src;
  }

  function beginVisualLock(){
    const f=rpgState.field;if(!f)return;
    visualLockCount++;
    f.playerAttackAnimating=true; // 기존 고빈도 전체 렌더 방지 플래그를 공용 시각 잠금으로 사용
  }
  function endVisualLock(){
    const f=rpgState.field;if(!f)return;
    visualLockCount=Math.max(0,visualLockCount-1);
    if(!visualLockCount)f.playerAttackAnimating=false;
  }

  function showHitFx(el){
    if(!el)return null;
    el.querySelectorAll(':scope > .gwHitFx').forEach(x=>x.remove());

    const fx=document.createElement('img');
    fx.className='gwHitFx';
    fx.src=GW_HIT_FX;
    fx.alt='';
    const positions=[
      [18,30,-24],[25,68,12],[78,28,19],[82,65,-14],
      [35,18,-8],[66,82,24],[14,52,7],[86,48,-22]
    ];
    const p=positions[Math.floor(Math.random()*positions.length)];
    fx.style.left=p[0]+'%';
    fx.style.top=p[1]+'%';
    fx.style.setProperty('--gwfxrot',p[2]+'deg');
    el.appendChild(fx);
    return fx;
  }

  function hideHitFx(fx){
    if(!fx||!fx.isConnected)return;
    fx.classList.add('gwOut');
    setTimeout(()=>fx.remove(),130);
  }

  function knockback(el, direction, duration=170){
    if(!el)return;
    const px=direction==='right'?14:-14;
    el.style.transition='translate 85ms cubic-bezier(.2,.8,.25,1)';
    el.style.translate=px+'px 0';
    setTimeout(()=>{
      el.style.transition='translate '+duration+'ms cubic-bezier(.2,.75,.25,1)';
      el.style.translate='0 0';
    },95);
  }

  function setAdventurerSprite(u,kind){
    if(!isAdventurer(u))return;
    const img=document.querySelector(`[data-party-sprite-img="${u.id}"]`);
    if(!img)return;
    const art=artOf(u);
    img.src=art[kind]||art.idle;
    img.alt=`${u.name} ${kind==='attack'?'공격':kind==='hit'?'피격':'전투 대기'}`;
  }

  function partyHitReaction(u, holdMs=280){
    const el=partyUnitEl(u);
    const fx=showHitFx(el);
    knockback(el,'left');
    // Skills/items/attacks and fully charged ATB have precedence over hit sprites.
    const keepMotion=allyLocks.has(u.id)||(u.gauge||0)>=100||!!el?.classList.contains('gwSkillMotion4900');
    if(!keepMotion&&isAdventurer(u))setAdventurerSprite(u,'hit');

    setTimeout(()=>{
      if(!keepMotion&&!allyLocks.has(u.id)&&isAdventurer(u))setAdventurerSprite(u,'idle');
      hideHitFx(fx);
    },holdMs);
  }

  function enemyHitReaction(index, holdMs=300){
    const el=enemyUnitEl(index);
    const fx=showHitFx(el);
    knockback(el,'right');
    setTimeout(()=>hideHitFx(fx),holdMs);
  }

  function playPartyNormalAttack(u,targetIndex,doHit){
    const f=rpgState.field;
    if(!f?.battle||!u||allyLocks.has(u.id))return false;
    allyLocks.add(u.id);
    beginVisualLock();

    const wrap=document.querySelector(`[data-party-sprite="${u.id}"]`);
    const unit=partyUnitEl(u);
    const art=isAdventurer(u)?artOf(u):null;
    let fx=null,hitDone=false;

    if(wrap&&art){
      setAdventurerSprite(u,'attack');
      wrap.style.transition='transform 145ms cubic-bezier(.22,.72,.25,1)';
      wrap.style.transform='translateX(10px) translateY(-2px) scale(1.035)';
      setTimeout(()=>{
        const enemy=f?.battle?.enemies?.[targetIndex];
        fx=showHitFx(enemyUnitEl(targetIndex));
        knockback(enemyUnitEl(targetIndex),'right');
        if(enemy?.hitImage&&!enemyLocks.has(targetIndex)&&(enemy.gauge||0)<100)setEnemySprite(enemy,targetIndex,'hit');
      },120);
    }else if(unit){
      unit.style.transition='translate 140ms cubic-bezier(.22,.72,.25,1)';
      unit.style.translate='12px 0';
      setTimeout(()=>{
        const enemy=f?.battle?.enemies?.[targetIndex];
        fx=showHitFx(enemyUnitEl(targetIndex));
        knockback(enemyUnitEl(targetIndex),'right');
        if(enemy?.hitImage&&!enemyLocks.has(targetIndex)&&(enemy.gauge||0)<100)setEnemySprite(enemy,targetIndex,'hit');
      },120);
    }

    setTimeout(()=>{if(!hitDone){hitDone=true;doHit?.()}},255);

    setTimeout(()=>{
      if(wrap&&art){
        wrap.style.transition='transform 170ms cubic-bezier(.22,.72,.25,1)';
        wrap.style.transform='translateX(0) translateY(0) scale(1)';
      }else if(unit){
        unit.style.transition='translate 160ms cubic-bezier(.22,.72,.25,1)';
        unit.style.translate='0 0';
      }
    },365);

    setTimeout(()=>{
      if(wrap&&art)setAdventurerSprite(u,'idle');
      const enemy=f?.battle?.enemies?.[targetIndex];
      if(enemy?.hitImage&&!enemyLocks.has(targetIndex))setEnemySprite(enemy,targetIndex,'idle');
      hideHitFx(fx);
    },500);

    setTimeout(()=>{
      if(wrap&&art){
        wrap.style.transition='none';
        wrap.style.transform='translateX(0) translateY(0) scale(1)';
      }
      if(unit)unit.style.translate='0 0';
      allyLocks.delete(u.id);
      endVisualLock();
      try{window.gwBattle55PostActionRefresh?.('party_attack_end')}catch(e){}
    },610);
    return true;
  }

  function playEnemyNormalAttack(e,index,target,doHit){
    const f=rpgState.field;
    if(!f?.battle||!e||enemyLocks.has(index))return false;
    enemyLocks.add(index);
    beginVisualLock();

    const enemyEl=enemyUnitEl(index);
    const enemyImg=enemyEl?.querySelector('.rpgBattleUnitSprite img');
    if(e.attackImage)setEnemySprite(e,index,'attack');
    if(enemyImg&&e.attackImage){
      enemyImg.style.transition='transform 120ms cubic-bezier(.22,.72,.25,1)';
      enemyImg.style.transform='translateY(5px) scale(1.035,.96)';
    }
    if(enemyEl){
      enemyEl.style.transition='translate 150ms cubic-bezier(.18,.8,.25,1)';
      enemyEl.style.translate=(e.type==='wolf'?'-28px 0':'-13px 0');
    }

    setTimeout(()=>{
      partyHitReaction(target,300);
    },e.type==='wolf'?165:145);

    setTimeout(()=>doHit?.(),185);

    setTimeout(()=>{
      if(enemyEl){
        enemyEl.style.transition='translate 165ms cubic-bezier(.22,.72,.25,1)';
        enemyEl.style.translate='0 0';
      }
      if(enemyImg&&e.attackImage){
        enemyImg.style.transition='transform 165ms cubic-bezier(.22,.72,.25,1)';
        enemyImg.style.transform='translateY(0) scale(1)';
      }
    },e.type==='wolf'?300:270);

    setTimeout(()=>{
      if(enemyEl)enemyEl.style.translate='0 0';
      if(enemyImg)enemyImg.style.transform='translateY(0) scale(1)';
      if(e.attackImage)setEnemySprite(e,index,'idle');
      // Do not erase a target's own active skill/attack with an unrelated idle reset.
      if(!allyLocks.has(target.id)&&!partyUnitEl(target)?.classList.contains('gwSkillMotion4900'))setAdventurerSprite(target,'idle');
      enemyLocks.delete(index);
      endVisualLock();
      try{window.gwBattle55PostActionRefresh?.('enemy_attack_end')}catch(e){}
    },470);
    return true;
  }

  // 수동 일반공격: 기존 스킬 흐름은 건드리지 않는다.
  window.rpgPlayerAttack=function(index){
    const f=rpgState.field,p=f?.party?.[0];
    if(!f?.battle||!f.targetMode||!p||p.gauge<100||allyLocks.has(p.id))return;
    const e=f.battle.enemies[index];if(!e||e.dead)return;
    const skillId=f.pendingSkill;
    f.targetMode=false;f.pendingSkill=null;f.skillMenu=false;

    if(!skillId){
      playPartyNormalAttack(p,index,()=>rpgExecutePlayerAction({type:'attack',target:index}));
      return;
    }
    rpgExecutePlayerAction({type:'skill',skillId,target:index});
  };

  // 자동전투 일반공격도 동일 애니메이션.
  window.rpgAutoPlayerAction=function(){
    const f=rpgState.field,b=f?.battle,p=f?.party?.[0];
    if(!f?.autoBattle||!b||!p||p.dead||p.gauge<100||allyLocks.has(p.id))return false;
    const living=b.enemies.map((e,i)=>({e,i})).filter(x=>!x.e.dead);
    if(!living.length)return false;

    if(p.hp/p.derived.maxHp<=.30){
      if(window.rpgUsePotionAuto?.(p)){HuNyangDiag.line('RPG_AUTO_ACTION','potion');return true}
      HuNyangDiag.line('RPG_AUTO_ACTION','defend');
      return rpgExecutePlayerAction({type:'defend'});
    }

    const step=f.autoPattern||0;f.autoPattern=(step+1)%3;
    if(step===2){
      const skills=rpgKnownActiveSkills(p).filter(s=>(p.skillCooldowns?.[s.id]||0)<=0&&p.mp>=s.mp);
      if(skills.length){
        const sk=skills[0];
        HuNyangDiag.line('RPG_AUTO_ACTION',`skill:${sk.id}`);
        if(sk.kind==='heal')return rpgExecutePlayerAction({type:'skill',skillId:sk.id});
        const t=living[Math.floor(Math.random()*living.length)];
        return rpgExecutePlayerAction({type:'skill',skillId:sk.id,target:t.i});
      }
    }

    const t=living[Math.floor(Math.random()*living.length)];
    HuNyangDiag.line('RPG_AUTO_ACTION',`attack:${t.i}`);
    playPartyNormalAttack(p,t.i,()=>rpgExecutePlayerAction({type:'attack',target:t.i}));
    return true;
  };

  // AI 파티원 일반공격도 같은 타격 이펙트/넉백 적용.
  window.rpgAiAtbAction=function(ai){
    const f=rpgState.field,b=f?.battle;
    if(!b||ai.dead||ai.gauge<100||allyLocks.has(ai.id))return;
    const living=b.enemies.map((e,i)=>({e,i})).filter(x=>!x.e.dead);
    if(!living.length)return;

    const aiSkill=rpgAiSkillAction(ai);
    if(aiSkill){
      const t=living[Math.floor(Math.random()*living.length)];
      rpgUseActiveSkill(ai,aiSkill.skillId,t.i);
      rpgResetGauge(ai);
      return;
    }

    const t=living[Math.floor(Math.random()*living.length)];
    const hit=()=>{
      if(!f.battle||ai.dead||t.e.dead)return;
      rpgPhysicalHit(ai,t.e,ai.name,`${t.e.name} ${t.i+1}`,`#rpgCombatEnemy .rpgCombatUnit[data-enemy="${t.i}"]`);
      rpgResetGauge(ai);
      rpgCheckBattleEnd();
    };
    playPartyNormalAttack(ai,t.i,hit);
  };

  // 적군 일반공격: 전진 -> 아군 피격 이펙트/피격 PNG/넉백 -> 복귀.
  window.rpgEnemyAtbAction=function(e,index){
    const f=rpgState.field;
    if(!f?.battle||e.dead||e.gauge<100||enemyLocks.has(index))return;

    const living=f.party.filter(u=>!u.dead);
    if(!living.length)return;
    const pick=rpgPickPartyTargetByLine(living),target=pick.target;

    playEnemyNormalAttack(e,index,target,()=>{
      if(!f.battle||e.dead||target.dead)return;
      const partyIndex=Math.max(0,f.party.indexOf(target));
      rpgPhysicalHit(
        e,target,
        `${e.name} ${index+1}`,
        target.name,
        `#rpgCombatParty .rpgCombatUnit:nth-child(${target.position+1})`
      );
      rpgResetGauge(e);
      rpgCheckBattleEnd();
    });
  };
})();
