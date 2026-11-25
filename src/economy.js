export const SAVE_KEY = "water_power_3d_save_v3";

export const ZONES = [
  {
    id: "valley",
    index: 0,
    name: "Зелёная долина",
    icon: "🌿",
    unlockWatts: 0,
    incomeMult: 1,
    rewardCrystals: 0,
    desc: "Стартовый каньон и растущий эко-город"
  },
  {
    id: "glacier",
    index: 1,
    name: "Снежные вершины",
    icon: "❄️",
    unlockWatts: 1800000,
    incomeMult: 6,
    rewardCrystals: 25,
    desc: "Ледниковая река высокой плотности (доход x6)"
  },
  {
    id: "cyber",
    index: 2,
    name: "Неоновый каньон",
    icon: "🌃",
    unlockWatts: 30000000,
    incomeMult: 36,
    rewardCrystals: 60,
    desc: "Ночная мега-энергосеть будущего (доход x36)"
  }
];

export const STATION_DEFS = [
  {
    id: "wood_wheel",
    name: "Деревянное колесо",
    icon: "🎡",
    desc: "Первое речное колесо на ручье",
    unlockCost: 0,
    baseCost: 12,
    costGrowth: 1.15,
    baseIncome: 2.5,
    baseWatts: 10,
    cycleSec: 1.6
  },
  {
    id: "twin_paddle",
    name: "Двойная турбина",
    icon: "⚙️",
    desc: "Усиленный вал с двумя лопатками",
    unlockCost: 120,
    baseCost: 145,
    costGrowth: 1.16,
    baseIncome: 22,
    baseWatts: 65,
    cycleSec: 2.0
  },
  {
    id: "pelton_jet",
    name: "Турбина Пелтона",
    icon: "🌀",
    desc: "Скоростная струя высокого давления",
    unlockCost: 1600,
    baseCost: 1900,
    costGrowth: 1.17,
    baseIncome: 190,
    baseWatts: 520,
    cycleSec: 2.3
  },
  {
    id: "concrete_dam",
    name: "Бетонная ГЭС",
    icon: "🏗️",
    desc: "Массивная плотина с водосбросом",
    unlockCost: 25000,
    baseCost: 30000,
    costGrowth: 1.18,
    baseIncome: 2100,
    baseWatts: 5600,
    cycleSec: 2.7
  },
  {
    id: "arch_megadam",
    name: "Арочная мега-ГЭС",
    icon: "🌊",
    desc: "Инженерный комплекс в каньоне",
    unlockCost: 420000,
    baseCost: 500000,
    costGrowth: 1.19,
    baseIncome: 28000,
    baseWatts: 82000,
    cycleSec: 3.1
  },
  {
    id: "quantum_hydro",
    name: "Гидро-реактор",
    icon: "🔮",
    desc: "Чистая энергия будущего",
    unlockCost: 10000000,
    baseCost: 12500000,
    costGrowth: 1.2,
    baseIncome: 480000,
    baseWatts: 1600000,
    cycleSec: 3.5
  }
];

export const UPGRADE_DEFS = [
  {
    id: "riverFlow",
    name: "Напор реки",
    icon: "💨",
    targetLabel: "Ускоряет все колёса и цикл добычи",
    baseCost: 40,
    costGrowth: 1.55,
    maxLevel: 40
  },
  {
    id: "damPressure",
    name: "Мощность генераторов",
    icon: "🔋",
    targetLabel: "Увеличивает выработку и добычу станций",
    baseCost: 160,
    costGrowth: 1.65,
    maxLevel: 35
  },
  {
    id: "gridEfficiency",
    name: "Умная ЛЭП",
    icon: "⚡",
    targetLabel: "Усиливает ручной клик и турбо-разгон",
    baseCost: 80,
    costGrowth: 1.5,
    maxLevel: 35
  },
  {
    id: "cityTariff",
    name: "Тариф города",
    icon: "🏙️",
    targetLabel: "Повышает цену каждого Ватта для города",
    baseCost: 360,
    costGrowth: 1.7,
    maxLevel: 30
  }
];

