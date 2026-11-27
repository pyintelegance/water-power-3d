export const LANG_STORAGE_KEY = "water_power_lang";

export function detectDefaultLang() {
  try {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    if (saved === "ru" || saved === "en") return saved;
  } catch {
    // Ignore storage unavailability
  }
  try {
    const nav = (typeof navigator !== "undefined" && (navigator.language || navigator.userLanguage)) || "";
    return /^ru\b/i.test(nav) ? "ru" : "en";
  } catch {
    return "en";
  }
}

let currentLang = detectDefaultLang();

export function getLang() {
  return currentLang;
}

export function setLang(lang) {
  currentLang = lang === "ru" ? "ru" : "en";
  try {
    localStorage.setItem(LANG_STORAGE_KEY, currentLang);
  } catch {
    // Ignore storage unavailability
  }
  if (typeof document !== "undefined" && document.documentElement) {
    document.documentElement.lang = currentLang;
  }
  return currentLang;
}

const UI_STRINGS = {
  ru: {
    pageTitle: "Water Power 3D — Гидро-Тайкун",
    tabStations: "Станции",
    tabUpgrades: "Апгрейды",
    tabShop: "Магазин",
    tabPrestige: "Штат",
    camOverview: "Обзор",
    camStations: "Станции",
    camDam: "Плотина",
    camCity: "Город",
    panOff: "Сдвиг",
    panOn: "Сдвиг ✓",
    titlePan: "Сдвиг камеры пальцем/мышью",
    collapseGoal: "Свернуть цель",
    collapseDrawer: "Свернуть панель",
    titleProfile: "Профиль",
    titleSound: "Звук",
    titleLang: "Язык: RU / EN",
    titleFullscreen: "На весь экран",
    titleDaily: "Ежедневный бонус",
    titleCrystals: "Энерго-кристаллы",
    surgeBanner: "ПИК В ГОРОДЕ! Тапай: {taps}/{target} · {sec}с",
    surgeWinTitle: "ПИК ВЫДЕРЖАН!",
    surgeWinSub: "+{cash} · +{crystals} крист.",
    dailyTitle: "Ежедневные награды",
    dailySub: "Заходи каждый день за кристаллами и фондом развития",
    dailyDay: "День {d}",
    dailyClaim: "Забрать награду",
    dailyDone: "Получено на сегодня",
    toastDaily: "БОНУС ДНЯ {d}",
    overdriveIdle: "ТАПАЙ ПО ВОДЕ ДЛЯ РАЗГОНА (x1.0)",
    overdriveActive: "ТУРБО НАПОР x{mult}",
    comboLabel: "КОМБО x{mult}",
    eventDrone: "Дрон с кристаллами в небе — нажми!",
    eventCrate: "Золотой груз плывёт по реке — забери!",
    questPrefix: "Задание: {title} ({cur}/{target})",
    questClaimBtn: "Забрать +{crystals} крист.",
    onboardingHint: "Нажимай на реку для энергии и прокачай Колесо!",
    pcHints: "<span>Пробел — импульс</span> · <span>WASD — камера</span> · <span>Колёсико — зум</span> · <span>1–4 — вкладки</span>",
    goalFormat: "ЦЕЛЬ {idx}/{total}: {title}",
    goalReward: "Награда: +{cash} · +{crystals} крист.",
    goalAllDoneTitle: "{zone}: все этапы пройдены",
    goalAllDoneSub: "Максимальный уровень энергосети достигнут",
    advanceZoneBtn: "Перейти в «{name}» (x{mult} · +{crystals} крист.)",
    zoneDoneBadge: "{name} ✓",
    zoneReadyBadge: "{name} · Открыта!",
    zoneCurrentBadge: "{name} (x{mult})",
    zoneLockedBadge: "{name} ({req})",
    zoneNextLabel: "Далее",
    actionBuild: "Построить",
    actionUp1: "+1 ур.",
    actionUpN: "+{n} ур.",
    actionUpgrade: "Улучшить",
    actionDone: "Готово",
    actionMax: "МАКС",
    actionActivate: "Активировать",
    actionForCrystals: "За кристаллы",
    actionInstall: "Купить",
    actionInstalled: "Установлено",
    lvlBadge: "Ур. {lvl}",
    notBuilt: "Новое",
    readyToBuild: "Доступно",
    stationOutput: "Добыча: +{cash}/{sec} · {watts}",
    stationGain: "Прирост: +{cash}/{sec} (+{watts}){ms}",
    stationLaunch: "Запуск: +{cash}/{sec} · {watts}",
    milestoneNote: " · x2 на ур.{m}",
    minedTotal: "Добыто: {cash}",
    maxLevel: "Максимальный уровень",
    shopBoostersHead: "Активные бустеры",
    shopPerksHead: "Постоянные модули (для всех локаций)",
    crystalsShort: "крист.",
    crystalCount: "{n} крист.",
    secUnit: "с",
    minUnit: "м",
    prestigeTitle: "Штат главных инженеров",
    prestigeDesc: "Наём инженеров сбрасывает текущий забег в локации, но даёт постоянный бонус <strong>+50%</strong> к доходу во всех локациях. От 2 инженеров включается авто-турбо.",
    prestigeInStaff: "В штате: <strong>{n}</strong> (+{pct}%)",
    prestigePending: "Доступно: <strong>+{n}</strong> (+{pct}%)",
    prestigeBtnHire: "Нанять +{n} инж.",
    prestigeBtnNeed: "Нужно {cash} за забег",
    prestigeBtnSub: "Сбросить и нанять",
    architectTitle: "Ядро Архитектора (Эндгейм)",
    architectDesc: "Сбрасывает все 3 локации в новый цикл (+1) и даёт <strong>+1 Ядро</strong>: постоянный бонус <strong>x2 ко всему доходу и мощности</strong> + 25 кристаллов.",
    architectStats: "Ядра: <strong>{n}</strong> (x{mult}) · Цикл: <strong>Неон +{asc}</strong>",
    architectBtnGo: "Перезапуск Вселенной (+1 Ядро · +25 крист.)",
    architectBtnNeed: "Пройдите Неон ({watts})",
    architectBtnSub: "Новая эра Сверхсети",
    toastArchitect: "АРХИТЕКТОР +1 (x{mult})",
    boosterTurboBadge: "Турбо x3 · {s}с",
    boosterRainBadge: "Шторм x2 · {s}с",
    boosterDroneBadge: "Дрон · {s}с",
    profileTitle: "Профиль энергетика",
    profileNamePlaceholder: "Ваш позывной",
    defaultCallsign: "Гидро-Мастер",
    profileRankPrefix: "Ранг: {rank}",
    statLifetime: "Всего заработано",
    statPower: "Мощность",
    statZone: "Локация",
    statTaps: "Тапов по воде",
    statEngineers: "Инженеры",
    statTime: "Время в игре",
    achHeading: "Достижения",
    resetBtnPrompt: "Сбросить прогресс (Reset)",
    resetConfirmText: "Точно сбросить весь прогресс, локации и постройки?",
    resetCancel: "Отмена",
    resetConfirm: "Да, сбросить",
    zoneModalTitle: "Переход: {name}",
    zoneModalDesc: "{desc}. Бонус: +{crystals} кристаллов и доход x{mult}.",
    zoneResetBullets: "<div>• Деньги, станции и локальные апгрейды стартуют заново</div><div>• Ожидающие инженеры <strong>засчитываются автоматически</strong></div><div>• Откроются <strong>6 новых станций</strong>, <strong>4 улучшения</strong>, кристаллы и бонусы</div>",
    zoneCancel: "Остаться",
    zoneConfirm: "Перейти",
    offlineTitle: "Станция работала автономно",
    offlineAway: "Вы отсутствовали {mins} мин.",
    offlineClaim: "Забрать доход",
    toastDrone: "ДРОН ПОЙМАН",
    toastCrate: "ЭНЕРГО-ГРУЗ",
    toastNewEra: "НОВЫЙ УРОВЕНЬ ГОРОДА",
    toastGoalDone: "ЦЕЛЬ ВЫПОЛНЕНА · +{cash}",
    toastAch: "ДОСТИЖЕНИЕ · +{crystals} крист.",
    toastInvest: "ИНВЕСТИЦИИ",
    toastQuestDone: "ЗАДАНИЕ ВЫПОЛНЕНО",
    toastNewZone: "НОВАЯ ЛОКАЦИЯ x{mult}",
    toastResetTitle: "НОВАЯ ИГРА",
    toastResetSub: "Прогресс полностью сброшен"
  },
  en: {
    pageTitle: "Water Power 3D — Hydro Tycoon",
    tabStations: "Stations",
    tabUpgrades: "Upgrades",
    tabShop: "Shop",
    tabPrestige: "Staff",
    camOverview: "Overview",
    camStations: "Stations",
    camDam: "Dam",
    camCity: "City",
    panOff: "Pan",
    panOn: "Pan ✓",
    titlePan: "Drag to pan camera",
    collapseGoal: "Collapse goal",
    collapseDrawer: "Collapse panel",
    titleProfile: "Profile",
    titleSound: "Sound",
    titleLang: "Language: EN / RU",
    titleFullscreen: "Fullscreen",
    titleDaily: "Daily Bonus",
    titleCrystals: "Energy Crystals",
    surgeBanner: "CITY POWER SURGE! Tap: {taps}/{target} · {sec}s",
    surgeWinTitle: "SURGE CLEARED!",
    surgeWinSub: "+{cash} · +{crystals} gems",
    dailyTitle: "Daily Rewards",
    dailySub: "Check in daily for crystals and venture cash",
    dailyDay: "Day {d}",
    dailyClaim: "Claim Reward",
    dailyDone: "Claimed Today",
    toastDaily: "DAY {d} BONUS",
    overdriveIdle: "TAP THE WATER TO OVERDRIVE (x1.0)",
    overdriveActive: "TURBO FLOW x{mult}",
    comboLabel: "COMBO x{mult}",
    eventDrone: "Crystal Drone overhead — tap!",
    eventCrate: "Golden Cargo floating — claim!",
    questPrefix: "Quest: {title} ({cur}/{target})",
    questClaimBtn: "Claim +{crystals} gems",
    onboardingHint: "Tap the river for cash & upgrade your Water Wheel!",
    pcHints: "<span>Space — impulse</span> · <span>WASD — camera</span> · <span>Wheel — zoom</span> · <span>1–4 — tabs</span>",
    goalFormat: "GOAL {idx}/{total}: {title}",
    goalReward: "Reward: +{cash} · +{crystals} gems",
    goalAllDoneTitle: "{zone}: all stages cleared",
    goalAllDoneSub: "Peak grid capacity reached",
    advanceZoneBtn: "Enter «{name}» (x{mult} · +{crystals} gems)",
    zoneDoneBadge: "{name} ✓",
    zoneReadyBadge: "{name} · Ready!",
    zoneCurrentBadge: "{name} (x{mult})",
    zoneLockedBadge: "{name} ({req})",
    zoneNextLabel: "Next",
    actionBuild: "Build",
    actionUp1: "+1 lvl",
    actionUpN: "+{n} lvl",
    actionUpgrade: "Upgrade",
    actionDone: "Done",
    actionMax: "MAX",
    actionActivate: "Activate",
    actionForCrystals: "Use gems",
    actionInstall: "Buy",
    actionInstalled: "Owned",
    lvlBadge: "Lvl {lvl}",
    notBuilt: "New",
    readyToBuild: "Ready",
    stationOutput: "Output: +{cash}/{sec} · {watts}",
    stationGain: "Gain: +{cash}/{sec} (+{watts}){ms}",
    stationLaunch: "Start: +{cash}/{sec} · {watts}",
    milestoneNote: " · x2 at lvl {m}",
    minedTotal: "Mined: {cash}",
    maxLevel: "Max level",
    shopBoostersHead: "Active Boosters",
    shopPerksHead: "Permanent Modules (all zones)",
    crystalsShort: "gems",
    crystalCount: "{n} gems",
    secUnit: "s",
    minUnit: "m",
    prestigeTitle: "Chief Engineers Staff",
    prestigeDesc: "Hiring engineers resets the current chapter run but grants a permanent <strong>+50%</strong> income bonus across all locations. 2+ engineers unlock auto-turbo.",
    prestigeInStaff: "Hired: <strong>{n}</strong> (+{pct}%)",
    prestigePending: "Available: <strong>+{n}</strong> (+{pct}%)",
    prestigeBtnHire: "Hire +{n} eng.",
    prestigeBtnNeed: "Need {cash} this run",
    prestigeBtnSub: "Reset & Hire",
    architectTitle: "Architect Core (Endgame)",
    architectDesc: "Ascends all 3 chapters into cycle (+1), granting <strong>+1 Core</strong> for a permanent <strong>x2 multiplier to ALL cash & watts</strong> + 25 gems.",
    architectStats: "Cores: <strong>{n}</strong> (x{mult}) · Cycle: <strong>Neon +{asc}</strong>",
    architectBtnGo: "Ascend World (+1 Core · +25 gems)",
    architectBtnNeed: "Clear Neon ({watts})",
    architectBtnSub: "World Ascension",
    toastArchitect: "ARCHITECT +1 (x{mult})",
    boosterTurboBadge: "Turbo x3 · {s}s",
    boosterRainBadge: "Storm x2 · {s}s",
    boosterDroneBadge: "Drone · {s}s",
    profileTitle: "Engineer Profile",
    profileNamePlaceholder: "Your callsign",
    defaultCallsign: "Hydro Master",
    profileRankPrefix: "Rank: {rank}",
    statLifetime: "Lifetime Cash",
    statPower: "Grid Power",
    statZone: "Location",
    statTaps: "Water Taps",
    statEngineers: "Engineers",
    statTime: "Play Time",
    achHeading: "Achievements",
    resetBtnPrompt: "Reset Progress",
    resetConfirmText: "Reset all chapters, stations, and progress?",
    resetCancel: "Cancel",
    resetConfirm: "Yes, Reset",
    zoneModalTitle: "Travel to {name}",
    zoneModalDesc: "{desc}. Bonus: +{crystals} gems and x{mult} income.",
    zoneResetBullets: "<div>• Cash, stations, and local upgrades reset cleanly</div><div>• Pending engineers are <strong>auto-collected</strong> on departure</div><div>• Unlocks <strong>6 new stations</strong>, <strong>4 upgrades</strong>, gems & bonuses</div>",
    zoneCancel: "Stay",
    zoneConfirm: "Travel",
    offlineTitle: "Stations Ran Offline",
    offlineAway: "Away for {mins} min.",
    offlineClaim: "Claim Income",
    toastDrone: "DRONE CAUGHT",
    toastCrate: "ENERGY CRATE",
    toastNewEra: "CITY EVOLVED",
    toastGoalDone: "GOAL COMPLETE · +{cash}",
    toastAch: "ACHIEVEMENT · +{crystals} gems",
    toastInvest: "INVESTMENT",
    toastQuestDone: "QUEST COMPLETE",
    toastNewZone: "NEW CHAPTER x{mult}",
    toastResetTitle: "NEW GAME",
    toastResetSub: "All progress reset"
  }
};

