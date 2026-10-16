
(()=>{
'use strict';
const A=window.GW77_ASSETS=Object.freeze({"prayerMain": "assets/images/0069_e9161f9549.webp", "smithMain": "assets/images/0070_f86bc39f41.webp", "smithAction": "assets/images/0071_7c2e951e5a.webp", "prayerAction": "assets/images/0072_0c1b7de822.webp"});
const pick=a=>a[Math.floor(Math.random()*a.length)];
const prayer={
 welcome:['어서 오세요. 작은 빛이라도 지친 몸에는 큰 도움이 된답니다.','오늘도 무사히 돌아오셨군요. 잠시 숨을 고르고 가세요.','상처가 있다면 숨기지 마세요. 이곳에서는 기도도 치료의 일부니까요.'],
 healSuccess:['따뜻한 빛이 상처를 감싸고 있어요. 조금 편해지셨나요?','기도가 닿았네요. 무리하지 말고 천천히 움직이세요.','흐트러진 기운이 조금 바로잡혔어요. 이제 한결 나을 거예요.'],
 healNoNeed:['지금은 치유의 기도가 필요 없어 보여요.','모두 상태가 좋아 보여요. 이 빛은 더 필요한 순간을 위해 남겨둘게요.','상처가 보이지 않네요. 건강할 때 쉬어가는 것도 좋은 일이랍니다.'],
 healNoGold:['치유의 기도에는 4G의 헌금이 필요해요.','헌금이 조금 부족하네요. 준비가 되면 다시 찾아와 주세요.','기도를 위한 성물 준비에 4G가 필요해요. 조금만 더 모아와 주세요.'],
 reviveSuccess:['빛이 다시 숨결을 붙잡았어요. 이제 천천히 일어나세요.','기도가 닿았습니다. 돌아온 동료를 잘 챙겨주세요.','희미했던 생명의 빛이 다시 이어졌어요. 무리한 전투는 피해주세요.'],
 reviveNoNeed:['지금은 부활의 기도가 필요한 분이 없어요.','모두 무사하군요. 그게 가장 좋은 소식이에요.','전투불능인 동료가 없으니 부활의 기도는 필요하지 않아요.'],
 reviveNoGold:['부활 기도는 한 명당 10G의 헌금이 필요해요.','생명의 빛을 되돌리는 기도는 준비가 많이 필요해요. 비용을 확인해 주세요.','헌금이 부족하네요. 전투불능 인원수만큼 10G씩 필요합니다.']
};
const smith={
 welcome:['어서 와! 쓸 만한 재료가 있으면 제대로 벼려줄게.','고철도 손을 좀 보면 쓸모가 생기지. 재련할 게 있으면 꺼내봐.','강화는 운도 필요하지만 준비가 반이야. 강화석부터 잘 챙겨왔지?','장비를 더 단단하게 만들고 싶으면 맡겨. 다만 재료값까지 깎아달라진 마!'],
 refineSuccess:['좋아, 재련 끝! 버릴 뻔한 재료가 제법 쓸 만해졌네.','깔끔하게 나왔어. 재료 보는 눈이 좀 있는데?'],
 refineFail:['이 재료로는 아직 손을 댈 수 없겠는데. 필요한 걸 다시 확인해 봐.','재련은 억지로 한다고 되는 게 아니야. 재료부터 제대로 챙겨와.'],
 enhanceSuccess:['좋아! 제대로 붙었다. 이전보다 확실히 단단해졌어.','불꽃이 예쁘게 튀었지? 이런 날은 망치 맛이 난다니까.','성공! 이 정도면 들고 나가서 자랑해도 되겠는데?'],
 enhanceFail:['이번엔 금속이 버텨냈네. 장비는 멀쩡하니까 너무 인상 쓰진 마.','아깝다. 힘은 제대로 들어갔는데 이번엔 붙지 않았어.','실패했지만 장비는 그대로야. 재료만 다시 준비해서 와.']
};
function speech(id,msg){const e=document.querySelector(id);if(e)e.textContent=msg}
function prayerMain(){const img=document.querySelector('#gwPrayerArt77');if(img)img.src=A.prayerMain}
function smithMain(){const img=document.querySelector('#gwSmithArt75');if(img)img.src=A.smithMain}
window.GW77PrayerReset53=()=>{clearTimeout(prayerTimer);const hero=document.querySelector('.gwPrayerHero77');hero?.classList.remove('praying-heal','praying-revive');prayerMain()};
window.GW77PrayerEnter=()=>{prayerMain();speech('#gwPrayerSpeech77',pick(prayer.welcome))};
window.GW77PrayerSay=(kind)=>{speech('#gwPrayerSpeech77',pick(prayer[kind]||prayer.welcome))};
let prayerTimer=0;
window.GW77PrayerAnimate=(kind)=>{const hero=document.querySelector('.gwPrayerHero77'),img=document.querySelector('#gwPrayerArt77');if(!hero||!img)return;clearTimeout(prayerTimer);hero.classList.remove('praying-heal','praying-revive');img.src=A.prayerAction;void hero.offsetWidth;hero.classList.add(kind==='revive'?'praying-revive':'praying-heal');prayerTimer=setTimeout(()=>{hero.classList.remove('praying-heal','praying-revive');prayerMain()},1200)};
window.GW77SmithSetMain=smithMain;
window.GW77SmithEnter=()=>{const page=document.querySelector('#rpgBlacksmithPage'),app=document.querySelector('#app');if(page&&app&&page.parentElement!==app)app.appendChild(page);smithMain();speech('#gwSmithSpeech77',pick(smith.welcome))};
window.GW77SmithSay=(kind)=>speech('#gwSmithSpeech77',pick(smith[kind]||smith.welcome));
let forgeTimer=0;
window.GW77ForgeAnimate=(item,nextLv)=>{const hero=document.querySelector('.gwSmithHero77'),img=document.querySelector('#gwSmithArt75'),slot=document.querySelector('#gwForgeSlot77');if(!hero||!img)return;clearTimeout(forgeTimer);hero.classList.remove('forging');img.src=A.smithAction;if(slot)slot.textContent=item?.slot==='armor'?'🛡️':'⚔️';void hero.offsetWidth;hero.classList.add('forging');forgeTimer=setTimeout(()=>{hero.classList.remove('forging');if(slot)slot.textContent='';smithMain()},1350)};
// Ensure the dynamically-created blacksmith page lives inside the 430px app container.
const smithPage=document.querySelector('#rpgBlacksmithPage'),app=document.querySelector('#app');if(smithPage&&app&&smithPage.parentElement!==app)app.appendChild(smithPage);
prayerMain();smithMain();
try{HuNyangDiag.line('RPG_V4877_READY','inn=5,7_per_member|prayer=4,10_per_dead|chapel_art=dedicated|smith_art=dedicated|forge_motion=on|choice_reward_name=on')}catch(_){}
})();
