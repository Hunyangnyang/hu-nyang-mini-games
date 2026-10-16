
(function(){

  function gwGenderOf(u){
    if(!u)return '남성';
    try{return u.id==='player' ? (rpgState.gender||'남성') : (rpgState.ai?.gender||'남성')}catch(e){return '남성'}
  }
  function gwExactIcon(u){
    if(!u || u.job?.id!=='adventurer')return '';
    return gwGenderOf(u)==='여성' ? rpgSaveAdventurerPortraits.female : rpgSaveAdventurerPortraits.male;
  }

  function gwHideFieldEncounterCells(){
    // CSS에서 영구 비표시. DOM을 지우지 않아 사냥터 렌더/진입 로직에 간섭하지 않는다.
  }

  function gwApplyExactPartyIcons(){
    let party=[];
    try{party=rpgState?.field?.party||[]}catch(e){}

    document.querySelectorAll('#rpgBattlePartyStrip .rpgBattlePartyCard').forEach((card,i)=>{
      const u=party[i], src=gwExactIcon(u), face=card.querySelector('.rpgBattlePartyFace');
      if(!u||!src||!face)return;
      face.classList.add('gwExactPartyIcon');
      face.innerHTML='<img src="'+src+'" alt="'+(u.name||'모험가')+'">';
    });

    document.querySelectorAll('#rpgPartyStatus .rpgPartyStatus').forEach((card,i)=>{
      const u=party[i], src=gwExactIcon(u), top=card.querySelector('.rpgStatusTop'), left=top?.children?.[0];
      if(!u||!src||!left)return;
      left.innerHTML='<img class="gwFieldPartyIcon" src="'+src+'" alt=""><span>'+(u.name||'모험가')+'</span>';
      left.style.display='inline-flex';left.style.alignItems='center';
    });
    gwHideFieldEncounterCells();
  }

  // MutationObserver는 자기 DOM 수정을 다시 감지해 무한 루프를 만들 수 있으므로 사용하지 않는다.
  // 필요한 렌더 함수가 끝난 직후 한 번만 정확한 아이콘을 덮어쓴다.
  function gwWrapOnce(name){
    const orig=window[name];
    if(typeof orig!=='function'||orig.__gwExactIconWrapped)return;
    const wrapped=function(){
      const result=orig.apply(this,arguments);
      try{gwApplyExactPartyIcons()}catch(e){console.warn('gw exact icon patch',name,e)}
      return result;
    };
    wrapped.__gwExactIconWrapped=true;
    window[name]=wrapped;
  }
  function gwInitExactIcons(){
    gwWrapOnce('rpgRenderBattlePartyStrip');
    gwWrapOnce('rpgRenderPartyStatus');
    gwApplyExactPartyIcons();
  }
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',()=>setTimeout(gwInitExactIcons,0),{once:true});
  }else{
    setTimeout(gwInitExactIcons,0);
  }
  setTimeout(gwApplyExactPartyIcons,250);
})();