export const BOOSTER_DEFS = [
  {
    id: "turbo_3x",
    name: "Турбо-поток x3",
    icon: "🚀",
    desc: "Утроение дохода от всех ГЭС на 30 сек",
    durationSec: 30,
    crystalCost: 4
  },
  {
    id: "rain_2x",
    name: "Ливень x2",
    icon: "🌧️",
    desc: "Штормовой дождь: скорость и добыча x2 на 60 сек",
    durationSec: 60,
    crystalCost: 3
  },
  {
    id: "auto_tap",
    name: "Дрон-кликер",
    icon: "🤖",
    desc: "Автоматически кликает по воде 3 раза/сек (45 сек)",
    durationSec: 45,
    crystalCost: 3
  },
  {
    id: "cash_pack",
    name: "Мешок инвестиций",
    icon: "💰",
    desc: "Мгновенно даёт +120 сек текущего дохода (мин. $500)",
    durationSec: 0,
    crystalCost: 5
  }
];

export const SHOP_PERK_DEFS = [
  {
    id: "gold_blades",
    name: "Титановые лопасти",
    icon: "🛠️",
    desc: "+50% к доходу всех станций навсегда",
    baseCrystalCost: 6,
    costStep: 5,
    maxLevel: 10
  },
  {
    id: "crystal_battery",
    name: "Кристальная батарея",
    icon: "🔋",
    desc: "+25% к мощности (Ватт) для быстрого открытия зон",
    baseCrystalCost: 8,
    costStep: 6,
    maxLevel: 10
  },
  {
    id: "offline_amp",
    name: "Офлайн-реактор",
    icon: "🌙",
    desc: "+25% к доходу, пока игра закрыта",
    baseCrystalCost: 7,
    costStep: 7,
    maxLevel: 4
  }
];

export const CITY_ERAS = [
  { minWatts: 0, name: "Лагерь у ручья" },
  { minWatts: 120, name: "Деревня у воды" },
  { minWatts: 3000, name: "Рабочий посёлок" },
  { minWatts: 75000, name: "Эко-город" },
  { minWatts: 1800000, name: "Зелёный мегаполис" }
];

export const GRAND_GOALS = [
  {
    id: "goal_village",
    title: "Зажечь свет в деревне",
    subtitle: "Выйдите на 120 W — вырастут первые дома",
    targetWatts: 120,
    rewardCash: 95,
    rewardCrystals: 3
  },
  {
    id: "goal_town",
    title: "Запустить рабочий посёлок",
    subtitle: "Достигните 3.0 kW — появятся мастерские и кварталы",
    targetWatts: 3000,
    rewardCash: 2200,
    rewardCrystals: 5
  },
  {
    id: "goal_ecocity",
    title: "Запитать Эко-город",
    subtitle: "Достигните 75 kW — построятся стеклянные высотки",
    targetWatts: 75000,
    rewardCash: 55000,
    rewardCrystals: 8
  },
  {
    id: "goal_zone2",
    title: "Открыть Зону 2: Снежные вершины",
    subtitle: "Достигните 1.8 MW — постройте Мегаполис и откройте новую зону!",
    targetWatts: 1800000,
    rewardCash: 1500000,
    rewardCrystals: 15,
    unlocksZoneId: "glacier"
  },
  {
    id: "goal_zone3",
    title: "Открыть Зону 3: Неоновый каньон",
    subtitle: "Достигните 30 MW — откройте ночную кибер-зону (доход x36)!",
    targetWatts: 30000000,
    rewardCash: 35000000,
    rewardCrystals: 30,
    unlocksZoneId: "cyber"
  },
  {
    id: "goal_empire",
    title: "Абсолютная Гидро-Империя 250 MW",
    subtitle: "Финальная вершина чистой энергии",
    targetWatts: 250000000,
    rewardCash: 500000000,
    rewardCrystals: 50
  }
];

