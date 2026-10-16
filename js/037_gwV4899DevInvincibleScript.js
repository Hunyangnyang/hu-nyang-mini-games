/* v4.9.80 public build: preserve compatibility hooks, disable developer options unconditionally. */
(()=>{'use strict';
  for(const key of ['hunyang_dev_invincible_v1','hunyang_test_repeat_quest_v1']){try{localStorage.removeItem(key)}catch(_){}}
  window.HuNyangDevInvincible={enabled:()=>false};
  window.HuNyangRepeatQuestTest={enabled:()=>false};
})();
