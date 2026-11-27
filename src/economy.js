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
      { id: "s0", name: "Водяное колесо", icon: "s0", desc: "Деревянная мельница в ручье", unlockCost: 0, baseCost: 15, costGrowth: 1.17, baseIncome: 1.0, baseWatts: 10, cycleSec: 2.0 },
      { id: "s1", name: "Двойная турбина", icon: "s1", desc: "Усиленный вал с парой роторов", unlockCost: 180, baseCost: 220, costGrowth: 1.18, baseIncome: 8, baseWatts: 65, cycleSec: 2.4 },
      { id: "s2", name: "Турбина Пелтона", icon: "s2", desc: "Напорная струя высокого давления", unlockCost: 2600, baseCost: 3100, costGrowth: 1.19, baseIncome: 70, baseWatts: 520, cycleSec: 2.7 },
      { id: "s3", name: "Бетонная ГЭС", icon: "s3", desc: "Плотина с мощным водосбросом", unlockCost: 42000, baseCost: 50000, costGrowth: 1.2, baseIncome: 750, baseWatts: 5600, cycleSec: 3.1 },
      { id: "s4", name: "Арочная мега-ГЭС", icon: "s4", desc: "Инженерный каскад в каньоне", unlockCost: 780000, baseCost: 920000, costGrowth: 1.21, baseIncome: 9500, baseWatts: 82000, cycleSec: 3.5 },
      { id: "s5", name: "Гидро-реактор", icon: "s5", desc: "Квантовый генератор чистой воды", unlockCost: 18000000, baseCost: 22000000, costGrowth: 1.22, baseIncome: 150000, baseWatts: 1600000, cycleSec: 4.0 }
    ],
    upgrades: [
      { id: "u0", name: "Напор реки", icon: "flow", targetLabel: "Ускоряет вращение всех колёс", baseCost: 55, costGrowth: 1.65, maxLevel: 40, kind: "flow" },
      { id: "u1", name: "Мощь генераторов", icon: "dam", targetLabel: "Повышает выработку каждой ГЭС", baseCost: 240, costGrowth: 1.75, maxLevel: 35, kind: "dam" },
      { id: "u2", name: "Умная ЛЭП", icon: "tap", targetLabel: "Усиливает тап по воде и разгон", baseCost: 110, costGrowth: 1.6, maxLevel: 35, kind: "tap" },
      { id: "u3", name: "Городской тариф", icon: "tariff", targetLabel: "Поднимает цену за энергию", baseCost: 520, costGrowth: 1.8, maxLevel: 30, kind: "tariff" }
    ],
    goals: [
      { id: "v_1", title: "Осветить деревню", subtitle: "Накопите 120 W", targetWatts: 120, rewardCash: 65, rewardCrystals: 3 },
      { id: "v_2", title: "Запустить посёлок", subtitle: "Достигните 3.0 kW", targetWatts: 3000, rewardCash: 1200, rewardCrystals: 5 },
      { id: "v_3", title: "Запитать Эко-город", subtitle: "Достигните 75 kW", targetWatts: 75000, rewardCash: 28000, rewardCrystals: 8 },
      { id: "v_4", title: "Открыть Снежные вершины", subtitle: "Достигните 1.8 MW для новой главы", targetWatts: 1800000, rewardCash: 650000, rewardCrystals: 10 }
    ]
  },
  {
    id: "glacier",
    index: 1,
    name: "Снежные вершины",
    shortName: "Ледник",
    icon: "glacier",
    incomeMult: 5,
    nextZoneId: "cyber",
    nextZoneTargetWatts: 60000000,
    rewardCrystals: 18,
    desc: "Ледниковый каньон: крио-турбины, термальные ГЭС и северный город",
    eras: [
      { minWatts: 0, name: "Полярный лагерь" },
      { minWatts: 1000, name: "Зимняя деревня" },
      { minWatts: 40000, name: "Горная база" },
      { minWatts: 1200000, name: "Термальный полис" },
      { minWatts: 60000000, name: "Аврора-Мегаполис" }
    ],
    stations: [
      { id: "s0", name: "Ледовое колесо", icon: "s0", desc: "Морозостойкий ледовый ротор", unlockCost: 0, baseCost: 900, costGrowth: 1.19, baseIncome: 1.8, baseWatts: 35, cycleSec: 2.0 },
      { id: "s1", name: "Крио-турбина", icon: "s1", desc: "Спаренный вал с термо-подогревом", unlockCost: 14000, baseCost: 17000, costGrowth: 1.2, baseIncome: 14, baseWatts: 260, cycleSec: 2.4 },
      { id: "s2", name: "Горный водомёт", icon: "s2", desc: "Ледниковая струя под давлением", unlockCost: 240000, baseCost: 290000, costGrowth: 1.21, baseIncome: 125, baseWatts: 2200, cycleSec: 2.7 },
      { id: "s3", name: "Ледниковая дамба", icon: "s3", desc: "Армированная полярная плотина", unlockCost: 4500000, baseCost: 5500000, costGrowth: 1.22, baseIncome: 1400, baseWatts: 24000, cycleSec: 3.1 },
      { id: "s4", name: "Гео-термо ГЭС", icon: "s4", desc: "Энергия пара и горного каскада", unlockCost: 95000000, baseCost: 115000000, costGrowth: 1.23, baseIncome: 18500, baseWatts: 360000, cycleSec: 3.5 },
      { id: "s5", name: "Аврора-реактор", icon: "s5", desc: "Кристалл северного сияния", unlockCost: 2400000000, baseCost: 3000000000, costGrowth: 1.24, baseIncome: 310000, baseWatts: 7500000, cycleSec: 3.9 }
    ],
    upgrades: [
      { id: "u0", name: "Антилёд-подогрев", icon: "flow", targetLabel: "Разгоняет поток сквозь льды", baseCost: 2800, costGrowth: 1.72, maxLevel: 40, kind: "flow" },
      { id: "u1", name: "Ледокол-шлюз", icon: "dam", targetLabel: "Усиливает мощность крио-станций", baseCost: 14000, costGrowth: 1.8, maxLevel: 35, kind: "dam" },
      { id: "u2", name: "Тепловая сеть", icon: "tap", targetLabel: "Усиливает клик и тепловой импульс", baseCost: 6000, costGrowth: 1.68, maxLevel: 35, kind: "tap" },
      { id: "u3", name: "Полярный экспорт", icon: "tariff", targetLabel: "Повышает доход с мегаватт в горах", baseCost: 32000, costGrowth: 1.85, maxLevel: 30, kind: "tariff" }
    ],
    goals: [
      { id: "g_1", title: "Согреть деревню", subtitle: "Выйдите на 1.0 kW", targetWatts: 1000, rewardCash: 2500, rewardCrystals: 4 },
      { id: "g_2", title: "Открыть горную базу", subtitle: "Достигните 40 kW", targetWatts: 40000, rewardCash: 85000, rewardCrystals: 6 },
      { id: "g_3", title: "Термальный полис", subtitle: "Достигните 1.2 MW", targetWatts: 1200000, rewardCash: 2500000, rewardCrystals: 10 },
      { id: "g_4", title: "Открыть Неоновый каньон", subtitle: "Достигните 60 MW для финала", targetWatts: 60000000, rewardCash: 90000000, rewardCrystals: 15 }
    ]
  },
  {
    id: "cyber",
    index: 2,
    name: "Неоновый каньон",
    shortName: "Неон",
    icon: "cyber",
    incomeMult: 25,
    nextZoneId: null,
    nextZoneTargetWatts: null,
    rewardCrystals: 35,
    desc: "Ночной кибер-каньон: плазма-роторы, магнитные шлюзы и мегасити",
    eras: [
      { minWatts: 0, name: "Неоновый аванпост" },
      { minWatts: 10000, name: "Кибер-квартал" },
      { minWatts: 600000, name: "Сектор Омега" },
      { minWatts: 30000000, name: "Хроно-Сити" },
      { minWatts: 2000000000, name: "Орбитальный Мегаполис" }
    ],
    stations: [
      { id: "s0", name: "Плазма-ротор", icon: "s0", desc: "Неоновая турбина высокого тока", unlockCost: 0, baseCost: 48000, costGrowth: 1.21, baseIncome: 3.6, baseWatts: 150, cycleSec: 1.9 },
      { id: "s1", name: "Гипер-турбина", icon: "s1", desc: "Двойное лазерное ускорение", unlockCost: 750000, baseCost: 920000, costGrowth: 1.22, baseIncome: 30, baseWatts: 1200, cycleSec: 2.3 },
      { id: "s2", name: "Магнитный канал", icon: "s2", desc: "Магнитный разгон плазменной воды", unlockCost: 14000000, baseCost: 17000000, costGrowth: 1.23, baseIncome: 270, baseWatts: 11000, cycleSec: 2.6 },
      { id: "s3", name: "Кибер-плотина", icon: "s3", desc: "Голографическая дамба будущего", unlockCost: 280000000, baseCost: 340000000, costGrowth: 1.24, baseIncome: 3000, baseWatts: 140000, cycleSec: 3.0 },
      { id: "s4", name: "Орбитальный шлюз", icon: "s4", desc: "Гравитационный гидро-каскад", unlockCost: 6200000000, baseCost: 7600000000, costGrowth: 1.25, baseIncome: 42000, baseWatts: 2200000, cycleSec: 3.4 },
      { id: "s5", name: "Сингулярность ГЭС", icon: "s5", desc: "Главный реактор мегасити", unlockCost: 180000000000, baseCost: 220000000000, costGrowth: 1.26, baseIncome: 720000, baseWatts: 55000000, cycleSec: 3.8 }
    ],
    upgrades: [
      { id: "u0", name: "Плазменный поток", icon: "flow", targetLabel: "Разгоняет поток в неон-канале", baseCost: 140000, costGrowth: 1.75, maxLevel: 40, kind: "flow" },
      { id: "u1", name: "Нано-генерация", icon: "dam", targetLabel: "Умножает добычу кибер-станций", baseCost: 700000, costGrowth: 1.85, maxLevel: 35, kind: "dam" },
      { id: "u2", name: "Нейро-клик", icon: "tap", targetLabel: "Максимизирует импульс клика", baseCost: 300000, costGrowth: 1.7, maxLevel: 35, kind: "tap" },
      { id: "u3", name: "Мега-контракт", icon: "tariff", targetLabel: "Премиальный тариф мегасити", baseCost: 1600000, costGrowth: 1.88, maxLevel: 30, kind: "tariff" }
    ],
    goals: [
      { id: "c_1", title: "Зажечь Кибер-квартал", subtitle: "Выйдите на 10 kW", targetWatts: 10000, rewardCash: 120000, rewardCrystals: 5 },
      { id: "c_2", title: "Питание Сектора Омега", subtitle: "Достигните 600 kW", targetWatts: 600000, rewardCash: 5500000, rewardCrystals: 8 },
      { id: "c_3", title: "Запустить Хроно-Сити", subtitle: "Достигните 30 MW", targetWatts: 30000000, rewardCash: 220000000, rewardCrystals: 15 },
      { id: "c_4", title: "Орбитальный Мегаполис", subtitle: "Финал: достигните 2.0 GW", targetWatts: 2000000000, rewardCash: 12000000000, rewardCrystals: 40 }
    ]
  }
];