export const ACHIEVEMENT_DEFS = [
  { id: "ach_tap_25", name: "Первые брызги", desc: "Тапнуть по воде 25 раз", check: (s) => s.profile.totalTaps >= 25, crystals: 3 },
  { id: "ach_cash_10k", name: "Гидро-стартап", desc: "Заработать $10K за всё время", check: (s) => s.lifetimeCash >= 10000, crystals: 4 },
  { id: "ach_dam", name: "Покоритель плотин", desc: "Построить Бетонную ГЭС", check: (s) => s.stations.concrete_dam?.unlocked, crystals: 6 },
  { id: "ach_zone2", name: "Полярный инженер", desc: "Открыть Зону 2: Снежные вершины", check: (s) => s.unlockedZones.includes("glacier"), crystals: 10 },
  { id: "ach_zone3", name: "Неоновый магнат", desc: "Открыть Зону 3: Неоновый каньон", check: (s) => s.unlockedZones.includes("cyber"), crystals: 20 }
];

export const AVATAR_CHOICES = ["👷", "⚡", "🌊", "🚀", "👑", "🦊"];

export function createInitialState(engineers = 0, preserved = null) {
  const stations = {};
  for (const def of STATION_DEFS) {
    stations[def.id] = {
      unlocked: def.id === "wood_wheel",
      level: def.id === "wood_wheel" ? 1 : 0,
      cycleProgress: 0,
      totalMined: 0
    };
  }
  const upgrades = {};
  for (const up of UPGRADE_DEFS) {
    upgrades[up.id] = 0;
  }
  const shopPerks = preserved?.shopPerks || {
    gold_blades: 0,
    crystal_battery: 0,
    offline_amp: 0
  };
  const startBonus = engineers > 0 ? engineers * 120 : 0;
  return {
    cash: startBonus,
    runCash: startBonus,
    lifetimeCash: preserved?.lifetimeCash || 0,
    crystals: preserved?.crystals ?? 5,
    engineers,
    activeZoneId: preserved?.activeZoneId || "valley",
    unlockedZones: preserved?.unlockedZones || ["valley"],
    stations,
    upgrades,
    shopPerks,
    boosters: {
      turbo_3x: 0,
      rain_2x: 0,
      auto_tap: 0
    },
    claimedGoals: preserved?.claimedGoals || [],
    claimedAchievements: preserved?.claimedAchievements || [],
    profile: preserved?.profile || {
      name: "Гидро-Мастер",
      avatar: "👷",
      totalTaps: 0,
      playTimeSec: 0
    },
    overdrive: 0,
    lastSavedAt: Date.now()
  };
}

export function getActiveZone(state) {
  return ZONES.find((z) => z.id === state.activeZoneId) || ZONES[0];
}

export function getMilestoneMultiplier(level) {
  if (level <= 0) return 1;
  let mult = 1;
  if (level >= 10) mult *= 2;
  if (level >= 25) mult *= 2;
  if (level >= 50) mult *= 3;
  if (level >= 100) mult *= 4;
  return mult;
}

export function getNextMilestoneLevel(level) {
  for (const m of [10, 25, 50, 100]) {
    if (level < m) return m;
  }
  return null;
}

export function getFlowSpeedMultiplier(state) {
  return 1 + (state.upgrades.riverFlow || 0) * 0.22;
}

export function getBoosterIncomeMultiplier(state) {
  let mult = 1;
  if ((state.boosters?.turbo_3x || 0) > 0) mult *= 3;
  if ((state.boosters?.rain_2x || 0) > 0) mult *= 2;
  return mult;
}

