import test from "node:test";
import assert from "node:assert/strict";
import {
  applyTap,
  buyStationAction,
  buyUpgradeAction,
  computePendingEngineers,
  createInitialState,
  getCityEraIndex,
  getTotals,
  tickEconomy,
  triggerPrestige
} from "../src/economy.js";

test("initial state starts with wooden wheel unlocked at level 1", () => {
  const s = createInitialState(0);
  assert.equal(s.stations.wood_wheel.unlocked, true);
  assert.equal(s.stations.wood_wheel.level, 1);
  assert.equal(s.stations.twin_paddle.unlocked, false);
  const totals = getTotals(s);
  assert.ok(totals.effectiveIncomePerSec > 0);
  assert.equal(getCityEraIndex(totals.totalWatts), 0);
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

test("buying stations, upgrades, and city eras scale properly", () => {
  const s = createInitialState(0);
  s.cash = 100000;
  s.runCash = 100000;
  assert.equal(buyStationAction(s, "twin_paddle", "x1"), true);
  assert.equal(s.stations.twin_paddle.unlocked, true);
  assert.equal(buyStationAction(s, "wood_wheel", "x10"), true);
  assert.equal(s.stations.wood_wheel.level, 11);
  assert.equal(buyUpgradeAction(s, "riverFlow"), true);
  assert.equal(s.upgrades.riverFlow, 1);

  tickEconomy(s, 0.2);
  const totals = getTotals(s);
  assert.ok(totals.totalWatts > 120);
  assert.ok(getCityEraIndex(totals.totalWatts) >= 1);
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