export const BOOSTER_DEFS = [
  { id: "turbo_3x", name: "Турбо-поток x3", icon: "turbo_3x", desc: "Утроение дохода от всех ГЭС на 30 сек", durationSec: 30, crystalCost: 4 },
  { id: "rain_2x", name: "Штормовой ливень x2", icon: "rain_2x", desc: "Шторм в каньоне: скорость и добыча x2 (60 сек)", durationSec: 60, crystalCost: 3 },
  { id: "auto_tap", name: "Дрон-кликер", icon: "auto_tap", desc: "Авто-клик по реке 3 раза/сек (45 сек)", durationSec: 45, crystalCost: 3 },
  { id: "cash_pack", name: "Фонд развития", icon: "cash_pack", desc: "Мгновенно +60 сек текущего дохода (мин. $250)", durationSec: 0, crystalCost: 5 }
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
  { id: "q_taps", title: "Тапнуть по реке", kind: "taps", target: 15, crystals: 2, cashSec: 20 },
  { id: "q_upgrades", title: "Улучшить станции", kind: "upgrades", target: 5, crystals: 2, cashSec: 30 },
  { id: "q_events", title: "Поймать груз или дрон", kind: "events", target: 1, crystals: 3, cashSec: 40 },
  { id: "q_overdrive", title: "Разогнать Турбо до x2.0", kind: "overdrive", target: 1, crystals: 2, cashSec: 25 }
];

