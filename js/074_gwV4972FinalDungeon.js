(()=>{'use strict';
const $=id=>document.getElementById(id), img=f=>'assets/images/'+f;
const npcNames=['분수대의 소녀','빵집 할머니','농부 로웬','짐꾼 브람'];
const portraits={"rubia":{"annoy":"rubia_annoy4972.png","panic":"rubia_panic4972.png","smirk":"rubia_smirk4972.png","smirk2":"rubia_smirk2_4972.png"},"kain":{"pout":"kain_pout4972.png","panic":"kain_panic4972.png","happy":"kain_happy4972.png","sneer":"kain_sneer4972.png"}};
const names={kain:'카인',rubia:'루비아'};
const dialogue={"rubia":{"pos":[["annoy","아, 왔어?! 진짜 어이가 없다니까!",null],["annoy","길드에서 훈련장을 못 빌려주겠대!","왜? 무슨 일이 있었어?"],["annoy","흥! 훈련하다가 시설 몇 개 부숴먹긴 했지만, 그게 그렇게 큰 잘못이야?!","그럼 못 빌리는 게 당연하잖아!"],["panic","그, 그래도 일부러 그런 건 아니었다구!",null],["annoy","길드가 좀 너그럽게 넘어가 줄 수도 있잖아!","그럼 시험은 어떻게 할 거야?"],["smirk2","흐흥! 그러고 보니 좋은 장소가 하나 있었지!",null],["smirk2","산 근처에 던전이 하나 있거든?",null],["smirk2","지하로 내려가면 버려진 성소라는 넓은 광장이 나온다구!","그런 곳이 있었어?"],["smirk2","거기라면 마음껏 싸우... 아니! 시험 보기 딱 좋지!",null],["smirk2","사람도 거의 없으니까 무슨 일이 생겨도 아무도 모를걸~?","너 지금 시험 핑계로 싸우고 싶은 거지?"],["panic","뭐?! 아, 아니거든?!",null],["annoy","애초에 길드에서 훈련장을 빌려줬으면 이런 일도 없었잖아!","그렇게 위험한 곳에서 해도 괜찮아?"],["annoy","그... 그러게 누가 훈련장을 못 쓰게 하래?!",null],["smirk","아무튼! 재밌는 시험이 될 테니까 던전으로 따라와!","알겠어. 준비하고 갈게!"]],"neg":[["annoy","야! 이제 왔어?! 안 그래도 짜증 나 죽겠는데!",null],["annoy","길드에서 훈련장을 못 쓰게 한대!","네가 또 사고 친 거 아니야?"],["annoy","시설 몇 개 부숴먹은 것뿐이거든?! 시험 준비하다 보면 그럴 수도 있지!","그게 사고 친 거잖아!"],["panic","뭐?! 자, 잘못됐다는 건 아는데...!",null],["annoy","훈련장 좀 쓴다고 안 빌려주는 길드가 더 치사한 거라구!","그래서 시험은 어쩔 건데?"],["smirk2","흐흥! 그 정도로 포기할 줄 알았어?",null],["smirk2","산 근처 던전으로 가면 되거든!",null],["smirk2","지하에 버려진 성소라는 넓은 광장이 있어.","왜 하필 거기야?"],["smirk2","사람도 없고 실컷 붙을... 아니! 시험 보기 딱 좋거든!",null],["smirk2","거기서 뭘 하든 누가 알겠어? 후후!","너, 시험 핑계로 나랑 싸우려는 거지?"],["panic","뭐?! 그, 그런 속셈 아니거든?!",null],["annoy","훈련장을 빌려줬으면 이렇게까지 안 했잖아! 다 길드 때문이야!","거기 정말 안전한 건 맞아?"],["annoy","아, 진짜! 잔소리 좀 그만해!",null],["smirk","따라오기나 해! 이번엔 제대로 시험 볼 테니까!","알겠으니까 먼저 가!"]]},"kain":{"pos":[["pout","...왔네. 길드에서 훈련장 사용을 거절했어.",null],["pout","거기서 시험을 끝내려 했는데. 귀찮아졌네.","왜 못 쓰게 됐어?"],["pout","...전에 훈련 장비 몇 개 망가뜨린 적은 있지.","그럼 거절당할 만하잖아."],["panic","...그렇게까지 따질 일이야?",null],["pout","길드 쪽에서 조금만 이해해 줬어도 됐을 텐데.","그럼 시험은 어떻게 해?"],["happy","...그러고 보니 괜찮은 장소가 하나 있네.",null],["happy","산 근처에 던전이 있어.",null],["happy","지하로 내려가면 버려진 성소라는 넓은 광장이 나오지.","그런 곳이 있었어?"],["sneer","은신도, 회피도 마음껏 시험해 볼 수 있어.",null],["sneer","거기서 무슨 일이 일어나든 아는 사람은 없겠지.","너, 다른 속셈이 있는 거 아니야?"],["panic","...무슨 소리야. 딱히.",null],["pout","길드가 훈련장만 빌려줬어도 이런 일 없었어.","그런 위험한 곳에서 시험 봐도 돼?"],["pout","...걱정은 됐고. 내가 알아서 할게.",null],["sneer","준비됐으면 따라와. ...늦지 말고.","알겠어. 뒤따라갈게."]],"neg":[["pout","...왔냐. 훈련장은 못 써.",null],["pout","길드에서 사용을 막았거든. 귀찮게 됐네.","네가 무슨 사고라도 친 거 아냐?"],["pout","...장비 몇 개 망가뜨린 건 사실이야. 그게 전부고.","그것 때문에 막은 거잖아."],["panic","...쓸데없이 예리하네.",null],["pout","다른 사람들은 멀쩡히 쓰면서. 길드가 유난이야.","그래서 어쩔 거야?"],["happy","...마침 떠오른 곳이 하나 있어.",null],["happy","산 근처 던전 지하. 버려진 성소라는 곳이지.",null],["sneer","주변에 아무도 없고 넓어서 움직이기 좋아.","너 그곳에서 뭘 하려고?"],["sneer","...시험이지. 다른 게 뭐가 있겠어.",null],["sneer","거기서 무슨 일이 생겨도 아무도 모를 테고.","지금 말투가 수상한데?"],["panic","...그런 거 아니거든.",null],["pout","길드에서 훈련장을 내줬으면 이런 수고도 없었겠지.","결국 길드 탓이라는 거야?"],["pout","...그럼 어디 탓을 하겠어. 더 말할 필요 없어.",null],["sneer","던전으로 와. 시험은 봐주지 않을 테니까.","알겠어. 거기서 보자."]]}};
const witness={
 '분수대의 소녀':{kain:['응, 봤어! 카인 오빠라면 아까 마을 근처 훈련장 쪽으로 갔어!','카인? 훈련장 쪽으로 가던데. 되게 급해 보였어.'],rubia:['응! 루비아 언니라면 마을 근처 훈련장으로 갔어! 엄청 씩씩하게 걸어가던데!','루비아? 아까 훈련장 쪽으로 갔어. 성큼성큼 걸어가더라.']},
 '빵집 할머니':{kain:['그 도적 청년 말이냐? 마을 근처 훈련장으로 가는 걸 봤단다.','카인이란 청년 말이지? 훈련장 쪽으로 가더구나.'],rubia:['루비아 아가씨라면 훈련장 방향으로 가는 걸 봤단다.','루비아 말이냐? 훈련장 쪽으로 가더구나.']},
 '농부 로웬':{kain:['카인이라면 조금 전에 훈련장으로 가는 걸 봤습니다.','카인이요? 훈련장 쪽으로 가는 건 봤습니다.'],rubia:['루비아라면 훈련장으로 가는 걸 봤습니다.','루비아요? 훈련장 쪽으로 가더군요.']},
 '짐꾼 브람':{kain:['카인이라면 방금 마을 근처 훈련장으로 가던데요.','카인이요? 훈련장으로 가는 걸 봤습니다.'],rubia:['루비아라면 방금 훈련장 쪽으로 갔습니다.','루비아요? 훈련장으로 갔습니다.']}
};
function quest(){try{const c=rpgState.classQuest;return c&&Number(c.stage)===3&&!c.rewarded&&!c.completed&&names[c.mentor]?c:null}catch(_){return null}}
function progress(){const c=quest();if(!c)return null; if(!c.gwFinal4972)c.gwFinal4972={};return c.gwFinal4972}
function save(tag){try{rpgSaveActiveSlot?.(null,tag)}catch(_){} }
function attitude(k){return Number(window.V38_ensureRelations?.()?.[k]?.affinity||0)<0?'neg':'pos'}
function npcMorning(){try{return ['morning','noon'].includes(rpgWorldPart()?.key)}catch(_){return false}}
function update(){const c=quest(),p=c&&progress();const guild=$('gwTrainingBtn4972');if(guild)guild.hidden=!(p&&p.witnessed);const dungeon=$('gwDungeonBtn4972');if(dungeon)dungeon.classList.toggle('gwGuide4972',!!(p&&p.trainingDone&&!p.dungeonVisited));}
const oldNpc=rpgOpenTownNpc;
rpgOpenTownNpc=function(){oldNpc.apply(this,arguments);const c=quest(),p=c&&progress();const choices=$('gwNpcChoices4972'),hint=$('gwNpcHint4972'),npc=$('rpgNpcName')?.textContent; if(choices)choices.replaceChildren();const active=!!(c&&p&&!p.trainingDone&&npcMorning()&&npcNames.includes(npc));if(hint)hint.textContent='주민을 누르면 라비엔 마을로 돌아갑니다.';if(!active)return;const b=document.createElement('button');b.type='button';const negative=attitude(c.mentor)==='neg';const formal=npc!=='분수대의 소녀';b.textContent=formal?`혹시 ${names[c.mentor]}가 어디로 갔는지 ${negative?'아시나요?':'보셨어요?'}`:`${names[c.mentor]} 어디로 갔는지 ${negative?'봤어?':'알아?'}`;b.addEventListener('click',()=>{const line=witness[npc]?.[c.mentor];$('rpgNpcSpeech').textContent=line?.[negative?1:0]||'마을 훈련장 쪽으로 가는 걸 봤어요.';p.witnessed=true;p.witnessNpc=npc;save('gw_4972_npc_witness');choices.replaceChildren();if(hint)hint.textContent='훈련장 위치를 알아냈다. 모험가 길드로 돌아가 보자.';update()});choices.appendChild(b);};
// The original village click handler captured the previous function reference; intercept the button explicitly.
$('rpgVillageNpcBtn')?.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();rpgOpenTownNpc()},true);
let sceneIndex=0,sceneMentor=null,sceneImageKey='',sceneToken=0,scenePortraitIndex=0;
function portrait(source){
  const art=$('gwTrainingArt4972'),alt=$('gwTrainingArtSwap4975');if(!art||!alt||!source)return;
  if(source===sceneImageKey)return;
  sceneImageKey=source;
  const token=++sceneToken,arr=[art,alt],incoming=arr[1-scenePortraitIndex],outgoing=arr[scenePortraitIndex];
  const url=img(source),pre=new Image();
  pre.onload=()=>{
    if(token!==sceneToken)return;
    incoming.src=url;
    incoming.classList.remove('gwActive4975');
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      if(token!==sceneToken)return;
      incoming.classList.add('gwActive4975');outgoing.classList.remove('gwActive4975');
      scenePortraitIndex=1-scenePortraitIndex;
    }));
  };
  pre.onerror=()=>{if(token===sceneToken)sceneImageKey=''};
  pre.src=url;
}
let textToken=0,autoTalkTimer4976=null;
function cancelAuto4976(){if(autoTalkTimer4976!==null){clearTimeout(autoTalkTimer4976);autoTalkTimer4976=null}}
function advance4976(){cancelAuto4976();const lines=dialogue[sceneMentor]?.[attitude(sceneMentor)];if(!lines)return;if(sceneIndex<lines.length-1){sceneIndex++;step();return}const p=progress();if(p){p.trainingDone=true;save('gw_4976_training_complete')}rpgOpenVillage();update()}
function step(){
  const c=quest();if(!c||!sceneMentor)return;
  const k=sceneMentor,negative=attitude(k),lines=dialogue[k][negative],line=lines[sceneIndex];if(!line)return;
  const [expression,utterance,choice]=line;
  portrait(portraits[k][expression]);
  $('gwTrainingName4972').textContent=names[k];
  const speech=$('gwTrainingSpeech4972'),token=++textToken;
  speech.classList.add('gwTextFading4975');
  setTimeout(()=>{if(token!==textToken)return;speech.textContent=utterance;requestAnimationFrame(()=>speech.classList.remove('gwTextFading4975'))},110);
  const host=$('gwTrainingChoices4972');host.replaceChildren();
  cancelAuto4976();
  if(choice){
    const btn=document.createElement('button');btn.type='button';btn.textContent=choice;
    btn.addEventListener('click',advance4976,{once:true});host.appendChild(btn);
  }else{
    // Allow roughly 3–5 seconds per cut, based on how much text must be read.
    const delay=Math.max(3000,Math.min(5000,3000+utterance.length*43));
    const expectedIndex=sceneIndex,expectedMentor=sceneMentor;
    autoTalkTimer4976=setTimeout(()=>{
      autoTalkTimer4976=null;
      if(activePageId()!=='gwTrainingPage4972'||sceneIndex!==expectedIndex||sceneMentor!==expectedMentor)return;
      advance4976();
    },delay);
  }
}
function openTraining(){
  cancelAuto4976();
  const c=quest(),p=progress();if(!c||!p?.witnessed)return;
  // Once the mentor has departed for the dungeon, training remains accessible,
  // but no NPC portrait, speech, or cutscene is spawned again.
  const locked=!!p.trainingDone;
  const dialog=$('gwTrainingPage4972')?.querySelector('.gwDialogArea4972');
  const notice=$('gwTrainingUnavailable4978');
  if(dialog)dialog.hidden=locked;
  if(notice)notice.hidden=!locked;
  if(locked){
    sceneMentor=null;sceneToken++;textToken++;sceneImageKey='';
    for(const id of ['gwTrainingArt4972','gwTrainingArtSwap4975']){
      const el=$(id);if(el){el.classList.remove('gwActive4975');el.removeAttribute('src')}
    }
    $('gwTrainingSpeech4972').textContent='';
    $('gwTrainingName4972').textContent='';
    $('gwTrainingChoices4972').replaceChildren();
    showPage('gwTrainingPage4972');return;
  }
  sceneMentor=c.mentor;sceneIndex=0;sceneImageKey='';sceneToken++;textToken++;
  const art=$('gwTrainingArt4972'),alt=$('gwTrainingArtSwap4975');
  if(art){art.classList.remove('gwActive4975');art.removeAttribute('src')}
  if(alt){alt.classList.remove('gwActive4975');alt.removeAttribute('src')}
  scenePortraitIndex=1;
  showPage('gwTrainingPage4972');step();
}
function openDungeon(){showPage('gwDungeonPage4972');const host=$('gwDungeonList4972');if(!host)return;host.replaceChildren();const c=quest(),p=c&&progress();if(!(c&&p?.trainingDone)){const x=document.createElement('div');x.className='gwDungeonEmpty4972';x.textContent='이동할 던전이 없습니다.';host.appendChild(x);return;}p.dungeonVisited=true;save('gw_4972_dungeon_open');update();const b=document.createElement('button');b.type='button';b.className='gwDungeonCard4972';const name=document.createElement('b'),title=document.createElement('strong'),desc=document.createElement('small');name.textContent='버려진 성소';title.textContent=(c.mentor==='rubia'?'전사':'도적')+' 전직 최종시험';desc.textContent=names[c.mentor]+'와 함께 최종시험 장소로 이동한다.';b.append(name,title,desc);b.addEventListener('click',()=>showPage('gwSanctumPage4972'));host.appendChild(b)}
$('gwTrainingBtn4972')?.addEventListener('click',openTraining);
$('gwTrainingBack4972')?.addEventListener('click',()=>{cancelAuto4976();showPage('rpgGuildPage')});
$('gwDungeonBtn4972')?.addEventListener('click',openDungeon);
$('gwDungeonBack4972')?.addEventListener('click',rpgOpenVillage);
$('gwSanctumBack4972')?.addEventListener('click',openDungeon);
// Preserve the existing page navigation function, only refresh button visibility on navigation.
const previousShow=showPage;showPage=function(){if(arguments[0]!=='gwTrainingPage4972'&&activePageId()==='gwTrainingPage4972')cancelAuto4976();const result=previousShow.apply(this,arguments);update();return result};
update();try{HuNyangDiag.line('RPG_FINAL_DUNGEON_4972','ready|training|witness|dungeon')}catch(_){}
})();