export function getGlobalMultiplier(state) {
  const flowMult = getFlowSpeedMultiplier(state);
  const damMult = 1 + (state.upgrades.damPressure || 0) * 0.35;
  const tariffMult = 1 + (state.upgrades.cityTariff || 0) * 0.4;
  const engineerMult = 1 + (state.engineers || 0) * 0.5;
  const perkMult = 1 + (state.shopPerks?.gold_blades || 0) * 0.5;
  const zoneMult = getActiveZone(state).incomeMult;
  return flowMult * damMult * tariffMult * engineerMult * perkMult * zoneMult;
}

export function getOverdriveMultiplier(state) {
  return 1 + Math.min(1, Math.max(0, state.overdrive)) * 2.0;
}

export function getStationOutput(state, def, levelOverride = null) {
  const st = state.stations[def.id];
  const level = levelOverride !== null ? levelOverride : st?.level || 0;
  const unlocked = levelOverride !== null ? level > 0 : Boolean(st?.unlocked && level > 0);
  if (!unlocked || level <= 0) {
    return { incomePerSec: 0, watts: 0, cycleSec: def.cycleSec, payoutPerCycle: 0 };
  }
  const milestone = getMilestoneMultiplier(level);
  const globalMult = getGlobalMultiplier(state);
  const boosterMult = getBoosterIncomeMultiplier(state);
  const zoneMult = getActiveZone(state).incomeMult;
  const batteryMult = 1 + (state.shopPerks?.crystal_battery || 0) * 0.25;

  const incomePerSec = def.baseIncome * level * milestone * globalMult * boosterMult;
  const watts =
    def.baseWatts *
    level *
    milestone *
    (1 + (state.upgrades.riverFlow || 0) * 0.2) *
    batteryMult *
    Math.sqrt(zoneMult);

  const rainSpeed = (state.boosters?.rain_2x || 0) > 0 ? 1.6 : 1;
  const speedBoost = (1 + (state.upgrades.riverFlow || 0) * 0.08) * getOverdriveMultiplier(state) * rainSpeed;
  const effectiveCycleSec = Math.max(0.4, def.cycleSec / speedBoost);
  const payoutPerCycle = incomePerSec * (def.cycleSec / rainSpeed);
  return {
    incomePerSec,
    watts,
    cycleSec: effectiveCycleSec,
    payoutPerCycle
  };
}

export function getTotals(state) {
  let baseIncomePerSec = 0;
  let totalWatts = 0;
  for (const def of STATION_DEFS) {
    const out = getStationOutput(state, def);
    baseIncomePerSec += out.incomePerSec;
    totalWatts += out.watts;
  }
  const overdriveMult = getOverdriveMultiplier(state);
  const effectiveIncomePerSec = baseIncomePerSec * overdriveMult;
  const tapBonus = Math.max(
    1,
    (2.5 + baseIncomePerSec * 0.24) * (1 + (state.upgrades.gridEfficiency || 0) * 0.5)
  );
  return {
    baseIncomePerSec,
    effectiveIncomePerSec,
    totalWatts,
    overdriveMult,
    tapBonus
  };
}

export function getCityEraIndex(totalWatts) {
  let idx = 0;
  for (let i = 0; i < CITY_ERAS.length; i += 1) {
    if (totalWatts >= CITY_ERAS[i].minWatts) {
      idx = i;
    }
  }
  return idx;
}

export function getPlayerRank(state) {
  const { totalWatts } = getTotals(state);
  if (totalWatts >= 30000000) return "Повелитель Неоновой Сети";
  if (totalWatts >= 1800000) return "Архитектор Мегаполиса";
  if (totalWatts >= 75000) return "Главный Энергетик";
  if (totalWatts >= 3000) return "Мастер Турбин";
  if (totalWatts >= 120) return "Гидро-Инженер";
  return "Стажёр на ручье";
}

