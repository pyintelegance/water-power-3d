import { getLang } from "./i18n.js";

export const SAVE_KEY = "water_power_3d_save_v4";

export const ZONES = [
  {
    id: "valley",
    index: 0,
    name: "Зелёная долина",
    shortName: "Долина",
    icon: "valley",
    incomeMult: 1,
    nextZoneId: "glacier",
    nextZoneTargetWatts: 1800000,
    rewardCrystals: 0,
    desc: "Стартовый каньон: классические колёса, плотины и эко-город",
    eras: [
      { minWatts: 0, name: "Лагерь у ручья" },
      { minWatts: 120, name: "Деревня у воды" },
      { minWatts: 3000, name: "Рабочий посёлок" },
      { minWatts: 75000, name: "Эко-город" },
      { minWatts: 1800000, name: "Зелёный мегаполис" }
    ],
    stations: [
      { id: "s0", name: "Водяное колесо", icon: "s0", desc: "Деревянная мельница в ручье", unlockCost: 0, baseCost: 12, costGrowth: 1.15, baseIncome: 2.5, baseWatts: 10, cycleSec: 1.6 },
      { id: "s1", name: "Двойная турбина", icon: "s1", desc: "Усиленный вал с парой роторов", unlockCost: 120, baseCost: 145, costGrowth: 1.16, baseIncome: 22, baseWatts: 65, cycleSec: 2.0 },
      { id: "s2", name: "Турбина Пелтона", icon: "s2", desc: "Напорная струя высокого давления", unlockCost: 1600, baseCost: 1900, costGrowth: 1.17, baseIncome: 190, baseWatts: 520, cycleSec: 2.3 },
      { id: "s3", name: "Бетонная ГЭС", icon: "s3", desc: "Плотина с мощным водосбросом", unlockCost: 25000, baseCost: 30000, costGrowth: 1.18, baseIncome: 2100, baseWatts: 5600, cycleSec: 2.7 },
      { id: "s4", name: "Арочная мега-ГЭС", icon: "s4", desc: "Инженерный каскад в каньоне", unlockCost: 420000, baseCost: 500000, costGrowth: 1.19, baseIncome: 28000, baseWatts: 82000, cycleSec: 3.1 },
      { id: "s5", name: "Гидро-реактор", icon: "s5", desc: "Квантовый генератор чистой воды", unlockCost: 10000000, baseCost: 12500000, costGrowth: 1.2, baseIncome: 480000, baseWatts: 1600000, cycleSec: 3.5 }
    ],
    upgrades: [
      { id: "u0", name: "Напор реки", icon: "flow", targetLabel: "Ускоряет вращение всех колёс", baseCost: 40, costGrowth: 1.55, maxLevel: 40, kind: "flow" },
      { id: "u1", name: "Мощь генераторов", icon: "dam", targetLabel: "Повышает выработку каждой ГЭС", baseCost: 160, costGrowth: 1.65, maxLevel: 35, kind: "dam" },
      { id: "u2", name: "Умная ЛЭП", icon: "tap", targetLabel: "Усиливает тап по воде и разгон", baseCost: 80, costGrowth: 1.5, maxLevel: 35, kind: "tap" },
      { id: "u3", name: "Городской тариф", icon: "tariff", targetLabel: "Поднимает цену за энергию", baseCost: 360, costGrowth: 1.7, maxLevel: 30, kind: "tariff" }
    ],
    goals: [
      { id: "v_1", title: "Осветить деревню", subtitle: "Накопите 120 W", targetWatts: 120, rewardCash: 95, rewardCrystals: 3 },
      { id: "v_2", title: "Запустить посёлок", subtitle: "Достигните 3.0 kW", targetWatts: 3000, rewardCash: 2200, rewardCrystals: 5 },
      { id: "v_3", title: "Запитать Эко-город", subtitle: "Достигните 75 kW", targetWatts: 75000, rewardCash: 55000, rewardCrystals: 8 },
      { id: "v_4", title: "Открыть Снежные вершины", subtitle: "Достигните 1.8 MW для новой главы", targetWatts: 1800000, rewardCash: 1500000, rewardCrystals: 10 }
    ]
  },
  {
    id: "glacier",
    index: 1,
    name: "Снежные вершины",
    shortName: "Ледник",
    icon: "glacier",
    incomeMult: 8,
    nextZoneId: "cyber",
    nextZoneTargetWatts: 18000000,
    rewardCrystals: 18,
    desc: "Ледниковый каньон: крио-турбины, термальные ГЭС и северный город",
    eras: [
      { minWatts: 0, name: "Полярный лагерь" },
      { minWatts: 500, name: "Зимняя деревня" },
      { minWatts: 20000, name: "Горная база" },
      { minWatts: 600000, name: "Термальный полис" },
      { minWatts: 18000000, name: "Аврора-Мегаполис" }
    ],
    stations: [
      { id: "s0", name: "Ледовое колесо", icon: "s0", desc: "Морозостойкий ледовый ротор", unlockCost: 0, baseCost: 15, costGrowth: 1.15, baseIncome: 4.5, baseWatts: 35, cycleSec: 1.5 },
      { id: "s1", name: "Крио-турбина", icon: "s1", desc: "Спаренный вал с термо-подогревом", unlockCost: 180, baseCost: 220, costGrowth: 1.16, baseIncome: 42, baseWatts: 260, cycleSec: 1.9 },
      { id: "s2", name: "Горный водомёт", icon: "s2", desc: "Ледниковая струя под давлением", unlockCost: 2600, baseCost: 3200, costGrowth: 1.17, baseIncome: 390, baseWatts: 2200, cycleSec: 2.2 },
      { id: "s3", name: "Ледниковая дамба", icon: "s3", desc: "Армированная полярная плотина", unlockCost: 42000, baseCost: 52000, costGrowth: 1.18, baseIncome: 4400, baseWatts: 24000, cycleSec: 2.6 },
      { id: "s4", name: "Гео-термо ГЭС", icon: "s4", desc: "Энергия пара и горного каскада", unlockCost: 750000, baseCost: 920000, costGrowth: 1.19, baseIncome: 62000, baseWatts: 360000, cycleSec: 3.0 },
      { id: "s5", name: "Аврора-реактор", icon: "s5", desc: "Кристалл северного сияния", unlockCost: 16000000, baseCost: 20000000, costGrowth: 1.2, baseIncome: 1100000, baseWatts: 7500000, cycleSec: 3.3 }
    ],
    upgrades: [
      { id: "u0", name: "Антилёд-подогрев", icon: "flow", targetLabel: "Разгоняет поток сквозь льды", baseCost: 55, costGrowth: 1.55, maxLevel: 40, kind: "flow" },
      { id: "u1", name: "Ледокол-шлюз", icon: "dam", targetLabel: "Усиливает мощность крио-станций", baseCost: 220, costGrowth: 1.65, maxLevel: 35, kind: "dam" },
      { id: "u2", name: "Тепловая сеть", icon: "tap", targetLabel: "Усиливает клик и тепловой импульс", baseCost: 110, costGrowth: 1.5, maxLevel: 35, kind: "tap" },
      { id: "u3", name: "Полярный экспорт", icon: "tariff", targetLabel: "Повышает доход с мегаватт в горах", baseCost: 480, costGrowth: 1.7, maxLevel: 30, kind: "tariff" }
    ],
    goals: [
      { id: "g_1", title: "Согреть деревню", subtitle: "Выйдите на 500 W", targetWatts: 500, rewardCash: 240, rewardCrystals: 4 },
      { id: "g_2", title: "Открыть горную базу", subtitle: "Достигните 20 kW", targetWatts: 20000, rewardCash: 9500, rewardCrystals: 6 },
      { id: "g_3", title: "Термальный полис", subtitle: "Достигните 600 kW", targetWatts: 600000, rewardCash: 280000, rewardCrystals: 10 },
      { id: "g_4", title: "Открыть Неоновый каньон", subtitle: "Достигните 18 MW для финала", targetWatts: 18000000, rewardCash: 8000000, rewardCrystals: 15 }
    ]
  },
  {
    id: "cyber",
    index: 2,
    name: "Неоновый каньон",
    shortName: "Неон",
    icon: "cyber",
    incomeMult: 50,
    nextZoneId: null,
    nextZoneTargetWatts: null,
    rewardCrystals: 35,
    desc: "Ночной кибер-каньон: плазма-роторы, магнитные шлюзы и мегасити",
    eras: [
      { minWatts: 0, name: "Неоновый аванпост" },
      { minWatts: 5000, name: "Кибер-квартал" },
      { minWatts: 250000, name: "Сектор Омега" },
      { minWatts: 10000000, name: "Хроно-Сити" },
      { minWatts: 250000000, name: "Орбитальный Мегаполис" }
    ],
    stations: [
      { id: "s0", name: "Плазма-ротор", icon: "s0", desc: "Неоновая турбина высокого тока", unlockCost: 0, baseCost: 20, costGrowth: 1.15, baseIncome: 9, baseWatts: 150, cycleSec: 1.4 },
      { id: "s1", name: "Гипер-турбина", icon: "s1", desc: "Двойное лазерное ускорение", unlockCost: 260, baseCost: 320, costGrowth: 1.16, baseIncome: 85, baseWatts: 1200, cycleSec: 1.8 },
      { id: "s2", name: "Магнитный канал", icon: "s2", desc: "Магнитный разгон плазменной воды", unlockCost: 3800, baseCost: 4600, costGrowth: 1.17, baseIncome: 820, baseWatts: 11000, cycleSec: 2.1 },
      { id: "s3", name: "Кибер-плотина", icon: "s3", desc: "Голографическая дамба будущего", unlockCost: 65000, baseCost: 78000, costGrowth: 1.18, baseIncome: 9500, baseWatts: 140000, cycleSec: 2.5 },
      { id: "s4", name: "Орбитальный шлюз", icon: "s4", desc: "Гравитационный гидро-каскад", unlockCost: 1100000, baseCost: 1400000, costGrowth: 1.19, baseIncome: 140000, baseWatts: 2200000, cycleSec: 2.9 },
      { id: "s5", name: "Сингулярность ГЭС", icon: "s5", desc: "Главный реактор мегасити", unlockCost: 25000000, baseCost: 32000000, costGrowth: 1.2, baseIncome: 2600000, baseWatts: 55000000, cycleSec: 3.2 }
    ],
    upgrades: [
      { id: "u0", name: "Плазменный поток", icon: "flow", targetLabel: "Разгоняет поток в неон-канале", baseCost: 75, costGrowth: 1.55, maxLevel: 40, kind: "flow" },
      { id: "u1", name: "Нано-генерация", icon: "dam", targetLabel: "Умножает добычу кибер-станций", baseCost: 300, costGrowth: 1.65, maxLevel: 35, kind: "dam" },
      { id: "u2", name: "Нейро-клик", icon: "tap", targetLabel: "Максимизирует импульс клика", baseCost: 150, costGrowth: 1.5, maxLevel: 35, kind: "tap" },
      { id: "u3", name: "Мега-контракт", icon: "tariff", targetLabel: "Премиальный тариф мегасити", baseCost: 650, costGrowth: 1.7, maxLevel: 30, kind: "tariff" }
    ],
    goals: [
      { id: "c_1", title: "Зажечь Кибер-квартал", subtitle: "Выйдите на 5.0 kW", targetWatts: 5000, rewardCash: 1200, rewardCrystals: 5 },
      { id: "c_2", title: "Питание Сектора Омега", subtitle: "Достигните 250 kW", targetWatts: 250000, rewardCash: 85000, rewardCrystals: 8 },
      { id: "c_3", title: "Запустить Хроно-Сити", subtitle: "Достигните 10 MW", targetWatts: 10000000, rewardCash: 4500000, rewardCrystals: 15 },
      { id: "c_4", title: "Орбитальный Мегаполис", subtitle: "Финал: достигните 250 MW", targetWatts: 250000000, rewardCash: 250000000, rewardCrystals: 40 }
    ]
  }
];

