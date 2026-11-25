import test from "node:test";
import assert from "node:assert/strict";
import {
  applyTap,
  buyStationAction,
  buyUpgradeAction,
  checkAndClaimGoals,
  computePendingEngineers,
  createInitialState,
  getCityEraIndex,
  getCurrentGoalProgress,
  getStationUpgradePreview,
  getTotals,
  STATION_DEFS,
  tickEconomy,
  triggerPrestige
} from "../src/economy.js";

test("initial state starts with wooden wheel unlocked and active grand goal", () => {
  const s = createInitialState(0);
  assert.equal(s.stations.wood_wheel.unlocked, true);
  assert.equal(s.stations.wood_wheel.level, 1);
  assert.equal(s.stations.twin_paddle.unlocked, false);
  const goal = getCurrentGoalProgress(s);
  assert.equal(goal.index, 0);
  assert.equal(goal.goal.targetWatts, 120);
});

test("mining cycles accumulate and emit payouts on completion", () => {
  const s = createInitialState(0);
  let totalPayout = 0;
  for (let i = 0; i < 12; i += 1) {
    const payouts = tickEconomy(s, 0.2);
    for (const p of payouts) totalPayout += p.amount;
  }
  assert.ok(totalPayout > 0, "Expected at least one mining cycle payout");
  assert.ok(s.stations.wood_wheel.totalMined > 0);
});

test("tapping increases cash and overdrive multiplier", () => {
  const s = createInitialState(0);
  const before = s.cash;
  const gained = applyTap(s);
  assert.ok(gained >= 1);
  assert.equal(s.cash, before + gained);
  assert.ok(s.overdrive > 0);
  assert.ok(getTotals(s).overdriveMult > 1);
});

test("upgrade preview, station purchases, and grand goal rewards work", () => {
  const s = createInitialState(0);
  s.cash = 100000;
  s.runCash = 100000;

  const preview = getStationUpgradePreview(s, STATION_DEFS[1], 1);
  assert.ok(preview.deltaIncome > 0 && preview.deltaWatts > 0);

  assert.equal(buyStationAction(s, "twin_paddle", "x1"), true);
  assert.equal(buyStationAction(s, "wood_wheel", "x10"), true);
  assert.equal(buyUpgradeAction(s, "riverFlow"), true);

  const claimed = checkAndClaimGoals(s);
  assert.ok(claimed.length >= 1);
  assert.ok(getCityEraIndex(getTotals(s).totalWatts) >= 1);
});

test("prestige resets run and awards permanent engineers", () => {
  const s = createInitialState(0);
  s.runCash = 100000;
  const pending = computePendingEngineers(s);
  assert.ok(pending >= 1);
  const gained = triggerPrestige(s);
  assert.equal(gained, pending);
  assert.equal(s.engineers, pending);
  assert.equal(s.stations.twin_paddle.unlocked, false);
});
