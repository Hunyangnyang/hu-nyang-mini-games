
(function(){
  const GW_FIELD_BG = {'morning': 'assets/images/0054_def2c2e38e.png', 'noon': 'assets/images/0055_2bcfec55fd.png', 'night': 'assets/images/0056_c85f4440fe.png', 'dawn': 'assets/images/0057_463d83d835.png'};
  const GW_BATTLE_BG = {'morning': 'assets/images/0058_60400eb77a.png', 'noon': 'assets/images/0059_06b4b21d9f.png', 'night': 'assets/images/0060_84d6d0b8c1.png', 'dawn': 'assets/images/0061_c6e6ef1f26.png'};

  function gwCurrentPartKey(){
    try{
      if(typeof rpgDayPart==='function') return rpgDayPart().key||'morning';
      if(typeof rpgPartFromTurn==='function') return (rpgPartFromTurn(rpgState?.worldTurn||0)?.key)||'morning';
    }catch(e){}
    return 'morning';
  }

  window.gwApplyTimeBackground56=function(scope='all'){
    const key=gwCurrentPartKey();
    if(scope==='all'||scope==='field'){
      const fieldBg=document.getElementById('rpgFieldFullBg');
      if(fieldBg&&GW_FIELD_BG[key])fieldBg.src=GW_FIELD_BG[key];
    }
    if(scope==='all'||scope==='battle'){
      const src=GW_BATTLE_BG[key]||GW_BATTLE_BG.morning;
      const battleFullBg=document.getElementById('rpgBattleFullBg');
      const battleFloorBg=document.getElementById('rpgBattleFloorBg');
      if(battleFullBg)battleFullBg.src=src;
      if(battleFloorBg)battleFloorBg.src=src;
    }
  };

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',()=>window.gwApplyTimeBackground56('all'),{once:true});
  }else{
    window.gwApplyTimeBackground56('all');
  }
})();
