
(()=>{
'use strict';
const q=(s,r=document)=>r.querySelector(s);
const page=q('#rpgGuildNpcPage'),scene=q('#rpgGuildNpcPageScene'),select=q('#rpgGuildNpcSelect'),talk=q('#rpgGuildNpcTalk'),choices=q('#rpgGuildNpcChoices'),name=q('#rpgGuildNpcName');
let returnReady=false,choiceCommitted=false;
let hint=q('#guildNpcReturnHint');
if(!hint&&name){hint=document.createElement('div');hint.id='guildNpcReturnHint';hint.className='guildNpcReturnHint';hint.textContent='터치하여 되돌아가기';name.insertAdjacentElement('afterend',hint)}
function hideReturn(){returnReady=false;choiceCommitted=false;page?.classList.remove('return-ready');hint?.classList.remove('show')}
function showReturn(){returnReady=true;page?.classList.add('return-ready');hint?.classList.add('show')}
function returnToSelect(){if(!returnReady)return;hideReturn();if(talk)talk.style.display='none';if(select)select.style.display='';window.V38_updateNpcSelect?.()}
select?.addEventListener('click',hideReturn,true);
choices?.addEventListener('click',e=>{if(!e.target.closest('button'))return;choiceCommitted=true;setTimeout(()=>{if(choiceCommitted&&choices.childElementCount===0&&talk?.style.display!=='none')showReturn()},0)},true);
if(choices)new MutationObserver(()=>{if(choices.childElementCount>0)hideReturn()}).observe(choices,{childList:true});
scene?.addEventListener('click',e=>{if(!returnReady)return;if(e.target.closest('#rpgGuildNpcPageBack'))return;returnToSelect()});
window.addEventListener('pageshow',hideReturn);
})();
