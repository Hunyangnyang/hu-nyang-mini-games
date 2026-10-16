
(()=>{
  const ASSETS={
    mascot:'assets/images/0001_ce7c7cc2ee.png',
    win:'assets/images/0004_2f5d483057.png',
    maleIdle:'assets/images/0011_76c334f23d.png',
    maleWalk:'assets/images/0103_26f438ff95.png',
    femaleIdle:'assets/images/0013_47bea42b3b.png',
    femaleWalk:'assets/images/0104_a4f5050a2d.png'
  };


  function leaderAsset(idle=false){
    const female=(typeof rpgState!=='undefined')&&rpgState?.gender==='여성';
    return idle?(female?ASSETS.femaleIdle:ASSETS.maleIdle):(female?ASSETS.femaleWalk:ASSETS.maleWalk);
  }

  function applyFieldLeaderStage(){
    const stage=document.getElementById('gwFieldLeaderStage94');
    const img=document.getElementById('gwFieldLeaderImg94');
    const encounter=document.getElementById('gwEncounterShowcase58');
    if(!stage||!img)return;
    const page=(typeof activePageId==='function')?activePageId():'';
    const f=(typeof rpgState!=='undefined')?rpgState?.field:null;
    const visible=page==='rpgFieldPage'&&!!f&&!f.battle;
    stage.classList.toggle('show',visible);
    stage.style.display=visible?'flex':'none';
    if(!visible){
      stage.classList.remove('moving','idle','encounter');
      encounter?.classList.remove('gwEncounterRight94');
      return;
    }
    const hasEncounter=!!f.encounter,moving=!!f._gwMoving4903;
    img.src=leaderAsset(!moving);
    img.alt=moving?'파티장 이동':'파티장 전투 대기';
    stage.classList.toggle('moving',moving);
    stage.classList.toggle('idle',!moving&&!hasEncounter);
    stage.classList.toggle('encounter',hasEncounter);
    encounter?.classList.toggle('gwEncounterRight94',hasEncounter);
  }
  window.GWApplyFieldLeaderStage94=applyFieldLeaderStage;

  try{
    if(typeof rpgBattleCharacterArt!=='undefined')rpgBattleCharacterArt.adventurerMaleIdle=ASSETS.maleIdle;
    if(typeof rpgBattleFemaleArt!=='undefined')rpgBattleFemaleArt.adventurerFemaleIdle=ASSETS.femaleIdle;
  }catch(_){ }

  const oldRenderField4908=(typeof rpgRenderField==='function')?rpgRenderField:null;
  if(typeof oldRenderField4908==='function'){
    window.rpgRenderField=function(){
      const v=oldRenderField4908.apply(this,arguments);
      applyFieldLeaderStage();
      return v;
    };
  }

  const oldShow4908=(typeof showPage==='function')?showPage:null;
  if(typeof oldShow4908==='function'){
    window.showPage=function(id,dir='auto'){
      const v=oldShow4908(id,dir);
      requestAnimationFrame(()=>{applyFieldLeaderStage();});
      return v;
    };
  }

  applyFieldLeaderStage();
  try{HuNyangDiag.line('RPG_V4909_READY','initial_assets=direct_embed|main_mascot=correct|bingo_mascot=correct|bingo_win=manse|version=4.9.25|field_leader=kept')}catch(_){ }
})();
