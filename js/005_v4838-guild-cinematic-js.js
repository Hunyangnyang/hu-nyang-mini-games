
(()=>{
'use strict';
const $=(s,r=document)=>r.querySelector(s);
const select=$('#rpgGuildNpcSelect'),talk=$('#rpgGuildNpcTalk'),pageContent=$('#rpgGuildNpcPageContent');
if(!select||!talk||!pageContent)return;

const assets=window.V38_ASSETS||{};
const relations=()=>window.V38_ensureRelations?.()||{};
const dayNow=()=>Math.floor((Number(rpgState?.worldTurn)||0)/48)+1;

/* Replace the old card selector with character-only presentation. */
select.innerHTML=`
  <div class="guildNpcSelectScene">
    <div class="guildNpcPortraitPick">
      <button class="guildNpcPortraitBtn" type="button" data-guild-npc="rubia" aria-label="루비아와 대화">
        <img src="${assets.warriorHappy||''}" alt="루비아">
      </button>
      <div class="guildNpcPickName">루비아 <small>전사</small></div>
      <div class="rpgGuildNpcDailyNote" id="rubiaDailyNote"></div>
    </div>
    <div class="guildNpcPortraitPick">
      <button class="guildNpcPortraitBtn" type="button" data-guild-npc="kain" aria-label="카인과 대화">
        <img src="${assets.rogueNormal||''}" alt="카인">
      </button>
      <div class="guildNpcPickName">카인 <small>도적</small></div>
      <div class="rpgGuildNpcDailyNote" id="kainDailyNote"></div>
    </div>
  </div>
  <div class="guildNpcSelectHint">대화할 모험가를 선택하세요.</div>`;

/* Replace old talk panel while preserving IDs used by the relationship logic. */
talk.innerHTML=`
  <div class="guildNpcTalkCanvas">
    <div class="rpgNpcRelationRow"><span class="rpgRelationHeart" id="rpgRelationHeart">♥</span><div class="rpgRelationTrack"><i id="rpgRelationFill"></i><em></em></div></div>
    <div class="rpgGuildNpcStage">
      <div class="rpgSpeechBubble rpgGuildNpcSpeech" id="rpgGuildNpcSpeech"></div>
      <div class="guildNpcPortraitStage">
        <img id="rpgGuildNpcArt" class="rpgGuildNpcArt" alt="모험가">
        <img id="rpgGuildNpcArtBlur" class="rpgGuildNpcArtBlur" alt="" aria-hidden="true">
        <div class="guildNpcLowerFade"></div>
        <div class="rpgGuildNpcName" id="rpgGuildNpcName"></div>
      </div>
      <div class="rpgGuildNpcChoices" id="rpgGuildNpcChoices"></div>
      <button type="button" class="guildNpcReturnBtn" id="rpgGuildNpcBackToGuild">‹ 길드로 돌아가기</button>
    </div>
  </div>`;

function syncBlurArt(){const art=$('#rpgGuildNpcArt'),blur=$('#rpgGuildNpcArtBlur');if(art&&blur)blur.src=art.src||''}
const art=$('#rpgGuildNpcArt');
if(art){new MutationObserver(syncBlurArt).observe(art,{attributes:true,attributeFilter:['src']});art.addEventListener('load',syncBlurArt)}

function updateSelectVisual(){
  const rel=relations(),d=dayNow();
  for(const key of ['rubia','kain']){
    const btn=$(`[data-guild-npc="${key}"]`),note=$('#'+key+'DailyNote');
    const done=Number(rel[key]?.lastDay)===d;
    if(btn)btn.disabled=done;
    if(note)note.textContent=done?'오늘은 더 이야기하고 싶지 않은 것 같다.':'';
  }
}
window.V38_updateNpcSelect=updateSelectVisual;

select.querySelectorAll('[data-guild-npc]').forEach(btn=>btn.addEventListener('click',()=>{
  if(btn.disabled)return;
  window.V38_classTalkActive=false;window.V38_startNpcTalk?.(btn.dataset.guildNpc);
  requestAnimationFrame(()=>requestAnimationFrame(syncBlurArt));
}));

$('#rpgGuildNpcBackToGuild')?.addEventListener('click',()=>{
  if(typeof rpgRenderGuild==='function')rpgRenderGuild();
  showPage('rpgGuildPage');
  if(typeof rpgSaveActiveSlot==='function')rpgSaveActiveSlot('rpgGuildPage','guild_npc_return');
});

/* Keep page back behavior consistent with the visible return button. */
const pageBack=$('#rpgGuildNpcPageBack');
if(pageBack){
  const replacement=pageBack.cloneNode(true);
  pageBack.replaceWith(replacement);
  replacement.addEventListener('click',()=>{if(typeof rpgRenderGuild==='function')rpgRenderGuild();showPage('rpgGuildPage')});
}

/* Receptionist click no longer bounces. Existing speech/dialogue behavior remains. */
window.rpgBounceNpc=()=>{};

/* Existing open-page shim calls this function. */
updateSelectVisual();
})();