export const BOOSTER_DEFS = [
  { id: "turbo_3x", name: "Турбо-поток x3", icon: "turbo_3x", desc: "Утроение дохода от всех ГЭС на 30 сек", durationSec: 30, crystalCost: 4 },
  { id: "rain_2x", name: "Штормовой ливень x2", icon: "rain_2x", desc: "Шторм в каньоне: скорость и добыча x2 (60 сек)", durationSec: 60, crystalCost: 3 },
  { id: "auto_tap", name: "Дрон-кликер", icon: "auto_tap", desc: "Авто-клик по реке 3 раза/сек (45 сек)", durationSec: 45, crystalCost: 3 },
  { id: "cash_pack", name: "Фонд развития", icon: "cash_pack", desc: "Мгновенно +120 сек текущего дохода (мин. $500)", durationSec: 0, crystalCost: 5 }
];

export const SHOP_PERK_DEFS = [
  { id: "gold_blades", name: "Титановые лопасти", icon: "gold_blades", desc: "+50% к доходу во всех локациях навсегда", baseCrystalCost: 6, costStep: 5, maxLevel: 10 },
  { id: "crystal_battery", name: "Кристальная батарея", icon: "crystal_battery", desc: "+25% к мощности (Ватт) для быстрого перехода", baseCrystalCost: 8, costStep: 6, maxLevel: 10 },
  { id: "offline_amp", name: "Офлайн-реактор", icon: "offline_amp", desc: "+25% к доходу, пока игра закрыта", baseCrystalCost: 7, costStep: 7, maxLevel: 4 }
];

