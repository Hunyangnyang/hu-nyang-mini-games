
(()=>{
'use strict';

function corrosionStacks4925(target){
  return Math.max(0,Math.min(3,Number(target?._gsCorrosionStacks)||0));
}
function clearCorrosion4925(target){
  if(!target||!corrosionStacks4925(target))return;
  const old=corrosionStacks4925(target);
  target._gsCorrosionStacks=0;
  target._gsCorrosionTurns=0;
  try{rpgLog(`🧪 ${target.name}의 부식 ${old}중첩이 해제되었습니다.`)}catch(_){}
  try{window.gwBattle55PostActionRefresh?.('corrosion_expire')}catch(_){}
}
function consumeCorrosionTurn4925(target){
  if(!target||!corrosionStacks4925(target))return;
  target._gsCorrosionTurns=Math.max(0,(Number(target._gsCorrosionTurns)||1)-1);
  if(target._gsCorrosionTurns<=0)clearCorrosion4925(target);
}

/* Corrosion only modifies physical defense calculation. Magic defense and fixed mechanic damage remain untouched. */
const applyDamage4925=rpgApplyDamage;
rpgApplyDamage=function(target,amount,magic=false){
  const stacks=!magic?corrosionStacks4925(target):0;
  if(!stacks||!target?.derived)return applyDamage4925.apply(this,arguments);
  const derived=target.derived;
  const original=derived.physicalDefense;
  if(!Number.isFinite(Number(original)))return applyDamage4925.apply(this,arguments);
  derived.physicalDefense=Math.max(0,Number(original)*(1-stacks*.10));
  try{
    return applyDamage4925.call(this,target,amount,magic);
  }finally{
    derived.physicalDefense=original;
  }
};

/* Player: one successfully consumed ATB action ends the one-turn corrosion duration. */
const executePlayer4925=rpgExecutePlayerAction;
rpgExecutePlayerAction=function(action){
  const player=rpgState.field?.party?.[0],before=Number(player?.gauge)||0;
  const result=executePlayer4925.apply(this,arguments);
  if(player&&before>=100&&(Number(player.gauge)||0)<100)consumeCorrosionTurn4925(player);
  return result;
};

/* AI party members follow the same ATB-action duration rule. */
const aiAction4925=rpgAiAtbAction;
rpgAiAtbAction=function(ai){
  const before=Number(ai?.gauge)||0;
  const result=aiAction4925.apply(this,arguments);
  if(ai&&before>=100&&(Number(ai.gauge)||0)<100)consumeCorrosionTurn4925(ai);
  return result;
};
window.rpgAiAtbAction=rpgAiAtbAction;

try{
  HuNyangDiag.line('RPG_V4925_READY','giant_basic=corrosion_10pct_def_per_stack_max3_1atb|giant_aoe=maxhp80_div_living|fixed_mechanics=kept|version=4.9.25');
}catch(_){}
})();
