import {
  advanceToNextZone,
  applyTap,
  buyStationAction,
  buyUpgradeAction,
  canAdvanceZone,
  canTriggerArchitect,
  checkAndClaimGoals,
  createInitialState,
  getBulkStationCost,
  getTotals,
  getUpgradeCost,
  getZoneStations,
  getZoneUpgrades,
  tickEconomy,
  triggerArchitectAscension,
  triggerPrestige
} from "../src/economy.js";

function simulateStrategy(name, tapsPerSec = 0, maxSeconds = 18000) {
  const s = createInitialState(0);
  const dt = 0.25;
  const tapEvery = tapsPerSec > 0 ? 1 / tapsPerSec : Infinity;
  let tapAcc = 0;
  let t = 0;
  const milestones = {};

  while (t < maxSeconds) {
    t += dt;
    if (tapsPerSec > 0) {
      tapAcc += dt;
      while (tapAcc >= tapEvery) {
        tapAcc -= tapEvery;
        applyTap(s, 1.25);
      }
    }
    tickEconomy(s, dt);
    checkAndClaimGoals(s);

    // Greedy cheapest worthwhile buy (new stations first, then best affordable level/upgrade)
    for (const def of getZoneStations(s.activeZoneId)) {
      const st = s.stations[def.id];
      if (!st.unlocked && s.cash >= def.unlockCost) {
        buyStationAction(s, def.id, "x1");
      }
    }
    for (const def of getZoneStations(s.activeZoneId)) {
      const st = s.stations[def.id];
      if (st.unlocked) {
        const cost = getBulkStationCost(def, st.level, 1);
        if (s.cash >= cost) buyStationAction(s, def.id, "x1");
      }
    }
    for (const up of getZoneUpgrades(s.activeZoneId)) {
      const lvl = s.upgrades[up.id] || 0;
      if (lvl < up.maxLevel && s.cash >= getUpgradeCost(up, lvl)) {
        buyUpgradeAction(s, up.id);
      }
    }

    if (canAdvanceZone(s)) {
      milestones[s.activeZoneId] = Math.round(t);
      advanceToNextZone(s);
      continue;
    }
    if (canTriggerArchitect(s)) {
      milestones.cyber = Math.round(t);
      triggerArchitectAscension(s);
      milestones.architects = s.architects;
      break;
    }
  }

  return {
    strategy: name,
    tapsPerSec,
    milestones,
    finalZone: s.activeZoneId,
    watts: Math.round(getTotals(s).totalWatts),
    engineers: s.engineers
  };
}

for (const res of [
  simulateStrategy("Pure Idle", 0, 7200),
  simulateStrategy("Casual (2 tap/s)", 2, 7200),
  simulateStrategy("Active (5 tap/s)", 5, 7200)
]) {
  console.log(JSON.stringify(res));
}