const CONTENT_EN = {
  zones: {
    valley: {
      name: "Green Valley",
      shortName: "Valley",
      desc: "Starting canyon with classic wheels, dams, and eco-city",
      eras: ["Creek Camp", "Riverside Village", "Factory Town", "Eco City", "Green Metropolis"],
      goals: {
        v_1: { title: "Light the Village", subtitle: "Reach 120 W power" },
        v_2: { title: "Power the Town", subtitle: "Reach 3.0 kW power" },
        v_3: { title: "Fuel Eco City", subtitle: "Reach 75 kW power" },
        v_4: { title: "Unlock Snowy Peaks", subtitle: "Reach 1.8 MW for next chapter" }
      },
      stations: {
        s0: { name: "Water Wheel", desc: "Wooden paddle mill in the stream" },
        s1: { name: "Twin Turbine", desc: "Reinforced shaft with dual rotors" },
        s2: { name: "Pelton Runner", desc: "High-pressure jet nozzle turbine" },
        s3: { name: "Concrete Dam", desc: "Gravity dam with heavy spillway" },
        s4: { name: "Arch Mega-Dam", desc: "Engineered canyon hydro cascade" },
        s5: { name: "Hydro Reactor", desc: "Quantum clean-water core" }
      },
      upgrades: {
        u0: { name: "River Current", targetLabel: "Speeds up every water wheel" },
        u1: { name: "Generator Core", targetLabel: "Boosts output of all dams" },
        u2: { name: "Smart Grid", targetLabel: "Powers up river taps & overdrive" },
        u3: { name: "City Tariff", targetLabel: "Raises energy selling price" }
      }
    },
    glacier: {
      name: "Snowy Peaks",
      shortName: "Glacier",
      desc: "Arctic gorge: cryo turbines, geothermal dams & northern city",
      eras: ["Polar Outpost", "Winter Village", "Mountain Base", "Thermal Polis", "Aurora Metropolis"],
      goals: {
        g_1: { title: "Warm the Village", subtitle: "Reach 1.0 kW power" },
        g_2: { title: "Open Mountain Base", subtitle: "Reach 40 kW power" },
        g_3: { title: "Thermal Polis", subtitle: "Reach 1.2 MW power" },
        g_4: { title: "Unlock Neon Canyon", subtitle: "Reach 60 MW for final chapter" }
      },
      stations: {
        s0: { name: "Frost Wheel", desc: "Ice-resistant cryo rotor" },
        s1: { name: "Cryo Turbine", desc: "Twin heated arctic shaft" },
        s2: { name: "Glacier Jet", desc: "Pressurized meltwater cannon" },
        s3: { name: "Ice Barrier Dam", desc: "Reinforced polar retaining dam" },
        s4: { name: "Geothermal Hydro", desc: "Steam & glacial cascade plant" },
        s5: { name: "Aurora Reactor", desc: "Northern lights core crystal" }
      },
      upgrades: {
        u0: { name: "De-Ice Heaters", targetLabel: "Accelerates icy stream flow" },
        u1: { name: "Icebreaker Gate", targetLabel: "Boosts cryo-station power" },
        u2: { name: "Thermal Grid", targetLabel: "Enhances tap & heat surge" },
        u3: { name: "Polar Export", targetLabel: "Higher megawatt export rates" }
      }
    },
    cyber: {
      name: "Neon Canyon",
      shortName: "Neon",
      desc: "Night cyber gorge: plasma rotors, mag-locks & megacity",
      eras: ["Neon Outpost", "Cyber District", "Sector Omega", "Chrono City", "Orbital Megacity"],
      goals: {
        c_1: { title: "Spark Cyber District", subtitle: "Reach 10 kW power" },
        c_2: { title: "Power Sector Omega", subtitle: "Reach 600 kW power" },
        c_3: { title: "Boot Chrono City", subtitle: "Reach 30 MW power" },
        c_4: { title: "Orbital Megacity", subtitle: "Finale: reach 2.0 GW power" }
      },
      stations: {
        s0: { name: "Plasma Rotor", desc: "High-voltage neon wheel" },
        s1: { name: "Hyper Turbine", desc: "Laser-accelerated twin rotor" },
        s2: { name: "Mag-Flow Channel", desc: "Magnetic plasma water accelerator" },
        s3: { name: "Cyber Dam", desc: "Holographic futuristic barrage" },
        s4: { name: "Orbital Sluice", desc: "Gravity-fed hydro cascade" },
        s5: { name: "Singularity Hydro", desc: "Primary megacity quantum core" }
      },
      upgrades: {
        u0: { name: "Plasma Flow", targetLabel: "Boosts neon canal velocity" },
        u1: { name: "Nano-Generators", targetLabel: "Multiplies cyber plant output" },
        u2: { name: "Neuro-Click", targetLabel: "Maximizes tap surge energy" },
        u3: { name: "Mega-Contract", targetLabel: "Premium megacity tariff" }
      }
    }
  },
  boosters: {
    turbo_3x: { name: "Turbo Surge x3", desc: "Triple income from all dams for 30s" },
    rain_2x: { name: "Storm Deluge x2", desc: "Canyon storm: x2 speed & output (60s)" },
    auto_tap: { name: "Auto-Tap Drone", desc: "Auto-taps river 3x/sec (45s)" },
    cash_pack: { name: "Venture Fund", desc: "Instant +60s of income (min $250)" }
  },
  perks: {
    gold_blades: { name: "Titanium Blades", desc: "+50% permanent income across all chapters" },
    crystal_battery: { name: "Crystal Battery", desc: "+25% grid wattage for faster chapter unlocks" },
    offline_amp: { name: "Offline Reactor", desc: "+25% earnings while the game is closed" }
  },
  achievements: {
    ach_tap_25: { name: "First Splashes", desc: "Tap the water 25 times" },
    ach_cash_10k: { name: "Hydro Startup", desc: "Earn $10K lifetime cash" },
    ach_s3: { name: "Dam Conqueror", desc: "Build the 4th station (Dam)" },
    ach_zone2: { name: "Polar Engineer", desc: "Reach Snowy Peaks" },
    ach_zone3: { name: "Neon Tycoon", desc: "Reach Neon Canyon" }
  },
  quests: {
    q_taps: "Tap the river",
    q_upgrades: "Upgrade stations",
    q_events: "Catch cargo or drone",
    q_overdrive: "Reach Turbo x2.0"
  },
  ranks: {
    "Повелитель Неоновой Сети": "Lord of the Neon Grid",
    "Покоритель Ледников": "Glacier Conqueror",
    "Архитектор Мегаполиса": "Metropolis Architect",
    "Главный Энергетик": "Chief Power Officer",
    "Мастер Турбин": "Turbine Master",
    "Гидро-Инженер": "Hydro Engineer",
    "Стажёр на ручье": "Creek Intern"
  }
};