export function getCurrentGoalProgress(state) {
  const { totalWatts } = getTotals(state);
  const claimed = new Set(state.claimedGoals || []);
  for (let i = 0; i < GRAND_GOALS.length; i += 1) {
    const goal = GRAND_GOALS[i];
    if (!claimed.has(goal.id)) {
      const pct = Math.min(100, (totalWatts / goal.targetWatts) * 100);
      return {
        goal,
        index: i,
        totalGoals: GRAND_GOALS.length,
        currentWatts: totalWatts,
        percent: pct,
        completedAll: false
      };
    }
  }
  const last = GRAND_GOALS[GRAND_GOALS.length - 1];
  return {
    goal: last,
    index: GRAND_GOALS.length - 1,
    totalGoals: GRAND_GOALS.length,
    currentWatts: totalWatts,
    percent: 100,
    completedAll: true
  };
}

export function checkAndClaimGoals(state) {
  const { totalWatts } = getTotals(state);
  if (!Array.isArray(state.claimedGoals)) state.claimedGoals = [];
  if (!Array.isArray(state.unlockedZones)) state.unlockedZones = ["valley"];
  const newlyClaimed = [];
  for (const goal of GRAND_GOALS) {
    if (!state.claimedGoals.includes(goal.id) && totalWatts >= goal.targetWatts) {
      state.claimedGoals.push(goal.id);
      state.cash += goal.rewardCash;
      state.runCash += goal.rewardCash;
      state.lifetimeCash += goal.rewardCash;
      state.crystals = (state.crystals || 0) + (goal.rewardCrystals || 0);
      if (goal.unlocksZoneId && !state.unlockedZones.includes(goal.unlocksZoneId)) {
        state.unlockedZones.push(goal.unlocksZoneId);
      }
      newlyClaimed.push(goal);
    }
  }
  return newlyClaimed;
}

export function checkAchievements(state) {
  if (!Array.isArray(state.claimedAchievements)) state.claimedAchievements = [];
  const unlockedNow = [];
  for (const ach of ACHIEVEMENT_DEFS) {
    if (!state.claimedAchievements.includes(ach.id) && ach.check(state)) {
      state.claimedAchievements.push(ach.id);
      state.crystals = (state.crystals || 0) + ach.crystals;
      unlockedNow.push(ach);
    }
  }
  return unlockedNow;
}

export function switchZone(state, zoneId) {
  if (!state.unlockedZones.includes(zoneId)) return false;
  if (state.activeZoneId === zoneId) return false;
  state.activeZoneId = zoneId;
  return true;
}

export function getBulkStationCost(def, currentLevel, count) {
  if (count <= 0) return 0;
  const r = def.costGrowth;
  const first = def.baseCost * Math.pow(r, currentLevel);
  return Math.floor(first * ((Math.pow(r, count) - 1) / (r - 1)));
}

export function getMaxAffordableStationLevels(def, currentLevel, cash) {
  const r = def.costGrowth;
  const first = def.baseCost * Math.pow(r, currentLevel);
  if (cash < first) return 0;
  const ratio = 1 + (cash * (r - 1)) / first;
  const n = Math.floor(Math.log(ratio) / Math.log(r));
  return Math.max(0, Math.min(200, n));
}

export function getStationUpgradePreview(state, def, buyCount) {
  const st = state.stations[def.id];
  if (!st.unlocked) {
    const after = getStationOutput(state, def, 1);
    return {
      deltaIncome: after.incomePerSec,
      deltaWatts: after.watts,
      nextMilestone: 10
    };
  }
  const before = getStationOutput(state, def, st.level);
  const after = getStationOutput(state, def, st.level + buyCount);
  return {
    deltaIncome: after.incomePerSec - before.incomePerSec,
    deltaWatts: after.watts - before.watts,
    nextMilestone: getNextMilestoneLevel(st.level)
  };
}

export function getUpgradeCost(def, currentLevel) {
  return Math.floor(def.baseCost * Math.pow(def.costGrowth, currentLevel));
}

