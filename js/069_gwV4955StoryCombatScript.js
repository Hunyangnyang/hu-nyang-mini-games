(()=>{'use strict';
const q=s=>document.querySelector(s);const BTN='gwSeriaPriest54';
const flags=()=>{const f=rpgState.priestLead55||(rpgState.priestLead55={status:'unknown',history:[]});if(f.status==='blocked')f.status='pending';if(f.status==='unlocked')f.seriaRecommended=true;return f};
const completed=()=>{const a=rpgState.completedQuestIds||[];return a.includes('f_boss_slime')&&a.includes('f_boss_wolf')};
function persist(){try{rpgSaveActiveSlot('rpgPriestStory55','priest_route55')}catch(_){} }
const nodes={
 start:{text:`세리아: 거대 슬라임에 이어 늑대왕까지 맞서셨다면서요.
그렇게 위험한 전투를 거듭하시다 보니... 혹시 사제의 길에도 관심이 생기셨나요?`,choices:[['네, 누군가를 지키는 힘을 배우고 싶어요.','yes'],['아직 잘 모르겠어요. 어떤 길인지 궁금하네요.','neutral'],['아뇨, 관심 없어요.','no']]},
 yes:{text:`세리아: 누군가를 지키고 싶다는 마음이군요. 사제에게 필요한 건 치유 마법만이 아니랍니다.
때로는 위험 앞에 선 사람들을 안심시키고, 스스로 먼저 손을 내미는 용기도 필요해요.`,choices:[['사제는 어떤 일을 하나요?','virtue'],['그런 힘은 어디에서 배울 수 있나요?','townLead']]},
 neutral:{text:`세리아: 고민하는 건 당연해요. 사제라고 해서 모두 같은 모습으로 살아가지는 않거든요.
먼저 사제가 어떤 길을 걷는지 알려 드릴까요?`,choices:[['네, 사제의 역할이 궁금해요.','virtue'],['그 길을 배울 수 있는 곳도 있나요?','townLead'],['아직은 그만둘게요.','delay']]},
 no:{text:`세리아: 아, 관심 없으신가 보네요. 억지로 권하고 싶지는 않아요.
사제의 길은 스스로 원할 때 비로소 시작되는 거니까요.`,choices:[['그래도 어떤 길인지 들어볼게요.','virtue'],['지금은 관심 없어요.','reject']]},
 virtue:{text:`세리아: 사제는 다친 사람을 치유하고, 두려운 이들을 위로하며, 동료를 지키기 위해 힘을 쓰기도 해요.
사람들의 일상과 희망을 지키는 것도 그 중요한 역할이죠.`,choices:[['그런 가르침은 어디서 배울 수 있나요?','townLead'],['사제가 필요한 마을이 있나요?','townLead'],['조금 더 생각해 볼게요.','delay']]},
 townLead:{text:`세리아: 라비엔에서 멀리 떨어진 벨모른이라는 마을을 들어 보셨나요?
사제의 도움이 절실한 곳이라고 해요. 그 마을 이야기를 들려드려도 될까요?`,choices:[['벨모른은 어떤 마을인가요?','town'],['네, 자세히 들려주세요.','town'],['나중에 듣겠습니다.','delay']]},
 town:{text:`세리아: 벨모른은 평범한 사람들이 서로 도우며 살아가는 마을이에요.
하지만 오래된 공동묘지와 붉은 달에 관한 소문 때문에 밤이면 조금 스산해진다고 해요.`,picture:true,pictureLabel:'벨모른 · 붉은 달의 마을',choices:[['붉은 달에는 어떤 사연이 있나요?','moon'],['공동묘지에는 무슨 일이 있나요?','cemetery'],['그곳 사람들은 괜찮나요?','people']]},
 moon:{text:`세리아: 벨모른의 붉은 달은 오래전부터 여러 전설을 낳았대요.
달이 유난히 붉게 뜨는 밤에는 사람들이 공동묘지 근처를 피한다고 해요.`,picture:true,pictureLabel:'벨모른 · 붉은 달의 전설',choices:[['묘지에서 무엇을 목격했나요?','cemetery'],['마을을 지키는 사람은 없나요?','people'],['그 마을에는 어떤 사제가 있나요?','priest']]},
 cemetery:{text:`세리아: 오래된 묘지와 버려진 예배당 주변에서 밤마다 낯선 발소리가 들린다고 해요.
누군가는 죽은 자들이 움직이는 모습을 봤다고도 하고요.`,picture:true,pictureLabel:'벨모른 · 공동묘지의 소문',choices:[['설마 언데드가 나타나는 건가요?','undead'],['사람들이 위험하겠어요.','people'],['그곳을 지키는 사제는 없나요?','priest']]},
 people:{text:`세리아: 마을 사람들은 두려워하면서도 서로를 돌보며 살아가고 있어요.
그래서 그곳에는 상처를 치유하고, 밤의 위험으로부터 사람들을 지킬 사제가 필요하답니다.`,choices:[['위험의 정체가 궁금해요.','cemetery'],['그곳의 사제 이야기를 듣고 싶어요.','priest']]},
 undead:{text:`세리아: 네, 벨모른에서는 언데드가 나타난다는 소문이 돌아요. 제가 직접 본 것은 아니니 단정할 순 없지만요.
사제의 치유와 정화의 힘은 그런 위험에 맞서는 데 도움이 될 수 있어요.`,choices:[['정화는 어떻게 도움이 되나요?','purification'],['벨모른에는 사제가 있나요?','priest'],['조심해서 살펴봐야겠네요.','danger']]},
 purification:{text:`세리아: 정화는 부정한 기운에 맞서고 동료를 보호하는 일이에요.
다만 모든 언데드에게 같은 방법이 통하는 건 아니니, 현장에서 신중히 판단해야 해요.`,choices:[['그 힘을 가르치는 분이 있나요?','priest'],['벨모른에서 배울 수 있을까요?','priest']]},
 danger:{text:`세리아: 맞아요. 밤에 공동묘지에 다가간다면 등불과 마음의 준비를 잊지 마세요.
그곳에는 마을을 지키는 사제님이 한 분 계시니 먼저 찾아뵙는 편이 좋겠어요.`,choices:[['그 사제님에 대해 알려주세요.','priest'],['그곳 사람들은 괜찮을까요?','people']]},
 priest:{text:`세리아: 벨모른에는 아주 유명한 사제님이 한 분 계세요.
실력은 누구나 인정하지만, 정말 장난기가 많으시답니다. 위험할 때만큼은 누구보다 든든하다는 소문도 있어요.`,picture:true,pictureLabel:'벨모른 · 이름난 사제의 소문',choices:[['그분에게 배워 보고 싶어요.','test'],['정말 훌륭한 사제인가요?','fame'],['장난이라니 조금 걱정되네요.','worry']]},
 fame:{text:`세리아: 위험한 밤에 마을을 지켜 냈다는 이야기가 특히 유명해요.
본인께 여쭤보면 엉뚱한 농담부터 하실지도 모르지만요.`,choices:[['그분을 찾아가고 싶어요.','test'],['조금 더 고민할게요.','delay']]},
 worry:{text:`세리아: 장난스럽다고 해서 사람의 아픔을 가볍게 여기시는 분은 아니라고 해요.
오히려 어려운 순간에도 상대가 웃을 수 있게 하려는 건지도 모르죠.`,choices:[['한번 만나보고 싶네요.','test'],['좀 더 생각해 볼래요.','delay']]},
 test:{text:`세리아: 벨모른에 도착하시면 그 사제님을 찾아보세요.
제 이야기를 전해 드렸다고 말씀하셔도 좋아요. 하지만 그분은 분명 말보다 행동을 보고 판단하실 거예요.`,choices:[['벨모른에서 사제의 길을 알아볼게요.','accept'],['먼저 준비할 시간을 가질게요.','delay']]},
 accept:{text:`세리아: 언젠가 벨모른에서 새로운 길을 만나시길 기도할게요.
당신의 선택이 누군가에게 희망이 되기를.`,end:'unlocked'},
 reject:{text:`세리아: 알겠어요. 그렇다면 사제 전직에 관한 이야기는 여기까지 할게요.
마음이 달라지면, 언제든 다시 들러 주세요.`,end:'pending'},
 delay:{text:`세리아: 서두르지 마세요. 긴 여행에는 생각할 시간도 필요하니까요.
궁금해지면 다시 찾아오세요.`,end:'pending'}
};
function exit(){showPage('rpgSeriaDialoguePage')}
function applyChoiceLayout(host,buttons){host.dataset.count=String(buttons.length);buttons.forEach((b,i)=>{b.classList.remove('gwChoiceTop64','gwChoiceLeft64','gwChoiceRight64','gwChoiceFull64','gwChoiceWideTop64');if(buttons.length===1){b.classList.add('gwChoiceFull64');return;}if(buttons.length===2){b.classList.add(i===0?'gwChoiceLeft64':'gwChoiceRight64');return;}if(buttons.length>=3){b.classList.add(i===0?'gwChoiceTop64':i===1?'gwChoiceLeft64':'gwChoiceRight64');}})}
function syncVisuals(node){const page=q('#rpgPriestStory55'),prayer=q('#rpgPrayerPage'),portrait=q('#gwPriestPortrait55'),badge=q('#gwPriestSceneBadge55');if(portrait)portrait.src=q('#gwSeriaDialogueArt933')?.src||q('#gwPrayerArt77')?.src||'';if(page&&prayer){const chapel=prayer.style.backgroundImage||getComputedStyle(prayer).backgroundImage;page.style.backgroundImage=chapel;}if(badge)badge.textContent=(node&&node.pictureLabel)||((node&&node.picture)?'벨모른 · 세리아의 이야기':'라비엔 기도원 · 세리아의 이야기');}
// v4.9.74: one Belmorne establishing shot per *story visit*, not permanently per save.
let belmorneViewing70=false;
let belmorneSeenThisVisit4974=false;
function closeBelmorne70(){
  const fg=q('#gwBelmorneForeground70'),page=q('#rpgPriestStory55');
  if(fg)fg.hidden=true;
  if(page)page.classList.remove('gwBelmorneViewing70');
  belmorneViewing70=false;
}
function showBelmorne70(node,key){
  const fg=q('#gwBelmorneForeground70'),page=q('#rpgPriestStory55');
  const caption=q('#gwBelmorneCaption70'),host=q('#gwBelmorneChoices4974');
  if(key!=='town'||belmorneSeenThisVisit4974||!fg||!page||!host){closeBelmorne70();return false}
  belmorneSeenThisVisit4974=true;
  if(caption)caption.textContent=String(node.text||'').replace(/^\s*세리아\s*:\s*/,'');
  host.replaceChildren();
  for(const [label,next] of node.choices||[]){
    const btn=document.createElement('button');btn.type='button';btn.textContent=label;
    btn.addEventListener('click',e=>{e.stopPropagation();closeBelmorne70();render(next)});
    host.appendChild(btn);
  }
  fg.hidden=false;page.classList.add('gwBelmorneViewing70');
  belmorneViewing70=true;return true;
}
function giveRecommendation4974(){
  const f=flags();if(!f.seriaRecommended)return false;
  const found=(rpgState.inventory||[]).some(i=>i?.specialSeriaLetter4974);
  if(found){f.recommendationGranted4974=true;return true}
  if(f.recommendationGranted4974)return true;
  if(!Array.isArray(rpgState.inventory))rpgState.inventory=[];
  if(rpgState.inventory.length>=40){f.recommendationPending4974=true;return false}
  rpgState.inventory.push({uid:'seria_letter_4974_'+Date.now(),name:'세리아의 추천서',rarity:'퀘스트',source:'quest',slot:null,price:0,noSell:true,noDismantle:true,specialSeriaLetter4974:true,desc:'라비엔 기도원의 세리아가 벨모른의 사제에게 전해 달라며 써 준 추천서. 판매 및 분해 불가.'});
  f.recommendationPending4974=false;f.recommendationGranted4974=true;
  try{rpgSaveActiveSlot?.(null,'seria_recommendation_4974')}catch(_){}
  try{toast?.('세리아의 추천서를 획득했습니다.')}catch(_){}
  return true;
}
function render(key){
  const n=nodes[key]||nodes.start,f=flags();
  f.history.push(key);if(f.history.length>70)f.history.shift();
  const text=q('#gwPriestText55'),choices=q('#gwPriestChoices55');if(!text||!choices)return;
  text.textContent=n.text;syncVisuals(n);
  const intro=showBelmorne70(n,key);
  choices.hidden=!!intro;choices.replaceChildren();
  const btns=[];
  for(const [label,next] of n.choices||[]){
    const b=document.createElement('button');b.type='button';b.textContent=label;
    b.onclick=()=>render(next);choices.appendChild(b);btns.push(b);
  }
  if(n.end){
    f.status=n.end;
    if(n.end==='unlocked'){
      f.seriaRecommended=true;
      if(!giveRecommendation4974())try{toast?.('인벤토리가 가득 찼어요. 자리를 비운 뒤 세리아에게 다시 찾아와 주세요.')}catch(_){}
    }
    persist();
    const b=document.createElement('button');b.type='button';
    b.textContent=n.end==='unlocked'?'이야기를 마친다':'돌아가기';
    b.onclick=exit;choices.appendChild(b);btns.push(b);
  }
  applyChoiceLayout(choices,btns);
}
function start(){if(!completed()||flags().seriaRecommended)return;belmorneSeenThisVisit4974=false;closeBelmorne70();showPage('rpgPriestStory55');render('start');persist()}
function syncBtn(){const host=q('#rpgSeriaDialoguePage .gwSeriaTriangle933');if(!host)return;let btn=q('#'+BTN);if(!btn){btn=document.createElement('button');btn.id=BTN;btn.type='button';btn.innerHTML='<strong>✦</strong><span>사제에 대하여</span>';btn.onclick=start;host.appendChild(btn)}const f=flags();if(f.seriaRecommended)giveRecommendation4974();btn.style.display=(completed()&&!f.seriaRecommended)?'':'none';if(completed()&&!f.seriaRecommended)host.classList.remove('noQuest')}
const show0=showPage;showPage=function(id){const result=show0.apply(this,arguments);if(id==='rpgSeriaDialoguePage')syncBtn();return result};q('#gwPriestStoryBack55')?.addEventListener('click',exit);syncBtn();
const legend=q('#rpgFormationPage .rpgFormationLegend');if(legend){const old=q('.gwPositionHelp54',legend);if(old)old.replaceWith(old.cloneNode(true));const b=q('.gwPositionHelp54',legend);if(b){b.textContent='포지션 안내 ?';b.setAttribute('aria-label','포지션 전투 안내');b.onclick=()=>{const backdrop=document.createElement('div');backdrop.className='gwGuideBackdrop55';const card=document.createElement('div');card.className='gwGuideCard55';backdrop.appendChild(card);let page=0;const pages=[`<h3>포지션 공격 가이드</h3><p>근거리 공격은 포지션에 따라 피해량이 달라집니다.</p><table><tr><th>위치</th><th>근거리</th><th>원거리</th><th>마법</th></tr><tr><td>전열</td><td>110%</td><td>100%</td><td>100%</td></tr><tr><td>중앙</td><td>90%</td><td>100%</td><td>100%</td></tr><tr><td>후열</td><td>70%</td><td>100%</td><td>100%</td></tr></table>`,`<h3>적의 공격 대상</h3><p>일반 적의 기본 공격은 다음 확률로 공격 대상을 선택해요.</p><table><tr><th>위치</th><th>선택 확률</th></tr><tr><td>전열</td><td>80%</td></tr><tr><td>중앙</td><td>15%</td></tr><tr><td>후열</td><td>5%</td></tr></table><p>대형 보스에게는 거리로 인한 근거리 피해 페널티가 적용되지 않습니다.</p>`];function draw(){card.innerHTML=pages[page];const btn=document.createElement('button');btn.textContent=page===pages.length-1?'닫기':'다음';btn.onclick=()=>page===pages.length-1?backdrop.remove():(page++,draw());card.appendChild(btn)}draw();backdrop.onclick=e=>{if(e.target===backdrop)backdrop.remove()};document.body.appendChild(backdrop)}}}
try{HuNyangDiag.line('RPG_V4965_STORY_READY','priest_story=speech_bubble_triangle|formation_help=full_row_label')}catch(_){ }
})();
