import test from "node:test";
import assert from "node:assert/strict";
import {
  applyTap,
  buyBoosterAction,
  buyShopPerkAction,
  buyStationAction,
  buyUpgradeAction,
  checkAchievements,
  checkAndClaimGoals,
  computePendingEngineers,
  createInitialState,
  getCityEraIndex,
  getCurrentGoalProgress,
  getStationUpgradePreview,
  getTotals,
  STATION_DEFS,
  switchZone,
  tickEconomy,
  triggerPrestige
} from "../src/economy.js";

test("initial state starts in Green Valley with wooden wheel and grand goal", () => {
  const s = createInitialState(0);
  assert.equal(s.activeZoneId, "valley");
  assert.deepEqual(s.unlockedZones, ["valley"]);
  assert.equal(s.stations.wood_wheel.unlocked, true);
  assert.equal(getCurrentGoalProgress(s).goal.targetWatts, 120);
});

test("mining cycles accumulate and emit payouts", () => {
  const s = createInitialState(0);
  let totalPayout = 0;
  for (let i = 0; i < 12; i += 1) {
    for (const p of tickEconomy(s, 0.2)) totalPayout += p.amount;
  }
  assert.ok(totalPayout > 0);
  assert.ok(s.stations.wood_wheel.totalMined > 0);
});

test("shop boosters and crystal perks multiply income", () => {
  const s = createInitialState(0);
  const baseInc = getTotals(s).effectiveIncomePerSec;
  const bRes = buyBoosterAction(s, "turbo_3x", "crystals");
  assert.equal(bRes.ok, true);
  assert.ok(getTotals(s).effectiveIncomePerSec >= baseInc * 2.9);

  s.crystals = 20;
  assert.equal(buyShopPerkAction(s, "gold_blades"), true);
  assert.equal(s.shopPerks.gold_blades, 1);
});

test("reaching 1.8 MW unlocks Zone 2 Glacier with 6x multiplier", () => {
  const s = createInitialState(0);
  s.cash = 1e9;
  s.runCash = 1e9;
  for (const def of STATION_DEFS) {
    buyStationAction(s, def.id, "x1");
    buyStationAction(s, def.id, "x10");
  }
  checkAndClaimGoals(s);
  assert.ok(s.unlockedZones.includes("glacier"));

  const valleyIncome = getTotals(s).baseIncomePerSec;
  assert.equal(switchZone(s, "glacier"), true);
  assert.ok(getTotals(s).baseIncomePerSec > valleyIncome * 5);
});

test("profile taps, achievements, and prestige preserve zones and perks", () => {
  const s = createInitialState(0);
  for (let i = 0; i < 25; i += 1) applyTap(s);
  const achs = checkAchievements(s);
  assert.ok(achs.some((a) => a.id === "ach_tap_25"));

  s.runCash = 100000;
  s.unlockedZones.push("glacier");
  const pending = computePendingEngineers(s);
  assert.ok(pending >= 1);
  triggerPrestige(s);
  assert.ok(s.unlockedZones.includes("glacier"));
  assert.equal(s.profile.totalTaps, 25);
});

test("upgrade preview computes delta income and watts", () => {
  const s = createInitialState(0);
  const preview = getStationUpgradePreview(s, STATION_DEFS[1], 1);
  assert.ok(preview.deltaIncome > 0 && preview.deltaWatts > 0);
  s.cash = 500;
  assert.equal(buyUpgradeAction(s, "riverFlow"), true);
  assert.equal(getCityEraIndex(150), 1);
});