export const ACHIEVEMENT_DEFS = [
  { id: "ach_tap_25", name: "Первые брызги", desc: "Тапнуть по воде 25 раз", check: (s) => s.profile.totalTaps >= 25, crystals: 3 },
  { id: "ach_cash_10k", name: "Гидро-стартап", desc: "Заработать $10K за всё время", check: (s) => s.lifetimeCash >= 10000, crystals: 4 },
  { id: "ach_s3", name: "Покоритель плотин", desc: "Построить 4-ю станцию (Плотину)", check: (s) => s.stations.s3?.unlocked, crystals: 6 },
  { id: "ach_zone2", name: "Полярный инженер", desc: "Перейти в Снежные вершины", check: (s) => s.unlockedZones.includes("glacier"), crystals: 10 },
  { id: "ach_zone3", name: "Неоновый магнат", desc: "Перейти в Неоновый каньон", check: (s) => s.unlockedZones.includes("cyber"), crystals: 20 }
];

export const AVATAR_CHOICES = ["av_0", "av_1", "av_2", "av_3", "av_4"];

export const QUEST_TEMPLATES = [
  { id: "q_taps", title: "Тапнуть по реке", kind: "taps", target: 15, crystals: 2, cashSec: 45 },
  { id: "q_upgrades", title: "Улучшить станции", kind: "upgrades", target: 5, crystals: 2, cashSec: 75 },
  { id: "q_events", title: "Поймать груз или дрон", kind: "events", target: 1, crystals: 3, cashSec: 90 },
  { id: "q_overdrive", title: "Разогнать Турбо до x2.0", kind: "overdrive", target: 1, crystals: 2, cashSec: 60 }
];

