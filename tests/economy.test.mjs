import test from "node:test";
import assert from "node:assert/strict";
import {
  advanceToNextZone,
  applyTap,
  buyBoosterAction,
  buyShopPerkAction,
  buyStationAction,
  buyUpgradeAction,
  canAdvanceZone,
  checkAchievements,
  checkAndClaimGoals,
  claimQuestReward,
  collectRiverEventReward,
  computePendingEngineers,
  createInitialState,
  getActiveQuest,
  getCurrentGoalProgress,
  getOnboardingUnlocks,
  getTotals,
  getZoneStations,
  getZoneUpgrades,
  resetAllProgress,
  tickEconomy,
  triggerPrestige
} from "../src/economy.js";
import { setLang, t, tStationField, tZoneField } from "../src/i18n.js";

test("initial state starts in Green Valley with valley stations and upgrades", () => {
  const s = createInitialState(0);
  assert.equal(s.activeZoneId, "valley");
  assert.equal(s.stations.s0.unlocked, true);
  assert.equal(getZoneStations("valley")[0].name, "Водяное колесо");
  assert.equal(getCurrentGoalProgress(s).goal.targetWatts, 120);
});

test("reaching 1.8 MW enables transition to Glacier and resets stations/cash cleanly", () => {
  const s = createInitialState(0);
  s.cash = 2e9;
  s.runCash = 2e9;
  for (const def of getZoneStations("valley")) {
    buyStationAction(s, def.id, "x1");
    buyStationAction(s, def.id, "x10");
  }
  buyUpgradeAction(s, "u0");
  assert.ok(s.upgrades.u0 === 1);

  const ready = canAdvanceZone(s);
  assert.ok(ready && ready.id === "glacier");

  const prevCrystals = s.crystals;
  const next = advanceToNextZone(s);
  assert.equal(next.id, "glacier");
  assert.equal(s.activeZoneId, "glacier");
  assert.ok(s.completedZones.includes("valley"));
  // Cash, stations, and local upgrades reset on transition
  assert.equal(s.stations.s1.unlocked, false);
  assert.equal(s.upgrades.u0, 0);
  assert.equal(s.cash, 100 * next.incomeMult);
  // Crystals preserved + bonus awarded
  assert.equal(s.crystals, prevCrystals + next.rewardCrystals);
  // New location has brand-new stations & upgrades
  assert.equal(getZoneStations(s.activeZoneId)[0].name, "Ледовое колесо");
  assert.equal(getZoneUpgrades(s.activeZoneId)[0].name, "Антилёд-подогрев");
});

test("onboarding unlocks gradually and resetAllProgress restores fresh state", () => {
  const s = createInitialState(0);
  let u = getOnboardingUnlocks(s);
  assert.equal(u.upgrades, false);
  assert.equal(u.shop, false);
  assert.equal(u.prestige, false);

  s.cash = 5000;
  s.lifetimeCash = 5000;
  buyStationAction(s, "s1", "x1");
  u = getOnboardingUnlocks(s);
  assert.equal(u.upgrades, true);
  assert.equal(u.shop, true);
  assert.equal(u.prestige, true);

  resetAllProgress(s);
  assert.equal(s.cash, 0);
  assert.equal(s.activeZoneId, "valley");
  assert.equal(s.stations.s1.unlocked, false);
});

test("mining cycles, boosters, perks, achievements, and prestige work", () => {
  const s = createInitialState(0);
  let mined = 0;
  for (let i = 0; i < 12; i += 1) {
    for (const p of tickEconomy(s, 0.2)) mined += p.amount;
  }
  assert.ok(mined > 0);

  const base = getTotals(s).effectiveIncomePerSec;
  assert.equal(buyBoosterAction(s, "turbo_3x", "crystals").ok, true);
  assert.ok(getTotals(s).effectiveIncomePerSec >= base * 2.9);

  s.crystals = 20;
  assert.equal(buyShopPerkAction(s, "gold_blades"), true);

  for (let i = 0; i < 25; i += 1) applyTap(s);
  assert.ok(checkAchievements(s).some((a) => a.id === "ach_tap_25"));

  s.runCash = 100000;
  const pending = computePendingEngineers(s);
  assert.ok(pending >= 1);
  triggerPrestige(s);
  assert.equal(s.engineers, pending);
  assert.equal(s.shopPerks.gold_blades, 1);
  checkAndClaimGoals(s);
});

test("mini-quests advance on taps and river events award cash or crystals", () => {
  const s = createInitialState(0);
  for (let i = 0; i < 15; i += 1) applyTap(s);
  const q = getActiveQuest(s);
  assert.equal(q.ready, true);
  const prevCrystals = s.crystals;
  const claimed = claimQuestReward(s);
  assert.ok(claimed && s.crystals > prevCrystals);

  const droneRes = collectRiverEventReward(s, "drone");
  assert.equal(droneRes.crystals, 2);
  const crateRes = collectRiverEventReward(s, "crate");
  assert.ok(crateRes.cash >= 120);
});

test("i18n switches cleanly between EN and RU across UI and station catalog", () => {
  setLang("en");
  assert.equal(t("tabStations"), "Stations");
  const st0 = getZoneStations("valley")[0];
  assert.equal(tStationField("valley", st0, "name"), "Water Wheel");
  setLang("ru");
  assert.equal(t("tabStations"), "Станции");
  assert.equal(tStationField("valley", st0, "name"), "Водяное колесо");
});
