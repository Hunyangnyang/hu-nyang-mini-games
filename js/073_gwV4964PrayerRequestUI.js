(()=>{'use strict';
const q=s=>document.querySelector(s);
let stage=0;
function goBack(){showPage('rpgSeriaDialoguePage')}
function mission(){return typeof window.gwSeriaBossMission933==='function'?window.gwSeriaBossMission933():null}
function applyChoiceLayout(host,buttons){host.dataset.count=String(buttons.length);buttons.forEach((b,i)=>{b.classList.remove('gwChoiceTop64','gwChoiceLeft64','gwChoiceRight64','gwChoiceFull64','gwChoiceWideTop64');if(buttons.length===1){b.classList.add('gwChoiceFull64');return;}if(buttons.length===2){b.classList.add(i===0?'gwChoiceLeft64':'gwChoiceRight64');return;}if(buttons.length>=3){b.classList.add(i===0?'gwChoiceTop64':i===1?'gwChoiceLeft64':'gwChoiceRight64');}})}
function draw(text,choices){const speech=q('#gwSeriaRequestSpeech64'),host=q('#gwSeriaRequestChoices64');if(!speech||!host)return;speech.textContent=text;host.replaceChildren();const buttons=choices.map(([label,fn])=>{const b=document.createElement('button');b.type='button';b.className='gwSeriaChoiceBtn64';b.textContent=label;b.addEventListener('click',fn);host.appendChild(b);return b;});applyChoiceLayout(host,buttons)}
function intro(){stage=0;const boss=mission();if(rpgState.seriaStaffReceived932){draw('당신에게 맡긴 청록의 지팡이가 부디 힘이 되어 주길 바라요.',[['지팡이를 소중히 간직할게요.',goBack],['이야기를 마치겠습니다.',goBack]]);return}
if(!boss){draw('아직 부탁드릴 일이 없어요. 다치지 않고 돌아와 주시는 것만으로도 충분해요.',[['알겠습니다. 감사합니다.',goBack]]);return}
draw(`${rpgState.name||'모험가'}님, 어느새 이렇게 성장하셨군요. 제가 작은 부탁을 드려도 될까요?`,[['무슨 부탁인가요?',()=>next(1)],['도울 수 있다면 돕겠습니다.',()=>next(1)],['잠시 뒤에 듣겠습니다.',goBack]])}
function next(n){stage=n;const boss=mission()||'강력한 적';if(n===1){draw(`이번에 ${boss} 토벌에 나서신다고 들었어요. 위험한 길이니, 이 기도원에서 소중히 간직해 온 물건을 맡기고 싶어요.`,[['어떤 물건인가요?',()=>next(2)],['걱정해 주셔서 감사합니다.',()=>next(2)],['아직 준비가 필요해요.',goBack]]);return}if(n===2){draw('제가 사제가 되기 전에 사용하던 청록의 지팡이예요. 상처 입은 동료를 치유하는 데 도움이 될 거예요. 받아 주시겠어요?', [['감사히 받겠습니다.',receive],['이렇게 귀한 물건을 주셔도 되나요?',()=>next(3)],['조금 더 생각해 볼게요.',goBack]]);return}draw('네, 저보다 당신에게 더 필요한 물건이라고 생각해요. 무사히 돌아오신다면 그걸로 충분합니다.',[['세리아의 마음과 함께 받겠습니다.',receive],['잠시 후에 다시 오겠습니다.',goBack]])}
function receive(){if(!mission()||rpgState.seriaStaffReceived932){intro();return}if((rpgState.inventory||[]).length>=40){draw('가방이 가득 찼군요. 물건을 정리하고 다시 와 주세요.',[['알겠습니다. 다시 올게요.',goBack]]);return}
let ok=false;try{ok=window.gwSeriaGrantStaff64?.()===true}catch(e){try{HuNyangDiag.line('RPG_SERIA_REQUEST_ERROR_4964',String(e))}catch(_){} }
if(ok){draw('청록의 지팡이가 여러분을 지켜 주길 바라요. 부디 무사히 돌아오세요.',[['반드시 돌아오겠습니다.',goBack],['정말 고마워요, 세리아.',goBack]]);try{rpgSaveActiveSlot?.('rpgSeriaRequest64','seria_request_complete_4964')}catch(_){} }
else draw('지팡이를 전달하지 못했어요. 가방을 확인하고 다시 시도해 주세요.',[['다시 시도하기',receive],['돌아가기',goBack]])}
function open(){const img=q('#gwSeriaRequestPortrait64');if(img)img.src=q('#gwSeriaDialogueArt933')?.src||q('#gwPrayerArt77')?.src||'';const p=q('#rpgPrayerPage'),page=q('#rpgSeriaRequest64');if(p&&page)page.style.backgroundImage=p.style.backgroundImage||getComputedStyle(p).backgroundImage;showPage('rpgSeriaRequest64');intro()}
q('#gwSeriaQuestBtn933')?.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();open()},true);
q('#gwSeriaRequestBack64')?.addEventListener('click',goBack);
try{HuNyangDiag.line('RPG_V4965_READY','seria_request=speech_bubble_triangle|priest_story=art_bg_triangle|formation_help=full_row')}catch(_){}
})();