export function getUpgradeEffectText(state, def) {
  const lvl = state.upgrades[def.id] || 0;
  const totals = getTotals(state);
  if (def.id === "riverFlow") {
    const cur = 1 + lvl * 0.22;
    const nxt = 1 + (lvl + 1) * 0.22;
    return `Напор: x${cur.toFixed(2)} → x${nxt.toFixed(2)} (+${formatCompact((totals.baseIncomePerSec * 0.22) / cur, "$")}/с)`;
  }
  if (def.id === "damPressure") {
    const cur = 1 + lvl * 0.35;
    const nxt = 1 + (lvl + 1) * 0.35;
    return `Мощь ГЭС: x${cur.toFixed(2)} → x${nxt.toFixed(2)} (+${formatCompact((totals.baseIncomePerSec * 0.35) / cur, "$")}/с)`;
  }
  if (def.id === "gridEfficiency") {
    const curTap = totals.tapBonus;
    const nxtTap = curTap * ((1 + (lvl + 1) * 0.5) / (1 + lvl * 0.5));
    return `Клик по воде: ${formatCompact(curTap, "$")} → ${formatCompact(nxtTap, "$")}`;
  }
  if (def.id === "cityTariff") {
    const cur = 1 + lvl * 0.4;
    const nxt = 1 + (lvl + 1) * 0.4;
    return `Тариф города: x${cur.toFixed(1)} → x${nxt.toFixed(1)} (+${formatCompact((totals.baseIncomePerSec * 0.4) / cur, "$")}/с)`;
  }
  return def.targetLabel;
}

export function getBoosterCashCost(state, boosterDef) {
  const { effectiveIncomePerSec } = getTotals(state);
  const scale = Math.max(80, effectiveIncomePerSec * 28);
  if (boosterDef.id === "cash_pack") return null; // Crystal-only instant cash pack
  if (boosterDef.id === "turbo_3x") return Math.floor(scale * 1.4);
  if (boosterDef.id === "rain_2x") return Math.floor(scale * 1.0);
  return Math.floor(scale * 0.9);
}

export function buyBoosterAction(state, boosterId, payWith = "cash") {
  const def = BOOSTER_DEFS.find((b) => b.id === boosterId);
  if (!def) return { ok: false, cashGranted: 0 };

  if (payWith === "crystals") {
    if ((state.crystals || 0) < def.crystalCost) return { ok: false, cashGranted: 0 };
    state.crystals -= def.crystalCost;
  } else {
    const cashCost = getBoosterCashCost(state, def);
    if (cashCost === null || state.cash < cashCost) return { ok: false, cashGranted: 0 };
    state.cash -= cashCost;
  }

  if (def.id === "cash_pack") {
    const { effectiveIncomePerSec } = getTotals(state);
    const grant = Math.max(500, Math.floor(effectiveIncomePerSec * 120));
    state.cash += grant;
    state.runCash += grant;
    state.lifetimeCash += grant;
    return { ok: true, cashGranted: grant };
  }

  state.boosters[def.id] = (state.boosters[def.id] || 0) + def.durationSec;
  return { ok: true, cashGranted: 0 };
}

export function getShopPerkCost(perkDef, level) {
  return perkDef.baseCrystalCost + level * perkDef.costStep;
}

export function buyShopPerkAction(state, perkId) {
  const def = SHOP_PERK_DEFS.find((p) => p.id === perkId);
  if (!def) return false;
  const lvl = state.shopPerks?.[perkId] || 0;
  if (lvl >= def.maxLevel) return false;
  const cost = getShopPerkCost(def, lvl);
  if ((state.crystals || 0) < cost) return false;
  state.crystals -= cost;
  state.shopPerks[perkId] = lvl + 1;
  return true;
}

export function computePendingEngineers(state) {
  if (state.runCash < 50000) return 0;
  return Math.max(1, Math.floor(Math.pow(state.runCash / 25000, 0.45)));
}