export function getActiveZone(state) {
  return ZONES.find((z) => z.id === state.activeZoneId) || ZONES[0];
}

export function getZoneStations(zoneId) {
  return (ZONES.find((z) => z.id === zoneId) || ZONES[0]).stations;
}

export function getZoneUpgrades(zoneId) {
  return (ZONES.find((z) => z.id === zoneId) || ZONES[0]).upgrades;
}

export function getZoneGoals(zoneId) {
  return (ZONES.find((z) => z.id === zoneId) || ZONES[0]).goals;
}

export function createInitialState(engineers = 0, preserved = null) {
  const zoneId = preserved?.activeZoneId || "valley";
  const zoneStations = getZoneStations(zoneId);
  const zoneUpgrades = getZoneUpgrades(zoneId);

  const stations = {};
  for (let i = 0; i < zoneStations.length; i += 1) {
    const def = zoneStations[i];
    stations[def.id] = {
      unlocked: i === 0,
      level: i === 0 ? 1 : 0,
      cycleProgress: 0,
      totalMined: 0
    };
  }
  const upgrades = {};
  for (const up of zoneUpgrades) {
    upgrades[up.id] = 0;
  }

  const startBonus = (engineers > 0 ? engineers * 120 : 0) + (preserved?.extraStartCash || 0);
  return {
    cash: startBonus,
    runCash: startBonus,
    lifetimeCash: preserved?.lifetimeCash || 0,
    crystals: preserved?.crystals ?? 5,
    engineers,
    activeZoneId: zoneId,
    unlockedZones: preserved?.unlockedZones || ["valley"],
    completedZones: preserved?.completedZones || [],
    stations,
    upgrades,
    shopPerks: preserved?.shopPerks || { gold_blades: 0, crystal_battery: 0, offline_amp: 0 },
    boosters: { turbo_3x: 0, rain_2x: 0, auto_tap: 0 },
    claimedGoals: preserved?.claimedGoals || [],
    claimedAchievements: preserved?.claimedAchievements || [],
    quest: preserved?.quest || { index: 0, progress: 0 },
    profile: preserved?.profile || { name: "Гидро-Мастер", avatar: "av_0", totalTaps: 0, playTimeSec: 0, eventsCaught: 0 },
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
  for (const m of [10, 25, 50, 100]) {
    if (level < m) return m;
  }
  return null;
}

export function getFlowSpeedMultiplier(state) {
  return 1 + (state.upgrades.u0 || 0) * 0.22;
}

export function getBoosterIncomeMultiplier(state) {
  let mult = 1;
  if ((state.boosters?.turbo_3x || 0) > 0) mult *= 3;
  if ((state.boosters?.rain_2x || 0) > 0) mult *= 2;
  return mult;
}

export function getGlobalMultiplier(state) {
  const flowMult = getFlowSpeedMultiplier(state);
  const damMult = 1 + (state.upgrades.u1 || 0) * 0.35;
  const tariffMult = 1 + (state.upgrades.u3 || 0) * 0.4;
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
  const batteryMult = 1 + (state.shopPerks?.crystal_battery || 0) * 0.25;

  const incomePerSec = def.baseIncome * level * milestone * globalMult * boosterMult;
  const watts =
    def.baseWatts * level * milestone * (1 + (state.upgrades.u0 || 0) * 0.2) * batteryMult;

  const rainSpeed = (state.boosters?.rain_2x || 0) > 0 ? 1.6 : 1;
  const speedBoost = (1 + (state.upgrades.u0 || 0) * 0.08) * getOverdriveMultiplier(state) * rainSpeed;
  const effectiveCycleSec = Math.max(0.4, def.cycleSec / speedBoost);
  const payoutPerCycle = incomePerSec * (def.cycleSec / rainSpeed);
  return { incomePerSec, watts, cycleSec: effectiveCycleSec, payoutPerCycle };
}

export function getTotals(state) {
  const zoneStations = getZoneStations(state.activeZoneId);
  let baseIncomePerSec = 0;
  let totalWatts = 0;
  for (const def of zoneStations) {
    const out = getStationOutput(state, def);
    baseIncomePerSec += out.incomePerSec;
    totalWatts += out.watts;
  }
  const overdriveMult = getOverdriveMultiplier(state);
  const effectiveIncomePerSec = baseIncomePerSec * overdriveMult;
  const tapBonus = Math.max(
    1,
    (2.5 + baseIncomePerSec * 0.24) * (1 + (state.upgrades.u2 || 0) * 0.5)
  );
  return { baseIncomePerSec, effectiveIncomePerSec, totalWatts, overdriveMult, tapBonus };
}

export function getCityEraIndex(state, totalWatts) {
  const eras = getActiveZone(state).eras;
  let idx = 0;
  for (let i = 0; i < eras.length; i += 1) {
    if (totalWatts >= eras[i].minWatts) {
      idx = i;
    }
  }
  return idx;
}

export function getPlayerRank(state) {
  if (state.activeZoneId === "cyber") return "Повелитель Неоновой Сети";
  if (state.activeZoneId === "glacier") return "Покоритель Ледников";
  const { totalWatts } = getTotals(state);
  if (totalWatts >= 1800000) return "Архитектор Мегаполиса";
  if (totalWatts >= 75000) return "Главный Энергетик";
  if (totalWatts >= 3000) return "Мастер Турбин";
  if (totalWatts >= 120) return "Гидро-Инженер";
  return "Стажёр на ручье";
}

export function getCurrentGoalProgress(state) {
  const { totalWatts } = getTotals(state);
  const goals = getZoneGoals(state.activeZoneId);
  const claimed = new Set(state.claimedGoals || []);
  for (let i = 0; i < goals.length; i += 1) {
    const goal = goals[i];
    if (!claimed.has(goal.id)) {
      const pct = Math.min(100, (totalWatts / goal.targetWatts) * 100);
      return {
        goal,
        index: i,
        totalGoals: goals.length,
        currentWatts: totalWatts,
        percent: pct,
        completedAll: false
      };
    }
  }
  const last = goals[goals.length - 1];
  return {
    goal: last,
    index: goals.length - 1,
    totalGoals: goals.length,
    currentWatts: totalWatts,
    percent: 100,
    completedAll: true
  };
}

export function checkAndClaimGoals(state) {
  const { totalWatts } = getTotals(state);
  const goals = getZoneGoals(state.activeZoneId);
  if (!Array.isArray(state.claimedGoals)) state.claimedGoals = [];
  const newlyClaimed = [];
  for (const goal of goals) {
    if (!state.claimedGoals.includes(goal.id) && totalWatts >= goal.targetWatts) {
      state.claimedGoals.push(goal.id);
      state.cash += goal.rewardCash;
      state.runCash += goal.rewardCash;
      state.lifetimeCash += goal.rewardCash;
      state.crystals = (state.crystals || 0) + (goal.rewardCrystals || 0);
      newlyClaimed.push(goal);
    }
  }
  return newlyClaimed;
}

export function canAdvanceZone(state) {
  const zone = getActiveZone(state);
  if (!zone.nextZoneId || !zone.nextZoneTargetWatts) return null;
  const { totalWatts } = getTotals(state);
  if (totalWatts < zone.nextZoneTargetWatts) return null;
  return ZONES.find((z) => z.id === zone.nextZoneId) || null;
}

export function advanceToNextZone(state) {
  const curZone = getActiveZone(state);
  const nextZone = canAdvanceZone(state);
  if (!nextZone) return null;

  const unlocked = Array.from(new Set([...(state.unlockedZones || ["valley"]), nextZone.id]));
  const completed = Array.from(new Set([...(state.completedZones || []), curZone.id]));

  const nextState = createInitialState(state.engineers || 0, {
    activeZoneId: nextZone.id,
    unlockedZones: unlocked,
    completedZones: completed,
    lifetimeCash: state.lifetimeCash,
    crystals: (state.crystals || 0) + (nextZone.rewardCrystals || 0),
    shopPerks: state.shopPerks,
    claimedGoals: state.claimedGoals,
    claimedAchievements: state.claimedAchievements,
    profile: state.profile,
    extraStartCash: 100 * nextZone.incomeMult
  });
  Object.assign(state, nextState);
  return nextZone;
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
    return { deltaIncome: after.incomePerSec, deltaWatts: after.watts, nextMilestone: 10 };
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
  const en = getLang() === "en";
  const sec = en ? "s" : "с";
  if (def.kind === "flow") {
    const cur = 1 + lvl * 0.22;
    const nxt = 1 + (lvl + 1) * 0.22;
    return `${en ? "Flow" : "Поток"}: x${cur.toFixed(2)} → x${nxt.toFixed(2)} (+${formatCompact((totals.baseIncomePerSec * 0.22) / cur, "$")}/${sec})`;
  }
  if (def.kind === "dam") {
    const cur = 1 + lvl * 0.35;
    const nxt = 1 + (lvl + 1) * 0.35;
    return `${en ? "Output" : "Мощь"}: x${cur.toFixed(2)} → x${nxt.toFixed(2)} (+${formatCompact((totals.baseIncomePerSec * 0.35) / cur, "$")}/${sec})`;
  }
  if (def.kind === "tap") {
    const curTap = totals.tapBonus;
    const nxtTap = curTap * ((1 + (lvl + 1) * 0.5) / (1 + lvl * 0.5));
    return `${en ? "River Tap" : "Клик по воде"}: ${formatCompact(curTap, "$")} → ${formatCompact(nxtTap, "$")}`;
  }
  if (def.kind === "tariff") {
    const cur = 1 + lvl * 0.4;
    const nxt = 1 + (lvl + 1) * 0.4;
    return `${en ? "Tariff" : "Тариф"}: x${cur.toFixed(1)} → x${nxt.toFixed(1)} (+${formatCompact((totals.baseIncomePerSec * 0.4) / cur, "$")}/${sec})`;
  }
  return def.targetLabel;
}

export function getBoosterCashCost(state, boosterDef) {
  const { effectiveIncomePerSec } = getTotals(state);
  const scale = Math.max(80, effectiveIncomePerSec * 28);
  if (boosterDef.id === "cash_pack") return null;
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
  const threshold = 50000 * getActiveZone(state).incomeMult;
  if (state.runCash < threshold) return 0;
  return Math.max(1, Math.floor(Math.pow(state.runCash / (threshold * 0.5), 0.45)));
}

export function buyStationAction(state, stationId, multMode) {
  const zoneStations = getZoneStations(state.activeZoneId);
  const def = zoneStations.find((d) => d.id === stationId);
  if (!def) return false;
  const st = state.stations[stationId];

  const stationWasUnlocked = st.unlocked;
  if (!st.unlocked) {
    if (state.cash < def.unlockCost) return false;
    state.cash -= def.unlockCost;
    st.unlocked = true;
    st.level = 1;
    st.cycleProgress = 0;
    recordQuestEvent(state, "upgrades", 1);
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
  if (stationWasUnlocked) recordQuestEvent(state, "upgrades", count);
  return true;
}

export function buyUpgradeAction(state, upgradeId) {
  const zoneUpgrades = getZoneUpgrades(state.activeZoneId);
  const def = zoneUpgrades.find((u) => u.id === upgradeId);
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
    completedZones: state.completedZones,
    claimedGoals: state.claimedGoals,
    claimedAchievements: state.claimedAchievements,
    profile: state.profile
  });
  Object.assign(state, next);
  return gained;
}

