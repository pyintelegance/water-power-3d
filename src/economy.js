export const SAVE_KEY = "water_power_3d_save_v1";

export const STATION_DEFS = [
  {
    id: "wood_wheel",
    name: "Деревянное колесо",
    icon: "🎡",
    desc: "Первое речное колесо на ручье",
    unlockCost: 0,
    baseCost: 12,
    costGrowth: 1.15,
    baseIncome: 2,
    baseWatts: 8
  },
  {
    id: "twin_paddle",
    name: "Двойная турбина",
    icon: "⚙️",
    desc: "Усиленный вал с двумя лопатками",
    unlockCost: 140,
    baseCost: 160,
    costGrowth: 1.16,
    baseIncome: 18,
    baseWatts: 55
  },
  {
    id: "pelton_jet",
    name: "Турбина Пелтона",
    icon: "🌀",
    desc: "Скоростная струя высокого давления",
    unlockCost: 1900,
    baseCost: 2200,
    costGrowth: 1.17,
    baseIncome: 165,
    baseWatts: 480
  },
  {
    id: "concrete_dam",
    name: "Бетонная ГЭС",
    icon: "🏗️",
    desc: "Массивная плотина с водосбросом",
    unlockCost: 30000,
    baseCost: 35000,
    costGrowth: 1.18,
    baseIncome: 1800,
    baseWatts: 5200
  },
  {
    id: "arch_megadam",
    name: "Арочная мега-ГЭС",
    icon: "🌊",
    desc: "Инженерный комплекс в каньоне",
    unlockCost: 520000,
    baseCost: 600000,
    costGrowth: 1.19,
    baseIncome: 24000,
    baseWatts: 75000
  },
  {
    id: "quantum_hydro",
    name: "Гидро-реактор",
    icon: "🔮",
    desc: "Чистая энергия будущего",
    unlockCost: 12000000,
    baseCost: 15000000,
    costGrowth: 1.2,
    baseIncome: 420000,
    baseWatts: 1400000
  }
];

export const UPGRADE_DEFS = [
  {
    id: "riverFlow",
    name: "Напор реки",
    icon: "💨",
    desc: "+25% к скорости потока и доходу",
    baseCost: 45,
    costGrowth: 1.55,
    maxLevel: 40
  },
  {
    id: "damPressure",
    name: "Мощность плотины",
    icon: "🔋",
    desc: "+35% к пассивной генерации",
    baseCost: 180,
    costGrowth: 1.65,
    maxLevel: 35
  },
  {
    id: "gridEfficiency",
    name: "Умная ЛЭП",
    icon: "⚡",
    desc: "+50% к силе тапа и турбо-бонусу",
    baseCost: 90,
    costGrowth: 1.5,
    maxLevel: 35
  },
  {
    id: "cityTariff",
    name: "Тариф мегаполиса",
    icon: "🏙️",
    desc: "+40% к цене энергии для города",
    baseCost: 400,
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

export function createInitialState(engineers = 0) {
  const stations = {};
  for (const def of STATION_DEFS) {
    stations[def.id] = {
      unlocked: def.id === "wood_wheel",
      level: def.id === "wood_wheel" ? 1 : 0
    };
  }
  const upgrades = {};
  for (const up of UPGRADE_DEFS) {
    upgrades[up.id] = 0;
  }
  const startBonus = engineers > 0 ? engineers * 100 : 0;
  return {
    cash: startBonus,
    runCash: startBonus,
    lifetimeCash: 0,
    engineers,
    stations,
    upgrades,
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

export function getGlobalMultiplier(state) {
  const flowMult = 1 + state.upgrades.riverFlow * 0.25;
  const damMult = 1 + state.upgrades.damPressure * 0.35;
  const tariffMult = 1 + state.upgrades.cityTariff * 0.4;
  const engineerMult = 1 + state.engineers * 0.5;
  return flowMult * damMult * tariffMult * engineerMult;
}

export function getOverdriveMultiplier(state) {
  return 1 + Math.min(1, Math.max(0, state.overdrive)) * 2.0;
}

export function getStationOutput(state, def) {
  const st = state.stations[def.id];
  if (!st || !st.unlocked || st.level <= 0) {
    return { incomePerSec: 0, watts: 0 };
  }
  const milestone = getMilestoneMultiplier(st.level);
  const globalMult = getGlobalMultiplier(state);
  const incomePerSec = def.baseIncome * st.level * milestone * globalMult;
  const watts = def.baseWatts * st.level * milestone * (1 + state.upgrades.riverFlow * 0.2);
  return { incomePerSec, watts };
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
    (2 + baseIncomePerSec * 0.22) * (1 + state.upgrades.gridEfficiency * 0.5)
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

export function getUpgradeCost(def, currentLevel) {
  return Math.floor(def.baseCost * Math.pow(def.costGrowth, currentLevel));
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

export function tickEconomy(state, dtSeconds) {
  const clampedDt = Math.min(0.25, Math.max(0, dtSeconds));
  const { effectiveIncomePerSec } = getTotals(state);
  const earned = effectiveIncomePerSec * clampedDt;
  state.cash += earned;
  state.runCash += earned;
  state.lifetimeCash += earned;

  // Auto-tapper drone when player has >= 2 engineers
  if (state.engineers >= 2) {
    state.overdrive = Math.max(0.25, state.overdrive - clampedDt * 0.14);
  } else {
    state.overdrive = Math.max(0, state.overdrive - clampedDt * 0.18);
  }
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
    fresh.overdrive = 0;

    if (parsed.stations) {
      for (const def of STATION_DEFS) {
        if (parsed.stations[def.id]) {
          fresh.stations[def.id] = {
            unlocked: Boolean(parsed.stations[def.id].unlocked),
            level: Math.max(0, Number(parsed.stations[def.id].level) || 0)
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