export function buyStationAction(state, stationId, multMode) {
  const def = STATION_DEFS.find((d) => d.id === stationId);
  if (!def) return false;
  const st = state.stations[stationId];

  if (!st.unlocked) {
    if (state.cash < def.unlockCost) return false;
    state.cash -= def.unlockCost;
    st.unlocked = true;
    st.level = 1;
    st.cycleProgress = 0;
    return true;
  }

  let count = 1;
  if (multMode === "x10") {
    count = 10;
  } else if (multMode === "MAX") {
    count = Math.max(1, getMaxAffordableStationLevels(def, st.level, state.cash));
  }

  const cost = getBulkStationCost(def, st.level, count);
  if (state.cash < cost) return false;
  state.cash -= cost;
  st.level += count;
  return true;
}

export function buyUpgradeAction(state, upgradeId) {
  const def = UPGRADE_DEFS.find((u) => u.id === upgradeId);
  if (!def) return false;
  const level = state.upgrades[upgradeId] || 0;
  if (level >= def.maxLevel) return false;
  const cost = getUpgradeCost(def, level);
  if (state.cash < cost) return false;
  state.cash -= cost;
  state.upgrades[upgradeId] = level + 1;
  return true;
}

export function triggerPrestige(state) {
  const gained = computePendingEngineers(state);
  if (gained <= 0) return 0;
  const totalEngineers = state.engineers + gained;
  const next = createInitialState(totalEngineers, {
    lifetimeCash: state.lifetimeCash,
    crystals: state.crystals,
    shopPerks: state.shopPerks,
    activeZoneId: state.activeZoneId,
    unlockedZones: state.unlockedZones,
    claimedGoals: state.claimedGoals,
    claimedAchievements: state.claimedAchievements,
    profile: state.profile
  });
  Object.assign(state, next);
  return gained;
}

export function applyTap(state) {
  const { tapBonus } = getTotals(state);
  state.cash += tapBonus;
  state.runCash += tapBonus;
  state.lifetimeCash += tapBonus;
  state.overdrive = Math.min(1, state.overdrive + 0.16);
  state.profile.totalTaps = (state.profile.totalTaps || 0) + 1;
  return tapBonus;
}

export function tickEconomy(state, dtSeconds) {
  const clampedDt = Math.min(0.25, Math.max(0, dtSeconds));
  state.profile.playTimeSec = (state.profile.playTimeSec || 0) + clampedDt;

  // Tick down active boosters
  for (const key of ["turbo_3x", "rain_2x", "auto_tap"]) {
    if ((state.boosters?.[key] || 0) > 0) {
      state.boosters[key] = Math.max(0, state.boosters[key] - clampedDt);
    }
  }

  const overdriveMult = getOverdriveMultiplier(state);
  const rainMult = (state.boosters?.rain_2x || 0) > 0 ? 1.6 : 1;
  const flowFactor = 1 + (state.upgrades.riverFlow || 0) * 0.08;
  const speedBoost = flowFactor * overdriveMult * rainMult;
  const payouts = [];

  for (const def of STATION_DEFS) {
    const st = state.stations[def.id];
    if (!st || !st.unlocked || st.level <= 0) continue;

    const out = getStationOutput(state, def);
    st.cycleProgress = (st.cycleProgress || 0) + (clampedDt * speedBoost) / def.cycleSec;

    if (st.cycleProgress >= 1) {
      const cycles = Math.floor(st.cycleProgress);
      st.cycleProgress -= cycles;
      const earned = out.payoutPerCycle * cycles;
      state.cash += earned;
      state.runCash += earned;
      state.lifetimeCash += earned;
      st.totalMined = (st.totalMined || 0) + earned;
      payouts.push({ stationId: def.id, amount: earned });
    }
  }

  if (state.engineers >= 2) {
    state.overdrive = Math.max(0.25, state.overdrive - clampedDt * 0.14);
  } else {
    state.overdrive = Math.max(0, state.overdrive - clampedDt * 0.18);
  }

  return payouts;
}