export function applyTap(state, comboMult = 1) {
  const { tapBonus } = getTotals(state);
  const gained = tapBonus * comboMult;
  state.cash += gained;
  state.runCash += gained;
  state.lifetimeCash += gained;
  state.overdrive = Math.min(1, state.overdrive + 0.16);
  state.profile.totalTaps = (state.profile.totalTaps || 0) + 1;
  recordQuestEvent(state, "taps", 1);
  if (getOverdriveMultiplier(state) >= 2.0) {
    recordQuestEvent(state, "overdrive", 1);
  }
  return gained;
}

export function getActiveQuest(state) {
  if (!state.quest) state.quest = { index: 0, progress: 0 };
  const idx = state.quest.index % QUEST_TEMPLATES.length;
  const tpl = QUEST_TEMPLATES[idx];
  const tierScale = 1 + Math.floor(state.quest.index / QUEST_TEMPLATES.length);
  const target = tpl.kind === "events" || tpl.kind === "overdrive" ? tpl.target : tpl.target * tierScale;
  const { effectiveIncomePerSec } = getTotals(state);
  const rewardCash = Math.max(80 * getActiveZone(state).incomeMult, Math.floor(effectiveIncomePerSec * tpl.cashSec));
  const progress = Math.min(target, state.quest.progress || 0);
  return {
    tpl,
    target,
    progress,
    ready: progress >= target,
    rewardCash,
    rewardCrystals: tpl.crystals
  };
}

