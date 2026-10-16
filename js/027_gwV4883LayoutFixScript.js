
(()=>{
 'use strict';
 const ids=['rpgSavePage','rpgVillagePage','rpgStatusPage','rpgCharStatsPage','rpgCharSkillsPage','rpgEquipmentPage','rpgInventoryPage','rpgShopSelectPage','rpgShopPage','rpgGeneralShopPage','rpgGuildPage','rpgPartyStatusPage','rpgInnPage','rpgPrayerPage','rpgNpcPage'];
 function audit83(){
   const rows=ids.map(id=>{const p=document.getElementById(id),a=p?.querySelector('.appbar');if(!p||!a)return id+':missing';const r=a.getBoundingClientRect();return id+':'+Math.round(r.top)+'/'+Math.round(r.height)});
   try{HuNyangDiag.line('RPG_V4883_TITLE_COORDS',rows.join('|'));HuNyangDiag.line('RPG_V4883_READY','titles=field_y0_h76|village_scene=removed|village_menu=pulled_up')}catch(_){}
 }
 setTimeout(audit83,120);
})();