export function formatCompact(value, prefix = "") {
  if (!Number.isFinite(value) || value < 0) return `${prefix}0`;
  const suffixes = ["", "K", "M", "B", "T", "Qa", "Qi"];
  if (value < 1000) {
    const rounded = value < 10 && value > 0 && prefix === "$" ? value.toFixed(1) : Math.floor(value);
    return `${prefix}${rounded}`;
  }
  const tier = Math.min(suffixes.length - 1, Math.floor(Math.log10(value) / 3));
  const scaled = value / Math.pow(1000, tier);
  const decimals = scaled >= 100 ? 0 : scaled >= 10 ? 1 : 2;
  return `${prefix}${scaled.toFixed(decimals)}${suffixes[tier]}`;
}

export function formatWatts(watts) {
  if (watts < 1000) return `${Math.floor(watts)} W`;
  if (watts < 1e6) return `${(watts / 1000).toFixed(1)} kW`;
  if (watts < 1e9) return `${(watts / 1e6).toFixed(2)} MW`;
  return `${(watts / 1e9).toFixed(2)} GW`;
}

export function saveState(state) {
  try {
    state.lastSavedAt = Date.now();
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota issues in restricted webviews
  }
}

export function loadState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return { state: createInitialState(0), offlineEarned: 0, offlineSeconds: 0 };
    const parsed = JSON.parse(raw);
    const fresh = createInitialState(parsed.engineers || 0, {
      lifetimeCash: Number(parsed.lifetimeCash) || 0,
      crystals: parsed.crystals ?? 5,
      shopPerks: parsed.shopPerks || { gold_blades: 0, crystal_battery: 0, offline_amp: 0 },
      activeZoneId: parsed.activeZoneId || "valley",
      unlockedZones: Array.isArray(parsed.unlockedZones) ? parsed.unlockedZones : ["valley"],
      claimedGoals: Array.isArray(parsed.claimedGoals) ? parsed.claimedGoals : [],
      claimedAchievements: Array.isArray(parsed.claimedAchievements) ? parsed.claimedAchievements : [],
      profile: parsed.profile || { name: "Гидро-Мастер", avatar: "👷", totalTaps: 0, playTimeSec: 0 }
    });
    fresh.cash = Number(parsed.cash) || 0;
    fresh.runCash = Number(parsed.runCash) || fresh.cash;
    fresh.overdrive = 0;

    if (parsed.stations) {
      for (const def of STATION_DEFS) {
        if (parsed.stations[def.id]) {
          fresh.stations[def.id] = {
            unlocked: Boolean(parsed.stations[def.id].unlocked),
            level: Math.max(0, Number(parsed.stations[def.id].level) || 0),
            cycleProgress: 0,
            totalMined: Math.max(0, Number(parsed.stations[def.id].totalMined) || 0)
          };
        }
      }
    }
    if (parsed.upgrades) {
      for (const up of UPGRADE_DEFS) {
        fresh.upgrades[up.id] = Math.min(
          up.maxLevel,
          Math.max(0, Number(parsed.upgrades[up.id]) || 0)
        );
      }
    }

    const elapsedSec = Math.min(8 * 3600, Math.max(0, (Date.now() - (parsed.lastSavedAt || Date.now())) / 1000));
    const { baseIncomePerSec } = getTotals(fresh);
    const offlineMult = 0.5 + (fresh.shopPerks?.offline_amp || 0) * 0.25;
    const offlineEarned = elapsedSec >= 10 ? baseIncomePerSec * elapsedSec * offlineMult : 0;
    if (offlineEarned > 0) {
      fresh.cash += offlineEarned;
      fresh.runCash += offlineEarned;
      fresh.lifetimeCash += offlineEarned;
    }
    return { state: fresh, offlineEarned, offlineSeconds: Math.floor(elapsedSec) };
  } catch {
    return { state: createInitialState(0), offlineEarned: 0, offlineSeconds: 0 };
  }
}