export function t(key, vars = null) {
  const dict = UI_STRINGS[currentLang] || UI_STRINGS.en;
  let str = dict[key] ?? UI_STRINGS.ru[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      str = str.replaceAll(`{${k}}`, String(v));
    }
  }
  return str;
}

export function tZoneField(zone, field) {
  if (currentLang === "ru") return zone[field];
  return CONTENT_EN.zones[zone.id]?.[field] || zone[field];
}

export function tEraName(zone, eraIndex) {
  if (currentLang === "ru") return zone.eras[eraIndex]?.name || "";
  return CONTENT_EN.zones[zone.id]?.eras?.[eraIndex] || zone.eras[eraIndex]?.name || "";
}

export function tGoalField(zoneId, goal, field) {
  if (currentLang === "ru") return goal[field];
  return CONTENT_EN.zones[zoneId]?.goals?.[goal.id]?.[field] || goal[field];
}

export function tStationField(zoneId, def, field) {
  if (currentLang === "ru") return def[field];
  return CONTENT_EN.zones[zoneId]?.stations?.[def.id]?.[field] || def[field];
}

export function tUpgradeField(zoneId, def, field) {
  if (currentLang === "ru") return def[field];
  return CONTENT_EN.zones[zoneId]?.upgrades?.[def.id]?.[field] || def[field];
}

export function tBoosterField(def, field) {
  if (currentLang === "ru") return def[field];
  return CONTENT_EN.boosters[def.id]?.[field] || def[field];
}

export function tPerkField(def, field) {
  if (currentLang === "ru") return def[field];
  return CONTENT_EN.perks[def.id]?.[field] || def[field];
}

export function tAchField(def, field) {
  if (currentLang === "ru") return def[field];
  return CONTENT_EN.achievements[def.id]?.[field] || def[field];
}

export function tQuestTitle(tpl) {
  if (currentLang === "ru") return tpl.title;
  return CONTENT_EN.quests[tpl.id] || tpl.title;
}

export function tRank(ruRank) {
  if (currentLang === "ru") return ruRank;
  return CONTENT_EN.ranks[ruRank] || ruRank;
}