export function recordQuestEvent(state, kind, amount = 1) {
  if (!state.quest) state.quest = { index: 0, progress: 0 };
  const q = getActiveQuest(state);
  if (q.tpl.kind === kind && q.progress < q.target) {
    state.quest.progress = Math.min(q.target, q.progress + amount);
  }
}

export function claimQuestReward(state) {
  const q = getActiveQuest(state);
  if (!q.ready) return null;
  state.cash += q.rewardCash;
  state.runCash += q.rewardCash;
  state.lifetimeCash += q.rewardCash;
  state.crystals = (state.crystals || 0) + q.rewardCrystals;
  state.quest.index += 1;
  state.quest.progress = 0;
  return { cash: q.rewardCash, crystals: q.rewardCrystals, title: q.tpl.title };
}

export function collectRiverEventReward(state, eventType) {
  state.profile.eventsCaught = (state.profile.eventsCaught || 0) + 1;
  recordQuestEvent(state, "events", 1);
  const { effectiveIncomePerSec } = getTotals(state);
  if (eventType === "drone") {
    const crystals = 2;
    state.crystals = (state.crystals || 0) + crystals;
    return { type: "drone", cash: 0, crystals };
  }
  const cash = Math.max(120 * getActiveZone(state).incomeMult, Math.floor(effectiveIncomePerSec * 45));
  state.cash += cash;
  state.runCash += cash;
  state.lifetimeCash += cash;
  return { type: "crate", cash, crystals: 0 };
}