export const DAILY_REWARDS = [
  { day: 1, crystals: 3, cashSec: 30 },
  { day: 2, crystals: 4, cashSec: 45 },
  { day: 3, crystals: 6, cashSec: 60 },
  { day: 4, crystals: 8, cashSec: 90 },
  { day: 5, crystals: 10, cashSec: 120 },
  { day: 6, crystals: 12, cashSec: 150 },
  { day: 7, crystals: 20, cashSec: 240 }
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

  const safeEngineers = Math.max(0, Number(engineers) || 0);
  const startBonus =
    (safeEngineers > 0 ? safeEngineers * 120 : 0) +
    (preserved?.extraStartCash ?? 20);
  return {
    cash: startBonus,
    runCash: startBonus,
    lifetimeCash: preserved?.lifetimeCash || 0,
    crystals: preserved?.crystals ?? 5,
    engineers: safeEngineers,
    architects: Math.max(0, Number(preserved?.architects) || 0),
    ascension: Math.max(0, Number(preserved?.ascension) || 0),
    activeZoneId: zoneId,
    unlockedZones: preserved?.unlockedZones || ["valley"],
    completedZones: preserved?.completedZones || [],
    stations,
    upgrades,
    shopPerks: preserved?.shopPerks || { gold_blades: 0, crystal_battery: 0, offline_amp: 0 },
    boosters: preserved?.boosters || { turbo_3x: 0, rain_2x: 0, auto_tap: 0 },
    claimedGoals: preserved?.claimedGoals || [],
    claimedAchievements: preserved?.claimedAchievements || [],
    quest: preserved?.quest || { index: 0, progress: 0 },
    daily: preserved?.daily || { streak: 0, lastClaimDate: "" },
    surge: { active: false, timeLeft: 0, taps: 0, targetTaps: 18, cooldown: 50 },
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
  if (level >= 50) mult *= 2;
  if (level >= 100) mult *= 3;
  if (level >= 150) mult *= 2;
  if (level >= 200) mult *= 2;
  if (level >= 300) mult *= 3;
  return mult;
}

export function getNextMilestoneLevel(level) {
  for (const m of [10, 25, 50, 100, 150, 200, 300]) {
    if (level < m) return m;
  }
  return null;
}

export function getFlowSpeedMultiplier(state) {
  return 1 + (state.upgrades.u0 || 0) * 0.14;
}

export function getBoosterIncomeMultiplier(state) {
  let mult = 1;
  if ((state.boosters?.turbo_3x || 0) > 0) mult *= 3;
  if ((state.boosters?.rain_2x || 0) > 0) mult *= 2;
  return mult;
}

export function getGlobalMultiplier(state) {
  const flowMult = getFlowSpeedMultiplier(state);
  const damMult = 1 + (state.upgrades.u1 || 0) * 0.22;
  const tariffMult = 1 + (state.upgrades.u3 || 0) * 0.25;
  const engineerMult = 1 + (Number(state.engineers) || 0) * 0.5;
  const perkMult = 1 + (state.shopPerks?.gold_blades || 0) * 0.5;
  const architectMult = Math.pow(2, state.architects || 0);
  const zoneMult = getActiveZone(state).incomeMult;
  return flowMult * damMult * tariffMult * engineerMult * perkMult * architectMult * zoneMult;
}

export function getOverdriveMultiplier(state) {
  return 1 + Math.min(1, Math.max(0, state.overdrive)) * 1.5;
}

export function getStationOutput(state, def, levelOverride = null) {
  const st = state.stations[def.id];
  const level = levelOverride !== null ? levelOverride : st?.level || 0;
  const unlocked = levelOverride !== null ? level > 0 : Boolean(st?.unlocked && level > 0);
  if (!unlocked || level <= 0) {
    return { incomePerSec: 0, unboostedIncomePerSec: 0, watts: 0, cycleSec: def.cycleSec, payoutPerCycle: 0 };
  }
  const milestone = getMilestoneMultiplier(level);
  const globalMult = getGlobalMultiplier(state);
  const boosterMult = getBoosterIncomeMultiplier(state);
  const batteryMult = (1 + (state.shopPerks?.crystal_battery || 0) * 0.25) * Math.pow(2, state.architects || 0);

  const unboostedIncomePerSec = def.baseIncome * level * milestone * globalMult;
  const incomePerSec = unboostedIncomePerSec * boosterMult;
  const watts =
    def.baseWatts * level * milestone * (1 + (state.upgrades.u0 || 0) * 0.16) * batteryMult;

  const rainSpeed = (state.boosters?.rain_2x || 0) > 0 ? 1.5 : 1;
  const flowFactor = 1 + (state.upgrades.u0 || 0) * 0.08;
  const speedBoost = flowFactor * getOverdriveMultiplier(state) * rainSpeed;
  const effectiveCycleSec = Math.max(0.4, def.cycleSec / speedBoost);
  const payoutPerCycle = (incomePerSec * def.cycleSec) / (flowFactor * rainSpeed);
  return { incomePerSec, unboostedIncomePerSec, watts, cycleSec: effectiveCycleSec, payoutPerCycle };
}

export function getTotals(state) {
  const zoneStations = getZoneStations(state.activeZoneId);
  let baseIncomePerSec = 0;
  let unboostedIncomePerSec = 0;
  let totalWatts = 0;
  for (const def of zoneStations) {
    const out = getStationOutput(state, def);
    baseIncomePerSec += out.incomePerSec;
    unboostedIncomePerSec += out.unboostedIncomePerSec;
    totalWatts += out.watts;
  }
  const overdriveMult = getOverdriveMultiplier(state);
  const effectiveIncomePerSec = baseIncomePerSec * overdriveMult;
  // Taps scale gently on unboosted idle output so taps help early without overshadowing high-tier dams or exploiting boosters
  const tapBonus = Math.max(
    1,
    (1.0 + unboostedIncomePerSec * 0.08) * (1 + Math.min(2.2, (state.upgrades.u2 || 0) * 0.12))
  );
  return { baseIncomePerSec, unboostedIncomePerSec, effectiveIncomePerSec, totalWatts, overdriveMult, tapBonus };
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

function effectiveGoalTarget(state, goal) {
  if (state.activeZoneId === "cyber" && (state.ascension || 0) > 0) {
    return goal.targetWatts * Math.pow(10, state.ascension);
  }
  return goal.targetWatts;
}

export function getCurrentGoalProgress(state) {
  const { totalWatts } = getTotals(state);
  const goals = getZoneGoals(state.activeZoneId);
  const claimed = new Set(state.claimedGoals || []);
  for (let i = 0; i < goals.length; i += 1) {
    const rawGoal = goals[i];
    if (!claimed.has(rawGoal.id)) {
      const targetWatts = effectiveGoalTarget(state, rawGoal);
      const pct = Math.min(100, (totalWatts / targetWatts) * 100);
      return {
        goal: { ...rawGoal, targetWatts },
        index: i,
        totalGoals: goals.length,
        currentWatts: totalWatts,
        percent: pct,
        completedAll: false
      };
    }
  }
  const last = goals[goals.length - 1];
  const lastTarget = effectiveGoalTarget(state, last);
  return {
    goal: { ...last, targetWatts: lastTarget },
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
    const targetWatts = effectiveGoalTarget(state, goal);
    if (!state.claimedGoals.includes(goal.id) && totalWatts >= targetWatts) {
      state.claimedGoals.push(goal.id);
      state.cash += goal.rewardCash;
      state.runCash += goal.rewardCash;
      state.lifetimeCash += goal.rewardCash;
      state.crystals = (state.crystals || 0) + (goal.rewardCrystals || 0);
      newlyClaimed.push({ ...goal, targetWatts });
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

  const pendingEng = computePendingEngineers(state);
  const totalEng = (Number(state.engineers) || 0) + pendingEng;
  const unlocked = Array.from(new Set([...(state.unlockedZones || ["valley"]), nextZone.id]));
  const completed = Array.from(new Set([...(state.completedZones || []), curZone.id]));

  const nextState = createInitialState(totalEng, {
    activeZoneId: nextZone.id,
    unlockedZones: unlocked,
    completedZones: completed,
    lifetimeCash: state.lifetimeCash,
    crystals: (state.crystals || 0) + (nextZone.rewardCrystals || 0),
    architects: state.architects || 0,
    ascension: state.ascension || 0,
    shopPerks: state.shopPerks,
    boosters: { ...(state.boosters || { turbo_3x: 0, rain_2x: 0, auto_tap: 0 }) },
    quest: state.quest,
    claimedGoals: state.claimedGoals,
    claimedAchievements: state.claimedAchievements,
    profile: state.profile,
    extraStartCash: 100 * nextZone.incomeMult
  });
  Object.assign(state, nextState);
  return { ...nextZone, gainedEngineers: pendingEng };
}

export function getArchitectTargetWatts(state) {
  const cyberGoal = 2000000000;
  return cyberGoal * Math.pow(10, state.ascension || 0);
}

export function canTriggerArchitect(state) {
  if (state.activeZoneId !== "cyber") return false;
  return getTotals(state).totalWatts >= getArchitectTargetWatts(state);
}

export function triggerArchitectAscension(state) {
  if (!canTriggerArchitect(state)) return 0;
  const gained = 1;
  const nextArchitects = (state.architects || 0) + gained;
  const nextAscension = (state.ascension || 0) + 1;
  const next = createInitialState(0, {
    activeZoneId: "valley",
    unlockedZones: ["valley"],
    completedZones: [],
    lifetimeCash: state.lifetimeCash,
    crystals: (state.crystals || 0) + 25,
    architects: nextArchitects,
    ascension: nextAscension,
    shopPerks: state.shopPerks,
    boosters: { ...(state.boosters || { turbo_3x: 0, rain_2x: 0, auto_tap: 0 }) },
    quest: state.quest,
    claimedGoals: [],
    claimedAchievements: state.claimedAchievements,
    profile: state.profile,
    extraStartCash: 20
  });
  Object.assign(state, next);
  return gained;
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
  let n = Math.max(0, Math.min(200, Math.floor(Math.log(ratio) / Math.log(r))));
  while (n > 0 && getBulkStationCost(def, currentLevel, n) > cash) {
    n -= 1;
  }
  return n;
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
    const cur = 1 + lvl * 0.14;
    const nxt = 1 + (lvl + 1) * 0.14;
    return `${en ? "Flow" : "Поток"}: x${cur.toFixed(2)} → x${nxt.toFixed(2)} (+${formatCompact((totals.baseIncomePerSec * 0.14) / cur, "$")}/${sec})`;
  }
  if (def.kind === "dam") {
    const cur = 1 + lvl * 0.22;
    const nxt = 1 + (lvl + 1) * 0.22;
    return `${en ? "Output" : "Мощь"}: x${cur.toFixed(2)} → x${nxt.toFixed(2)} (+${formatCompact((totals.baseIncomePerSec * 0.22) / cur, "$")}/${sec})`;
  }
  if (def.kind === "tap") {
    const curTap = totals.tapBonus;
    const curU2 = 1 + Math.min(2.2, lvl * 0.12);
    const nxtU2 = 1 + Math.min(2.2, (lvl + 1) * 0.12);
    const nxtTap = curTap * (nxtU2 / curU2);
    return `${en ? "River Tap" : "Клик по воде"}: ${formatCompact(curTap, "$")} → ${formatCompact(nxtTap, "$")}`;
  }
  if (def.kind === "tariff") {
    const cur = 1 + lvl * 0.25;
    const nxt = 1 + (lvl + 1) * 0.25;
    return `${en ? "Tariff" : "Тариф"}: x${cur.toFixed(2)} → x${nxt.toFixed(2)} (+${formatCompact((totals.baseIncomePerSec * 0.25) / cur, "$")}/${sec})`;
  }
  return def.targetLabel;
}

export function getBoosterCashCost(state, boosterDef) {
  const { unboostedIncomePerSec } = getTotals(state);
  const scale = Math.max(80, unboostedIncomePerSec * 28);
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
    const { unboostedIncomePerSec } = getTotals(state);
    const grant = Math.max(250, Math.floor(unboostedIncomePerSec * 60));
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

export function getPrestigeThreshold(state) {
  const zoneMult = getActiveZone(state).incomeMult;
  return 60000 * zoneMult * zoneMult;
}

export function computePendingEngineers(state) {
  const threshold = getPrestigeThreshold(state);
  if (state.runCash < threshold) return 0;
  return Math.max(1, Math.floor(Math.pow(state.runCash / (threshold * 0.5), 0.36)));
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
  const totalEngineers = (Number(state.engineers) || 0) + gained;
  const next = createInitialState(totalEngineers, {
    lifetimeCash: state.lifetimeCash,
    crystals: state.crystals,
    architects: state.architects || 0,
    ascension: state.ascension || 0,
    shopPerks: state.shopPerks,
    boosters: { ...(state.boosters || { turbo_3x: 0, rain_2x: 0, auto_tap: 0 }) },
    quest: state.quest,
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
  if (state.surge?.active) {
    state.surge.taps += 1;
    if (state.surge.taps >= state.surge.targetTaps) {
      const { unboostedIncomePerSec } = getTotals(state);
      const rewardCash = Math.max(180 * getActiveZone(state).incomeMult, Math.floor(unboostedIncomePerSec * 45));
      const rewardCrystals = 3;
      state.cash += rewardCash;
      state.runCash += rewardCash;
      state.lifetimeCash += rewardCash;
      state.crystals = (state.crystals || 0) + rewardCrystals;
      state.surge.active = false;
      state.surge.timeLeft = 0;
      state.surge.cooldown = 75;
      state._surgeWon = { cash: rewardCash, crystals: rewardCrystals };
    }
  }
  return gained;
}

export function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function getDailyStatus(state, todayKey = getTodayKey()) {
  if (!state.daily) state.daily = { streak: 0, lastClaimDate: "" };
  const canClaim = state.daily.lastClaimDate !== todayKey;
  const nextIndex = (state.daily.streak || 0) % DAILY_REWARDS.length;
  return {
    canClaim,
    nextDayIndex: nextIndex,
    streak: state.daily.streak || 0,
    rewards: DAILY_REWARDS
  };
}

export function claimDailyReward(state, todayKey = getTodayKey()) {
  const status = getDailyStatus(state, todayKey);
  if (!status.canClaim) return null;
  const reward = DAILY_REWARDS[status.nextDayIndex];
  const { unboostedIncomePerSec } = getTotals(state);
  const cash = Math.max(150 * getActiveZone(state).incomeMult, Math.floor(unboostedIncomePerSec * reward.cashSec));
  state.cash += cash;
  state.runCash += cash;
  state.lifetimeCash += cash;
  state.crystals = (state.crystals || 0) + reward.crystals;
  state.daily.streak = (state.daily.streak || 0) + 1;
  state.daily.lastClaimDate = todayKey;
  return { day: reward.day, crystals: reward.crystals, cash };
}

export function startCitySurge(state) {
  if (!state.surge) state.surge = { active: false, timeLeft: 0, taps: 0, targetTaps: 18, cooldown: 50 };
  state.surge.active = true;
  state.surge.timeLeft = 15;
  state.surge.taps = 0;
  state.surge.targetTaps = 18;
  return state.surge;
}

export function consumeSurgeEvent(state) {
  const res = state._surgeWon || null;
  state._surgeWon = null;
  return res;
}

export function getActiveQuest(state) {
  if (!state.quest) state.quest = { index: 0, progress: 0 };
  const idx = state.quest.index % QUEST_TEMPLATES.length;
  const tpl = QUEST_TEMPLATES[idx];
  const tierScale = 1 + Math.floor(state.quest.index / QUEST_TEMPLATES.length);
  const target = tpl.kind === "events" || tpl.kind === "overdrive" ? tpl.target : tpl.target * tierScale;
  const { unboostedIncomePerSec } = getTotals(state);
  const rewardCash = Math.max(80 * getActiveZone(state).incomeMult, Math.floor(unboostedIncomePerSec * tpl.cashSec));
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
  const { unboostedIncomePerSec } = getTotals(state);
  if (eventType === "drone") {
    const crystals = 2;
    state.crystals = (state.crystals || 0) + crystals;
    return { type: "drone", cash: 0, crystals };
  }
  const cash = Math.max(120 * getActiveZone(state).incomeMult, Math.floor(unboostedIncomePerSec * 25));
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
  const rainMult = (state.boosters?.rain_2x || 0) > 0 ? 1.5 : 1;
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

  if (!state.surge) state.surge = { active: false, timeLeft: 0, taps: 0, targetTaps: 18, cooldown: 50 };
  if (state.surge.active) {
    state.surge.timeLeft = Math.max(0, state.surge.timeLeft - clampedDt);
    if (state.surge.timeLeft <= 0) {
      state.surge.active = false;
      state.surge.cooldown = 60;
    }
  } else if (getTotals(state).totalWatts >= 120) {
    state.surge.cooldown = Math.max(0, (state.surge.cooldown ?? 50) - clampedDt);
    if (state.surge.cooldown <= 0) {
      startCitySurge(state);
    }
  }

  return payouts;
}

export function formatCompact(value, prefix = "") {
  if (!Number.isFinite(value) || value < 0) return `${prefix}0`;
  const suffixes = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc"];
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
    const fresh = createInitialState(Math.max(0, Number(parsed.engineers) || 0), {
      lifetimeCash: Number(parsed.lifetimeCash) || 0,
      crystals: parsed.crystals ?? 5,
      architects: Math.max(0, Number(parsed.architects) || 0),
      ascension: Math.max(0, Number(parsed.ascension) || 0),
      shopPerks: parsed.shopPerks || { gold_blades: 0, crystal_battery: 0, offline_amp: 0 },
      boosters: {
        turbo_3x: Math.max(0, Number(parsed.boosters?.turbo_3x) || 0),
        rain_2x: Math.max(0, Number(parsed.boosters?.rain_2x) || 0),
        auto_tap: Math.max(0, Number(parsed.boosters?.auto_tap) || 0)
      },
      activeZoneId: parsed.activeZoneId || "valley",
      unlockedZones: Array.isArray(parsed.unlockedZones) ? parsed.unlockedZones : ["valley"],
      completedZones: Array.isArray(parsed.completedZones) ? parsed.completedZones : [],
      claimedGoals: Array.isArray(parsed.claimedGoals) ? parsed.claimedGoals : [],
      claimedAchievements: Array.isArray(parsed.claimedAchievements) ? parsed.claimedAchievements : [],
      quest: parsed.quest || { index: 0, progress: 0 },
      daily: parsed.daily || { streak: 0, lastClaimDate: "" },
      profile: parsed.profile || { name: "Гидро-Мастер", avatar: "av_0", totalTaps: 0, playTimeSec: 0, eventsCaught: 0 },
      extraStartCash: 0
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
    const { unboostedIncomePerSec } = getTotals(fresh);
    const offlineMult = 0.35 + (fresh.shopPerks?.offline_amp || 0) * 0.25;
    const offlineEarned = elapsedSec >= 10 ? unboostedIncomePerSec * elapsedSec * offlineMult : 0;
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
