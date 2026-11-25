export const SAVE_KEY = "water_power_3d_save_v2";

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
    subtitle: "Выйдите на мощность 120 W — вырастут первые дома",
    targetWatts: 120,
    rewardCash: 95
  },
  {
    id: "goal_town",
    title: "Запустить рабочий посёлок",
    subtitle: "Достигните 3.0 kW — появятся мастерские и кварталы",
    targetWatts: 3000,
    rewardCash: 2200
  },
  {
    id: "goal_ecocity",
    title: "Запитать Эко-город",
    subtitle: "Достигните 75 kW — построятся стеклянные высотки",
    targetWatts: 75000,
    rewardCash: 55000
  },
  {
    id: "goal_metropolis",
    title: "Построить Зелёный мегаполис",
    subtitle: "Достигните 1.8 MW — город будущего на чистой воде!",
    targetWatts: 1800000,
    rewardCash: 1500000
  },
  {
    id: "goal_empire",
    title: "Гидро-Империя 10 MW",
    subtitle: "Финальная цель: абсолютная энергетическая мощь",
    targetWatts: 10000000,
    rewardCash: 25000000
  }
];

export function createInitialState(engineers = 0) {
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
  const startBonus = engineers > 0 ? engineers * 120 : 0;
  return {
    cash: startBonus,
    runCash: startBonus,
    lifetimeCash: 0,
    engineers,
    stations,
    upgrades,
    claimedGoals: [],
    overdrive: 0,
    lastSavedAt: Date.now()
  };
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
  const milestones = [10, 25, 50, 100];
  for (const m of milestones) {
    if (level < m) return m;
  }
  return null;
}

export function getFlowSpeedMultiplier(state) {
  return 1 + (state.upgrades.riverFlow || 0) * 0.22;
}

export function getGlobalMultiplier(state) {
  const flowMult = getFlowSpeedMultiplier(state);
  const damMult = 1 + (state.upgrades.damPressure || 0) * 0.35;
  const tariffMult = 1 + (state.upgrades.cityTariff || 0) * 0.4;
  const engineerMult = 1 + (state.engineers || 0) * 0.5;
  return flowMult * damMult * tariffMult * engineerMult;
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
  const incomePerSec = def.baseIncome * level * milestone * globalMult;
  const watts = def.baseWatts * level * milestone * (1 + (state.upgrades.riverFlow || 0) * 0.2);
  const speedBoost = (1 + (state.upgrades.riverFlow || 0) * 0.08) * getOverdriveMultiplier(state);
  const effectiveCycleSec = Math.max(0.45, def.cycleSec / speedBoost);
  const payoutPerCycle = incomePerSec * def.cycleSec;
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
  const newlyClaimed = [];
  for (const goal of GRAND_GOALS) {
    if (!state.claimedGoals.includes(goal.id) && totalWatts >= goal.targetWatts) {
      state.claimedGoals.push(goal.id);
      state.cash += goal.rewardCash;
      state.runCash += goal.rewardCash;
      state.lifetimeCash += goal.rewardCash;
      newlyClaimed.push(goal);
    }
  }
  return newlyClaimed;
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
    return `Напор: x${cur.toFixed(2)} → x${nxt.toFixed(2)} (+${formatCompact(totals.baseIncomePerSec * 0.22 / cur, "$")}/с)`;
  }
  if (def.id === "damPressure") {
    const cur = 1 + lvl * 0.35;
    const nxt = 1 + (lvl + 1) * 0.35;
    return `Мощь ГЭС: x${cur.toFixed(2)} → x${nxt.toFixed(2)} (+${formatCompact(totals.baseIncomePerSec * 0.35 / cur, "$")}/с)`;
  }
  if (def.id === "gridEfficiency") {
    const curTap = totals.tapBonus;
    const nxtTap = curTap * ((1 + (lvl + 1) * 0.5) / (1 + lvl * 0.5));
    return `Клик по воде: ${formatCompact(curTap, "$")} → ${formatCompact(nxtTap, "$")}`;
  }
  if (def.id === "cityTariff") {
    const cur = 1 + lvl * 0.4;
    const nxt = 1 + (lvl + 1) * 0.4;
    return `Тариф города: x${cur.toFixed(1)} → x${nxt.toFixed(1)} (+${formatCompact(totals.baseIncomePerSec * 0.4 / cur, "$")}/с)`;
  }
  return def.targetLabel;
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
  const lifetime = state.lifetimeCash;
  const next = createInitialState(totalEngineers);
  next.lifetimeCash = lifetime;
  Object.assign(state, next);
  return gained;
}

export function applyTap(state) {
  const { tapBonus } = getTotals(state);
  state.cash += tapBonus;
  state.runCash += tapBonus;
  state.lifetimeCash += tapBonus;
  state.overdrive = Math.min(1, state.overdrive + 0.16);
  return tapBonus;
}

/**
 * Advances each active hydro station's mining cycle and emits payout events
 * when a station finishes a block/cycle so 3D popups & cash stay synchronized.
 */
export function tickEconomy(state, dtSeconds) {
  const clampedDt = Math.min(0.25, Math.max(0, dtSeconds));
  const overdriveMult = getOverdriveMultiplier(state);
  const flowFactor = 1 + (state.upgrades.riverFlow || 0) * 0.08;
  const speedBoost = flowFactor * overdriveMult;
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
    const fresh = createInitialState(parsed.engineers || 0);
    fresh.cash = Number(parsed.cash) || 0;
    fresh.runCash = Number(parsed.runCash) || fresh.cash;
    fresh.lifetimeCash = Number(parsed.lifetimeCash) || fresh.cash;
    fresh.claimedGoals = Array.isArray(parsed.claimedGoals) ? parsed.claimedGoals : [];
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
    const offlineEarned = elapsedSec >= 10 ? baseIncomePerSec * elapsedSec * 0.5 : 0;
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
