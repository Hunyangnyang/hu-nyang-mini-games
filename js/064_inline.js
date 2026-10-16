
/* v4.9.40 staff sale warning for irreversible quest reward. */
(()=>{
 const isStaff=i=>!!i&&(i.weaponType==='seriaTealStaff'||i.specialSeriaStaff932);
 const warn=uid=>{const i=(rpgState.inventory||[]).find(x=>x?.uid===uid);return !isStaff(i)||window.confirm('청록의 지팡이는 다시 얻을 수 없는 무기입니다. 정말 판매하시겠습니까?')};
 if(typeof window.rpgSellAnyInventory==='function'){const old=window.rpgSellAnyInventory;window.rpgSellAnyInventory=function(uid){if(!warn(uid))return;return old.apply(this,arguments)}}
 if(typeof window.rpgSellEquipment==='function'){const old=window.rpgSellEquipment;window.rpgSellEquipment=function(uid){if(!warn(uid))return;return old.apply(this,arguments)}}
})();
