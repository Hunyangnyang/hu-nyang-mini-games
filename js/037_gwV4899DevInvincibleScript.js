
(()=>{
  const KEY='hunyang_dev_invincible_v1';
  const enabled=()=>{try{return localStorage.getItem(KEY)==='1'}catch(_){return false}};
  const save=v=>{try{localStorage.setItem(KEY,v?'1':'0')}catch(_){ }};
  const sync=()=>{
    const b=document.querySelector('#devInvincibleToggle');
    if(!b)return;
    const on=enabled();
    b.classList.toggle('on',on);
    b.setAttribute('aria-checked',on?'true':'false');
  };
  window.HuNyangDevInvincible={enabled};

  const btn=document.querySelector('#devInvincibleToggle');
  if(btn&&!btn.dataset.invincibleBound){
    btn.dataset.invincibleBound='1';
    btn.addEventListener('click',()=>{
      const next=!enabled();
      save(next);
      sync();
      try{HuNyangDiag.line('SETTINGS_DEV_INVINCIBLE',next?'ON':'OFF')}catch(_){}
      if(typeof toast==='function')toast(next?'개발자 무적 모드 ON 🛡️':'개발자 무적 모드 OFF');
    });
  }
  sync();

  // Developer-only quest replay. Do not mutate slot completion history.
  const REPEAT_KEY='hunyang_test_repeat_quest_v1';
  const repeatEnabled=()=>{try{return localStorage.getItem(REPEAT_KEY)==='1'}catch(_){return false}};
  const repeatButton=document.querySelector('#repeatQuestTestToggle');
  const syncRepeat=()=>{if(!repeatButton)return;const v=repeatEnabled();repeatButton.classList.toggle('on',v);repeatButton.setAttribute('aria-checked',String(v));};
  window.HuNyangRepeatQuestTest={enabled:repeatEnabled};
  if(repeatButton&&!repeatButton.dataset.repeat79){
    repeatButton.dataset.repeat79='1';
    repeatButton.addEventListener('click',()=>{const v=!repeatEnabled();try{localStorage.setItem(REPEAT_KEY,v?'1':'0')}catch(_){}syncRepeat();try{HuNyangDiag.line('SETTINGS_REPEAT_QUEST',v?'ON':'OFF')}catch(_){};if(typeof toast==='function')toast(v?'개발자 의뢰 반복 수주 ON':'개발자 의뢰 반복 수주 OFF');try{if(typeof rpgRenderQuestGuide==='function'&&typeof activePageId==='function'&&activePageId()==='rpgQuestGuidePage')rpgRenderQuestGuide()}catch(_){} });
  }
  syncRepeat();
  try{HuNyangDiag.line('RPG_V4899_READY',`dev_invincible=${enabled()?'ON':'OFF'}|actual_damage_path=patched|wipe_damage=patched`)}catch(_){}
})();
