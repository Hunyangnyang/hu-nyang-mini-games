
(()=>{
const MALE='assets/images/0101_63770dae1b.png',FEMALE='assets/images/0102_e10caa4109.png';
function genderOf(u){return u?.gender||(u?.id==='player'?rpgState?.gender:(u?.id==='ai2'?rpgState?.ai2?.gender:rpgState?.ai?.gender))||'남성'}
function artOf(u){return genderOf(u)==='여성'?FEMALE:MALE}
function ensure(){
  const stage=document.querySelector('#rpgBattleStage');if(!stage)return null;
  let cine=stage.querySelector('.gwChainCine4926');
  if(!cine){
    cine=document.createElement('div');cine.className='gwChainCine4926';cine.innerHTML='<div class="dim"></div><div class="title">연계 공격!</div><div class="portrait left"></div><div class="portrait leader"></div><div class="portrait right"></div>';stage.appendChild(cine);
  }
  let s1=stage.querySelector('.gwChainSlash4926.one');if(!s1){s1=document.createElement('div');s1.className='gwChainSlash4926 one';stage.appendChild(s1)}
  let s2=stage.querySelector('.gwChainSlash4926.two');if(!s2){s2=document.createElement('div');s2.className='gwChainSlash4926 two';stage.appendChild(s2)}
  let sh=stage.querySelector('.gwChainShield4926');if(!sh){sh=document.createElement('div');sh.className='gwChainShield4926';stage.appendChild(sh)}
  return {stage,cine,s1,s2,sh};
}
function resetChain53(){const s=document.querySelector('#rpgBattleStage');if(!s)return;s.querySelectorAll('.gwChainCine4926,.gwChainSlash4926,.gwChainShield4926').forEach(el=>{el.classList.remove('active','show');el.style.animation='none';void el.offsetWidth;el.style.animation='';});}
window.GWResetChain53=resetChain53;
function retrigger(el,cls){el.classList.remove(cls);void el.offsetWidth;el.classList.add(cls)}
function bossPoint(stage,index){const el=stage.querySelector(`#rpgBattleUnits [data-battle-enemy="${index}"]`),sr=stage.getBoundingClientRect();if(!el)return {x:sr.width*.72,y:sr.height*.42};const r=el.getBoundingClientRect();return {x:r.left-sr.left+r.width/2,y:r.top-sr.top+r.height/2}}
function shieldGeom(stage,living){const sr=stage.getBoundingClientRect(),els=living.map(u=>stage.querySelector(`#rpgBattleUnits [data-party-unit="${u.id}"]`)).filter(Boolean);if(!els.length)return {x:sr.width*.34,y:sr.height*.62,w:Math.min(sr.width*.78,320)};const rs=els.map(e=>e.getBoundingClientRect()),l=Math.min(...rs.map(r=>r.left)),r=Math.max(...rs.map(r=>r.right)),t=Math.min(...rs.map(r=>r.top)),b=Math.max(...rs.map(r=>r.bottom));return {x:(l+r)/2-sr.left,y:(t+b)/2-sr.top,w:Math.min(sr.width*.82,Math.max(300,(r-l)*1.62))}}
function setPortrait(el,u){if(!el)return;el.style.backgroundImage=u?`url("${artOf(u)}")`:'none';el.style.display=u?'block':'none'}
window.gwPlayChainCinematic4926=function(kind,living,bossIndex,done){
  const ui=ensure();if(!ui){done?.();return false}resetChain53();
  const party=(rpgState.field?.party||[]).filter(u=>!u.dead),leader=party[0]||living?.[0],others=party.filter(u=>u!==leader).slice(0,2);
  const left=others[0]||null,right=others[1]||null;
  const title=ui.cine.querySelector('.title');title.textContent=kind==='defense'?'연계 방어!':'연계 공격!';ui.cine.classList.toggle('defense',kind==='defense');
  setPortrait(ui.cine.querySelector('.portrait.left'),left);setPortrait(ui.cine.querySelector('.portrait.leader'),leader);setPortrait(ui.cine.querySelector('.portrait.right'),right);
  ui.cine.classList.remove('active');void ui.cine.offsetWidth;ui.cine.classList.add('active');
  try{HuNyangDiag.line('RPG_CHAIN_CINE_4926',`${kind}|party=${living?.length||0}`)}catch(_){}
  setTimeout(()=>{
    ui.cine.classList.remove('active');
    if(kind==='attack'){const p=bossPoint(ui.stage,bossIndex);ui.stage.style.setProperty('--gw-chain-x',p.x+'px');ui.stage.style.setProperty('--gw-chain-y',p.y+'px');retrigger(ui.s1,'show');setTimeout(()=>retrigger(ui.s2,'show'),130)}
    else{const g=shieldGeom(ui.stage,living||[]);ui.stage.style.setProperty('--gw-shield-x',g.x+'px');ui.stage.style.setProperty('--gw-shield-y',g.y+'px');ui.stage.style.setProperty('--gw-shield-w',g.w+'px');retrigger(ui.sh,'show')}
    try{done?.()}catch(err){console.error(err)}
  },820);
  return true;
};
try{HuNyangDiag.line('RPG_V4926_READY','chain_cinematic=shared_attack_defense|attack_fx=double_slash|defense_fx=large_shield|mechanics=preserved|version=4.9.28')}catch(_){}
})();
