
(()=>{
  'use strict';
  const defs=(typeof rpgSlimeDefs!=='undefined')?rpgSlimeDefs:null;
  if(defs){
    for(const [id,d] of Object.entries(defs)){
      if(!d||!Number.isFinite(Number(d.hp))||d._hpBalanced4919)continue;
      const before=Number(d.hp)||1;
      d.hp=Math.max(1,Math.round(before*(id==='slimeBoss'?2:1.5)));
      d._hpBalanced4919=true;
    }
  }

  function aiPos4919(ai){
    if(ai===rpgState.ai)return Number(rpgState.formation?.ai);
    if(ai===rpgState.ai2)return Number(rpgState.formation?.ai2);
    return NaN;
  }
  function profile4919(ai){
    const s=ai?.stats||{};
    const melee=(Number(s.str)||1)*1.5+(Number(s.dex)||1)*.6;
    const ranged=(Number(s.str)||1)*.5+(Number(s.dex)||1)*1.6;
    const magic=(Number(s.int)||1)*2.2+(Number(s.luck)||1)*.3;
    return {melee,ranged,magic};
  }
  function bestWeapon4919(ai){
    const p=profile4919(ai),pos=aiPos4919(ai),line=Number.isFinite(pos)?((pos%3)+3)%3:null;
    let best='sword',bestScore=-Infinity;
    for(const [k,d] of Object.entries(rpgWeaponDefs||{})){
      if(k==='seriaTealStaff')continue;
      const ph=d.physical||{};
      let score=p.melee*(Number(ph.melee)||0)+p.ranged*(Number(ph.ranged)||0)+p.magic*(Number(d.magic)||0);
      const range=d.range||'melee';
      if(line===2)score*=range==='melee'?1.18:range==='mid'?1.06:.88;
      else if(line===1)score*=range==='mid'?1.15:1.02;
      else if(line===0)score*=range==='ranged'||range==='magic'?1.18:range==='mid'?1.08:.82;
      score*=1+Math.max(-.5,Math.min(1.2,Number(d.speed)||0))*.025;
      if(score>bestScore){bestScore=score;best=k}
    }
    return best;
  }
  function bestArmor4919(ai){
    const p=profile4919(ai),pos=aiPos4919(ai),line=Number.isFinite(pos)?((pos%3)+3)%3:null;
    if(p.magic>=p.melee&&p.magic>=p.ranged)return 'cloth';
    if(p.ranged>p.melee||line===0)return 'leather';
    return 'plate';
  }
  function cloneWeapon4919(base,ai){
    if(!base)return null;
    const type=bestWeapon4919(ai),d=rpgWeaponDefs?.[type],series=rpgEquipmentSeries?.[base.series];
    return {...base,uid:`ai_${ai===rpgState.ai2?'2':'1'}_${base.uid||'weapon'}_${type}`,weaponType:type,armorType:null,name:`${series?.prefix||String(base.name||'').split(' ')[0]||''} ${d?.name||'무기'}`.trim(),_aiAdaptive4919:true};
  }
  function cloneArmor4919(base,ai){
    if(!base)return null;
    const type=bestArmor4919(ai),d=rpgArmorTypeDefs?.[type],series=rpgEquipmentSeries?.[base.series];
    return {...base,uid:`ai_${ai===rpgState.ai2?'2':'1'}_${base.uid||'armor'}_${type}`,weaponType:null,armorType:type,name:`${series?.prefix||String(base.name||'').split(' ')[0]||''} ${d?.name||type} 갑옷`.trim(),_aiAdaptive4919:true};
  }

  rpgSyncAiEquipment=function(){
    rpgEnsureEquipment(rpgState);
    for(const ai of [rpgState.ai,rpgState.ai2]){
      if(!ai)continue;
      rpgEnsureEquipment(ai);
      ai.equipment={weapon:cloneWeapon4919(rpgState.equipment?.weapon,ai),armor:cloneArmor4919(rpgState.equipment?.armor,ai)};
    }
  };
  rpgSyncAiEquipment();

  const oldEquip4919=rpgEquipItem;
  rpgEquipItem=function(){const v=oldEquip4919.apply(this,arguments);rpgSyncAiEquipment();return v};

  try{
    const hp=defs?Object.fromEntries(Object.entries(defs).map(([k,v])=>[k,v.hp])):{};
    HuNyangDiag.line('RPG_V4919_READY',`quest_recommend=safe_cap|monster_hp=1.5x|giant_hp=${defs?.slimeBoss?.hp||'?'}|devour=50pct|ai_equipment=adaptive|version=4.9.25`);
    HuNyangDiag.line('RPG_MONSTER_HP_4919',JSON.stringify(hp));
  }catch(_){ }
})();