export function getOnboardingUnlocks(state) {
  const veteran =
    (state.engineers || 0) > 0 ||
    (state.completedZones?.length || 0) > 0 ||
    state.activeZoneId !== "valley";
  return {
    upgrades: veteran || state.stations.s0?.level >= 2 || state.stations.s1?.unlocked || state.lifetimeCash >= 30,
    shop: veteran || state.stations.s1?.unlocked || state.lifetimeCash >= 150,
    prestige: veteran || state.lifetimeCash >= 2500,
    zones: veteran || state.stations.s1?.unlocked || state.lifetimeCash >= 180
  };
}

export function resetAllProgress(state) {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    // Ignore storage errors
  }
  const fresh = createInitialState(0);
  Object.assign(state, fresh);
  return state;
}

export function tickEconomy(state, dtSeconds) {
  const clampedDt = Math.min(0.25, Math.max(0, dtSeconds));
  state.profile.playTimeSec = (state.profile.playTimeSec || 0) + clampedDt;

  for (const key of ["turbo_3x", "rain_2x", "auto_tap"]) {
    if ((state.boosters?.[key] || 0) > 0) {
      state.boosters[key] = Math.max(0, state.boosters[key] - clampedDt);
    }
  }

  const overdriveMult = getOverdriveMultiplier(state);
  const rainMult = (state.boosters?.rain_2x || 0) > 0 ? 1.6 : 1;
  const flowFactor = 1 + (state.upgrades.u0 || 0) * 0.08;
  const speedBoost = flowFactor * overdriveMult * rainMult;
  const payouts = [];

  for (const def of getZoneStations(state.activeZoneId)) {
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
      completedZones: Array.isArray(parsed.completedZones) ? parsed.completedZones : [],
      claimedGoals: Array.isArray(parsed.claimedGoals) ? parsed.claimedGoals : [],
      claimedAchievements: Array.isArray(parsed.claimedAchievements) ? parsed.claimedAchievements : [],
      quest: parsed.quest || { index: 0, progress: 0 },
      profile: parsed.profile || { name: "Гидро-Мастер", avatar: "av_0", totalTaps: 0, playTimeSec: 0, eventsCaught: 0 }
    });
    fresh.cash = Number(parsed.cash) || 0;
    fresh.runCash = Number(parsed.runCash) || fresh.cash;
    fresh.overdrive = 0;

    if (parsed.stations) {
      for (const def of getZoneStations(fresh.activeZoneId)) {
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
      for (const up of getZoneUpgrades(fresh.activeZoneId)) {
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
