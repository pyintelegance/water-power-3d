import "./style.css";
import {
  ACHIEVEMENT_DEFS,
  AVATAR_CHOICES,
  BOOSTER_DEFS,
  SHOP_PERK_DEFS,
  ZONES,
  advanceToNextZone,
  applyTap,
  buyBoosterAction,
  buyShopPerkAction,
  buyStationAction,
  buyUpgradeAction,
  canAdvanceZone,
  checkAchievements,
  checkAndClaimGoals,
  computePendingEngineers,
  formatCompact,
  formatWatts,
  getActiveZone,
  getBoosterCashCost,
  getBulkStationCost,
  getCityEraIndex,
  getCurrentGoalProgress,
  getMaxAffordableStationLevels,
  getPlayerRank,
  getShopPerkCost,
  getStationOutput,
  getStationUpgradePreview,
  getTotals,
  getUpgradeCost,
  getUpgradeEffectText,
  getZoneStations,
  getZoneUpgrades,
  loadState,
  saveState,
  tickEconomy,
  triggerPrestige
} from "./economy.js";
import { SoundEngine } from "./audio.js";
import { PlatformBridge } from "./platform.js";
import { WaterPowerWorld } from "./world.js";

const { state, offlineEarned, offlineSeconds } = loadState();
const sound = new SoundEngine();
let userMuted = false;
const platform = new PlatformBridge((paused) => {
  if (paused) {
    sound.setEnabled(false);
    saveState(state);
  } else {
    sound.setEnabled(!userMuted);
  }
});
void platform;

let activeTab = "stations";
let buyMult = "x1";
let lastEraIndex = getCityEraIndex(state, getTotals(state).totalWatts);
let eraToastTimer = null;
let lastStationFloatAt = 0;
let autoTapAcc = 0;
let lastZoneStripSig = "";

// DOM refs
const canvas = document.getElementById("game-canvas");
const tapFxLayer = document.getElementById("tap-fx-layer");
const hudCash = document.getElementById("hud-cash");
const hudIncome = document.getElementById("hud-income");
const hudWatts = document.getElementById("hud-watts");
const hudEra = document.getElementById("hud-era");
const hudCrystals = document.getElementById("hud-crystals");
const goalBanner = document.getElementById("goal-banner");
const goalTitle = document.getElementById("goal-title");
const goalNumbers = document.getElementById("goal-numbers");
const goalFill = document.getElementById("goal-fill");
const goalSub = document.getElementById("goal-sub");
const btnAdvanceZone = document.getElementById("btn-advance-zone");
const zoneStrip = document.getElementById("zone-strip");
const btnGoalCollapse = document.getElementById("btn-goal-collapse");
const overdriveFill = document.getElementById("overdrive-fill");
const overdriveLabel = document.getElementById("overdrive-label");
const activeBoostersEl = document.getElementById("active-boosters");
const btnPanToggle = document.getElementById("btn-pan-toggle");
const cardsList = document.getElementById("cards-list");
const drawer = document.getElementById("drawer");
const btnBuyMult = document.getElementById("btn-buy-mult");
const btnCollapse = document.getElementById("btn-collapse");
const btnProfile = document.getElementById("btn-profile");
const btnSound = document.getElementById("btn-sound");
const eraToast = document.getElementById("era-toast");
const eraToastBadge = document.getElementById("era-toast-badge");
const eraToastTitle = document.getElementById("era-toast-title");
const profileModal = document.getElementById("profile-modal");
const btnCloseProfile = document.getElementById("btn-close-profile");
const avatarPicker = document.getElementById("avatar-picker");
const profileNameInput = document.getElementById("profile-name-input");
const profileRank = document.getElementById("profile-rank");
const profileStatsGrid = document.getElementById("profile-stats-grid");
const achList = document.getElementById("ach-list");
const zoneModal = document.getElementById("zone-modal");
const zoneModalEmoji = document.getElementById("zone-modal-emoji");
const zoneModalTitle = document.getElementById("zone-modal-title");
const zoneModalDesc = document.getElementById("zone-modal-desc");
const btnCancelZone = document.getElementById("btn-cancel-zone");
const btnConfirmZone = document.getElementById("btn-confirm-zone");
const offlineModal = document.getElementById("offline-modal");
const offlineTime = document.getElementById("offline-time");
const offlineReward = document.getElementById("offline-reward");
const btnClaimOffline = document.getElementById("btn-claim-offline");

function spawnTapText(x, y, amount) {
  const el = document.createElement("div");
  el.className = "tap-float";
  el.textContent = `+${formatCompact(amount, "$")}`;
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  tapFxLayer.appendChild(el);
  setTimeout(() => el.remove(), 840);
}

function spawnStationIncomePopup(stationId, amount) {
  const now = performance.now();
  if (now - lastStationFloatAt < 180) return;
  const pos = world.getStationScreenPosition(stationId);
  if (!pos) return;
  const drawerTop = drawer.getBoundingClientRect().top;
  if (pos.y < 140 || pos.y > drawerTop - 16) return;
  lastStationFloatAt = now;

  const el = document.createElement("div");
  el.className = "station-float";
  el.textContent = `+${formatCompact(amount, "$")} ⚡`;
  el.style.left = `${pos.x}px`;
  el.style.top = `${pos.y}px`;
  tapFxLayer.appendChild(el);
  setTimeout(() => el.remove(), 1060);
}

function showBannerToast(badge, title) {
  eraToastBadge.textContent = badge;
  eraToastTitle.textContent = title;
  eraToast.classList.remove("hidden");
  clearTimeout(eraToastTimer);
  eraToastTimer = setTimeout(() => {
    eraToast.classList.add("hidden");
  }, 3000);
}

const world = new WaterPowerWorld(canvas, (x, y) => {
  const earned = applyTap(state);
  sound.playTap();
  spawnTapText(x, y, earned);
  updateHudAndButtons();
});

function renderZoneStrip() {
  const curZone = getActiveZone(state);
  const readyNext = canAdvanceZone(state);
  const sig = `${state.activeZoneId}|${(state.completedZones || []).join(",")}|${readyNext?.id || ""}`;
  if (sig === lastZoneStripSig) return;
  lastZoneStripSig = sig;
  zoneStrip.innerHTML = "";

  for (const z of ZONES) {
    const isCurrent = state.activeZoneId === z.id;
    const isCompleted = state.completedZones?.includes(z.id);
    const chip = document.createElement("div");

    if (isCurrent) {
      chip.className = "zone-chip active";
      chip.textContent = `${z.icon} ${z.name} (x${z.incomeMult})`;
    } else if (isCompleted) {
      chip.className = "zone-chip";
      chip.textContent = `✅ ${z.name}`;
    } else if (readyNext && readyNext.id === z.id) {
      chip.className = "zone-chip active";
      chip.textContent = `🚀 ${z.name} — Готово!`;
    } else {
      chip.className = "zone-chip locked";
      const reqText =
        z.index === curZone.index + 1 && curZone.nextZoneTargetWatts
          ? formatWatts(curZone.nextZoneTargetWatts)
          : "Далее";
      chip.textContent = `🔒 ${z.name} (${reqText})`;
    }
    zoneStrip.appendChild(chip);
  }
}

function renderCards() {
  cardsList.innerHTML = "";
  const zoneStations = getZoneStations(state.activeZoneId);
  const zoneUpgrades = getZoneUpgrades(state.activeZoneId);

  if (activeTab === "stations") {
    for (const def of zoneStations) {
      const st = state.stations[def.id];
      const out = getStationOutput(state, def);

      let cost = 0;
      let actionLabel = "Улучшить";
      let buyCount = 1;

      if (!st.unlocked) {
        cost = def.unlockCost;
        actionLabel = "Построить";
      } else if (buyMult === "x10") {
        buyCount = 10;
        cost = getBulkStationCost(def, st.level, 10);
        actionLabel = "+10 ур.";
      } else if (buyMult === "MAX") {
        buyCount = Math.max(1, getMaxAffordableStationLevels(def, st.level, state.cash));
        cost = getBulkStationCost(def, st.level, buyCount);
        actionLabel = `+${buyCount} ур.`;
      } else {
        cost = getBulkStationCost(def, st.level, 1);
        actionLabel = "+1 ур.";
      }

      const preview = getStationUpgradePreview(state, def, buyCount);
      const milestoneNote =
        st.unlocked && preview.nextMilestone ? ` · x2 на ур.${preview.nextMilestone}` : "";

      const card = document.createElement("div");
      card.className = `card${st.unlocked ? "" : " locked"}`;
      card.innerHTML = `
        <div class="card-left">
          <div class="card-emoji">${def.icon}</div>
          <div class="card-info">
            <div class="card-title">
              <span>${def.name}</span>
              <span class="lvl-badge">${st.unlocked ? `Ур. ${st.level}` : "Закрыто"}</span>
            </div>
            <div class="card-meta">
              ${st.unlocked
          ? `Добыча: +${formatCompact(out.incomePerSec, "$")}/с · ${formatWatts(out.watts)}`
          : def.desc
        }
            </div>
            <div class="card-delta">
              ${st.unlocked
          ? `Апгрейд: +${formatCompact(preview.deltaIncome, "$")}/с (+${formatWatts(preview.deltaWatts)})${milestoneNote}`
          : `Запуск: +${formatCompact(preview.deltaIncome, "$")}/с и ${formatWatts(preview.deltaWatts)}`
        }
            </div>
            ${st.unlocked
          ? `<div class="cycle-row">
                    <div class="cycle-track"><div class="cycle-fill" data-cycle="${def.id}" style="width:${Math.round((st.cycleProgress || 0) * 100)}%"></div></div>
                    <span class="cycle-mined" data-mined="${def.id}">Добыто: ${formatCompact(st.totalMined || 0, "$")}</span>
                  </div>`
          : ""
        }
          </div>
        </div>
        <button class="buy-btn" data-action="station" data-id="${def.id}" data-cost="${cost}">
          <span>${formatCompact(cost, "$")}</span>
          <span class="buy-action">${actionLabel}</span>
        </button>
      `;
      cardsList.appendChild(card);
    }
  } else if (activeTab === "upgrades") {
    for (const up of zoneUpgrades) {
      const lvl = state.upgrades[up.id] || 0;
      const isMax = lvl >= up.maxLevel;
      const cost = isMax ? 0 : getUpgradeCost(up, lvl);
      const effectText = isMax ? "Максимальный уровень достигнут" : getUpgradeEffectText(state, up);

      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <div class="card-left">
          <div class="card-emoji">${up.icon}</div>
          <div class="card-info">
            <div class="card-title">
              <span>${up.name}</span>
              <span class="lvl-badge">${lvl}/${up.maxLevel}</span>
            </div>
            <div class="card-meta">${up.targetLabel}</div>
            <div class="card-delta">${effectText}</div>
          </div>
        </div>
        <button class="buy-btn" data-action="upgrade" data-id="${up.id}" data-cost="${cost}" ${isMax ? "disabled" : ""}>
          <span>${isMax ? "МАКС" : formatCompact(cost, "$")}</span>
          <span class="buy-action">${isMax ? "Готово" : "Улучшить"}</span>
        </button>
      `;
      cardsList.appendChild(card);
    }
  } else if (activeTab === "shop") {
    const bHeader = document.createElement("div");
    bHeader.className = "shop-section-title";
    bHeader.textContent = "⚡ Временные бустеры";
    cardsList.appendChild(bHeader);

    for (const b of BOOSTER_DEFS) {
      const cashCost = getBoosterCashCost(state, b);
      const rem = Math.ceil(state.boosters?.[b.id] || 0);
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <div class="card-left">
          <div class="card-emoji">${b.icon}</div>
          <div class="card-info">
            <div class="card-title">
              <span>${b.name}</span>
              ${rem > 0 ? `<span class="lvl-badge">${rem}с</span>` : ""}
            </div>
            <div class="card-meta">${b.desc}</div>
          </div>
        </div>
        <div class="btn-stack">
          ${cashCost !== null
          ? `<button class="buy-btn" data-action="booster-cash" data-id="${b.id}" data-cost="${cashCost}">
                  <span>${formatCompact(cashCost, "$")}</span>
                  <span class="buy-action">Активировать</span>
                </button>`
          : ""
        }
          <button class="buy-btn crystal-btn" data-action="booster-crystal" data-id="${b.id}" data-crystal-cost="${b.crystalCost}">
            <span>💎 ${b.crystalCost}</span>
            <span class="buy-action">За кристаллы</span>
          </button>
        </div>
      `;
      cardsList.appendChild(card);
    }

    const pHeader = document.createElement("div");
    pHeader.className = "shop-section-title";
    pHeader.textContent = "💎 Постоянные улучшения (работают во всех локациях)";
    cardsList.appendChild(pHeader);

    for (const perk of SHOP_PERK_DEFS) {
      const lvl = state.shopPerks?.[perk.id] || 0;
      const isMax = lvl >= perk.maxLevel;
      const cCost = isMax ? 0 : getShopPerkCost(perk, lvl);
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <div class="card-left">
          <div class="card-emoji">${perk.icon}</div>
          <div class="card-info">
            <div class="card-title">
              <span>${perk.name}</span>
              <span class="lvl-badge">${lvl}/${perk.maxLevel}</span>
            </div>
            <div class="card-meta">${perk.desc}</div>
          </div>
        </div>
        <button class="buy-btn crystal-btn" data-action="perk" data-id="${perk.id}" data-crystal-cost="${cCost}" ${isMax ? "disabled" : ""}>
          <span>${isMax ? "МАКС" : `💎 ${cCost}`}</span>
          <span class="buy-action">${isMax ? "Куплено" : "Купить"}</span>
        </button>
      `;
      cardsList.appendChild(card);
    }
  } else if (activeTab === "prestige") {
    const pending = computePendingEngineers(state);
    const currentBonus = state.engineers * 50;
    const nextBonus = (state.engineers + pending) * 50;
    const reqCash = formatCompact(50000 * getActiveZone(state).incomeMult, "$");

    const hero = document.createElement("div");
    hero.className = "prestige-hero";
    hero.innerHTML = `
      <h3>👷 Главные инженеры</h3>
      <p>Нанимайте инженеров: каждый даёт <strong>+50%</strong> к доходу во всех локациях навсегда. От 2 инженеров работает авто-турбо.</p>
      <div class="prestige-stats">
        <span>Сейчас: <strong>${state.engineers}</strong> (+${currentBonus}%)</span>
        <span>Доступно: <strong>+${pending}</strong> (+${nextBonus}%)</span>
      </div>
      <button class="buy-btn ${pending > 0 ? "can-afford" : "cannot-afford"}" style="width:100%" data-action="prestige" ${pending <= 0 ? "disabled" : ""}>
        <span>${pending > 0 ? `Нанять +${pending} инж.` : `Нужно ${reqCash} за забег`}</span>
        <span class="buy-action">Сброс и усиление</span>
      </button>
    `;
    cardsList.appendChild(hero);
  }

  refreshButtonStates();
}

function refreshButtonStates() {
  for (const btn of cardsList.querySelectorAll(".buy-btn[data-cost]")) {
    if (btn.disabled && btn.dataset.action === "upgrade") {
      btn.classList.remove("can-afford");
      btn.classList.add("cannot-afford");
      continue;
    }
    const cost = Number(btn.dataset.cost || 0);
    const affordable = state.cash >= cost;
    btn.classList.toggle("can-afford", affordable);
    btn.classList.toggle("cannot-afford", !affordable);
  }
  for (const btn of cardsList.querySelectorAll(".buy-btn[data-crystal-cost]")) {
    if (btn.disabled) {
      btn.classList.remove("can-afford");
      btn.classList.add("cannot-afford");
      continue;
    }
    const cCost = Number(btn.dataset.crystalCost || 0);
    const affordable = (state.crystals || 0) >= cCost;
    btn.classList.toggle("can-afford", affordable);
    btn.classList.toggle("cannot-afford", !affordable);
  }
}

function refreshMiningBars() {
  if (activeTab !== "stations") return;
  for (const def of getZoneStations(state.activeZoneId)) {
    const st = state.stations[def.id];
    if (!st || !st.unlocked) continue;
    const fill = cardsList.querySelector(`.cycle-fill[data-cycle="${def.id}"]`);
    const mined = cardsList.querySelector(`.cycle-mined[data-mined="${def.id}"]`);
    if (fill) fill.style.width = `${Math.round((st.cycleProgress || 0) * 100)}%`;
    if (mined) mined.textContent = `Добыто: ${formatCompact(st.totalMined || 0, "$")}`;
  }
}

function renderActiveBoostersHud() {
  const pills = [];
  if ((state.boosters?.turbo_3x || 0) > 0) pills.push(`🚀 x3: ${Math.ceil(state.boosters.turbo_3x)}с`);
  if ((state.boosters?.rain_2x || 0) > 0) pills.push(`🌧️ x2: ${Math.ceil(state.boosters.rain_2x)}с`);
  if ((state.boosters?.auto_tap || 0) > 0) pills.push(`🤖 Авто: ${Math.ceil(state.boosters.auto_tap)}с`);
  if (pills.length === 0) {
    activeBoostersEl.classList.add("hidden");
    activeBoostersEl.innerHTML = "";
  } else {
    activeBoostersEl.classList.remove("hidden");
    activeBoostersEl.innerHTML = pills.map((p) => `<span class="booster-badge">${p}</span>`).join("");
  }
}

function renderProfileModal() {
  btnProfile.textContent = state.profile.avatar || "👷";
  avatarPicker.innerHTML = "";
  for (const av of AVATAR_CHOICES) {
    const btn = document.createElement("button");
    btn.className = `avatar-opt${state.profile.avatar === av ? " selected" : ""}`;
    btn.textContent = av;
    btn.dataset.avatar = av;
    avatarPicker.appendChild(btn);
  }
  profileNameInput.value = state.profile.name || "Гидро-Мастер";
  profileRank.textContent = `🏅 Ранг: ${getPlayerRank(state)}`;

  const totals = getTotals(state);
  const mins = Math.floor((state.profile.playTimeSec || 0) / 60);
  const secs = Math.floor((state.profile.playTimeSec || 0) % 60);

  profileStatsGrid.innerHTML = `
    <div class="pstat"><div class="pstat-label">Всего заработано</div><div class="pstat-val">${formatCompact(state.lifetimeCash, "$")}</div></div>
    <div class="pstat"><div class="pstat-label">Мощность сейчас</div><div class="pstat-val">${formatWatts(totals.totalWatts)}</div></div>
    <div class="pstat"><div class="pstat-label">Локация</div><div class="pstat-val">${getActiveZone(state).icon} ${getActiveZone(state).name}</div></div>
    <div class="pstat"><div class="pstat-label">Тапов по воде</div><div class="pstat-val">${state.profile.totalTaps || 0}</div></div>
    <div class="pstat"><div class="pstat-label">Инженеры</div><div class="pstat-val">${state.engineers}</div></div>
    <div class="pstat"><div class="pstat-label">Время в игре</div><div class="pstat-val">${mins}м ${secs}с</div></div>
  `;

  achList.innerHTML = "";
  for (const ach of ACHIEVEMENT_DEFS) {
    const done = state.claimedAchievements.includes(ach.id);
    const row = document.createElement("div");
    row.className = `ach-item${done ? " done" : ""}`;
    row.innerHTML = `
      <div>
        <strong>${done ? "✅" : "⬜"} ${ach.name}</strong>
        <div style="color:var(--text-muted);font-size:10px">${ach.desc}</div>
      </div>
      <span style="font-weight:800;color:#e9d5ff">💎 +${ach.crystals}</span>
    `;
    achList.appendChild(row);
  }
}

function openZoneTransitionModal() {
  const nextZone = canAdvanceZone(state);
  if (!nextZone) return;
  zoneModalEmoji.textContent = `${nextZone.icon}🚀`;
  zoneModalTitle.textContent = `Переход: ${nextZone.name}`;
  zoneModalDesc.textContent = `${nextZone.desc}. Бонус за переход: +${nextZone.rewardCrystals} 💎 и доход x${nextZone.incomeMult}!`;
  zoneModal.classList.remove("hidden");
}

function updateHudAndButtons() {
  const curZone = getActiveZone(state);
  const totals = getTotals(state);
  hudCash.textContent = formatCompact(state.cash, "$");
  hudIncome.textContent = `+${formatCompact(totals.effectiveIncomePerSec, "$")}/с`;
  hudWatts.textContent = formatWatts(totals.totalWatts);
  hudCrystals.textContent = `💎 ${state.crystals || 0}`;
  btnProfile.textContent = state.profile.avatar || "👷";

  const eraIdx = getCityEraIndex(state, totals.totalWatts);
  hudEra.textContent = curZone.eras[eraIdx].name;
  if (eraIdx > lastEraIndex) {
    lastEraIndex = eraIdx;
    sound.playUnlock();
    showBannerToast("НОВАЯ ЭРА ГОРОДА!", curZone.eras[eraIdx].name);
  } else if (eraIdx < lastEraIndex) {
    lastEraIndex = eraIdx;
  }

  const claimed = checkAndClaimGoals(state);
  if (claimed.length > 0) {
    const lastGoal = claimed[claimed.length - 1];
    sound.playUnlock();
    showBannerToast(
      `ЦЕЛЬ ВЫПОЛНЕНА! +${formatCompact(lastGoal.rewardCash, "$")} · +${lastGoal.rewardCrystals || 0} 💎`,
      lastGoal.title
    );
  }

  const newAchs = checkAchievements(state);
  if (newAchs.length > 0) {
    sound.playUnlock();
    showBannerToast(`ДОСТИЖЕНИЕ! +${newAchs[0].crystals} 💎`, newAchs[0].name);
  }

  const goalInfo = getCurrentGoalProgress(state);
  const readyNext = canAdvanceZone(state);

  if (readyNext) {
    btnAdvanceZone.classList.remove("hidden");
    btnAdvanceZone.textContent = `🚀 Перейти в «${readyNext.name}» (доход x${readyNext.incomeMult} · +${readyNext.rewardCrystals} 💎)`;
  } else {
    btnAdvanceZone.classList.add("hidden");
  }

  if (goalInfo.completedAll && !readyNext) {
    goalTitle.textContent = `🏆 ${curZone.name}: все цели пройдены!`;
    goalNumbers.textContent = formatWatts(goalInfo.currentWatts);
    goalFill.style.width = "100%";
    goalSub.textContent = "Вы достигли вершины энергетической империи!";
  } else {
    goalTitle.textContent = `🎯 ${curZone.icon} ЦЕЛЬ ${goalInfo.index + 1}/${goalInfo.totalGoals}: ${goalInfo.goal.title}`;
    goalNumbers.textContent = `${formatWatts(goalInfo.currentWatts)} / ${formatWatts(goalInfo.goal.targetWatts)}`;
    goalFill.style.width = `${goalInfo.percent.toFixed(1)}%`;
    goalSub.textContent = `Награда: +${formatCompact(goalInfo.goal.rewardCash, "$")} · +${goalInfo.goal.rewardCrystals || 0} 💎`;
  }

  renderZoneStrip();

  const pct = Math.round(state.overdrive * 100);
  overdriveFill.style.width = `${pct}%`;
  overdriveLabel.textContent =
    state.overdrive > 0.02
      ? `⚡ ТУРБО НАПОР x${totals.overdriveMult.toFixed(1)}`
      : "⚡ ТАПАЙ ПО ВОДЕ ДЛЯ РАЗГОНА (x1.0)";

  renderActiveBoostersHud();

  if (activeTab === "stations" && buyMult === "MAX") {
    renderCards();
  } else {
    refreshButtonStates();
    refreshMiningBars();
  }
}

// Event handlers
cardsList.addEventListener("click", (e) => {
  const btn = e.target.closest(".buy-btn");
  if (!btn) return;

  const action = btn.dataset.action;
  const id = btn.dataset.id;

  if (action === "station") {
    const wasUnlocked = state.stations[id]?.unlocked;
    if (buyStationAction(state, id, buyMult)) {
      if (!wasUnlocked) sound.playUnlock();
      else sound.playBuy();
      world.triggerStationPulse(id);
      saveState(state);
      renderCards();
      updateHudAndButtons();
    }
  } else if (action === "upgrade") {
    if (buyUpgradeAction(state, id)) {
      sound.playBuy();
      saveState(state);
      renderCards();
      updateHudAndButtons();
    }
  } else if (action === "booster-cash" || action === "booster-crystal") {
    const mode = action === "booster-crystal" ? "crystals" : "cash";
    const res = buyBoosterAction(state, id, mode);
    if (res.ok) {
      sound.playUnlock();
      if (res.cashGranted > 0) {
        showBannerToast("ИНВЕСТИЦИИ!", `+${formatCompact(res.cashGranted, "$")}`);
      }
      saveState(state);
      renderCards();
      updateHudAndButtons();
    }
  } else if (action === "perk") {
    if (buyShopPerkAction(state, id)) {
      sound.playUnlock();
      saveState(state);
      renderCards();
      updateHudAndButtons();
    }
  } else if (action === "prestige") {
    if (triggerPrestige(state) > 0) {
      sound.playUnlock();
      saveState(state);
      renderCards();
      updateHudAndButtons();
    }
  }
});

btnAdvanceZone.addEventListener("click", openZoneTransitionModal);
btnCancelZone.addEventListener("click", () => zoneModal.classList.add("hidden"));
btnConfirmZone.addEventListener("click", () => {
  const nextZone = advanceToNextZone(state);
  if (nextZone) {
    zoneModal.classList.add("hidden");
    lastEraIndex = 0;
    sound.playUnlock();
    world.setZoneTheme(state.activeZoneId);
    showBannerToast(`НОВАЯ ЛОКАЦИЯ x${nextZone.incomeMult}!`, `${nextZone.icon} ${nextZone.name}`);
    saveState(state);
    renderCards();
    updateHudAndButtons();
  }
});

document.querySelector(".cam-bar").addEventListener("click", (e) => {
  const camBtn = e.target.closest(".cam-btn");
  if (camBtn) {
    const camIdx = Number(camBtn.dataset.cam || 0);
    world.setCameraPreset(camIdx);
    document.querySelectorAll(".cam-btn").forEach((b) => {
      b.classList.toggle("active", b === camBtn);
    });
    return;
  }

  if (e.target.closest("#btn-pan-toggle")) {
    const next = !world.panEnabled;
    world.setPanEnabled(next);
    btnPanToggle.classList.toggle("active", next);
    btnPanToggle.setAttribute("aria-pressed", String(next));
    btnPanToggle.textContent = next ? "✋ Двигать: ВКЛ" : "✋ Двигать: ВЫКЛ";
  }
});

btnGoalCollapse.addEventListener("click", () => {
  const collapsed = goalBanner.classList.toggle("collapsed");
  document.body.classList.toggle("goal-collapsed", collapsed);
});

document.querySelector(".tabs").addEventListener("click", (e) => {
  const tab = e.target.closest(".tab-btn");
  if (!tab) return;
  activeTab = tab.dataset.tab;
  document.querySelectorAll(".tab-btn").forEach((b) => {
    b.classList.toggle("active", b === tab);
  });
  drawer.classList.remove("collapsed");
  renderCards();
});

btnBuyMult.addEventListener("click", () => {
  const modes = ["x1", "x10", "MAX"];
  buyMult = modes[(modes.indexOf(buyMult) + 1) % modes.length];
  btnBuyMult.textContent = buyMult;
  renderCards();
});

btnCollapse.addEventListener("click", () => drawer.classList.toggle("collapsed"));

btnProfile.addEventListener("click", () => {
  renderProfileModal();
  profileModal.classList.remove("hidden");
});
btnCloseProfile.addEventListener("click", () => {
  profileModal.classList.add("hidden");
  saveState(state);
});
avatarPicker.addEventListener("click", (e) => {
  const opt = e.target.closest(".avatar-opt");
  if (!opt) return;
  state.profile.avatar = opt.dataset.avatar;
  renderProfileModal();
  saveState(state);
});
profileNameInput.addEventListener("input", () => {
  state.profile.name = profileNameInput.value.trim() || "Гидро-Мастер";
});

btnSound.addEventListener("click", () => {
  userMuted = !userMuted;
  sound.setEnabled(!userMuted);
  btnSound.textContent = !userMuted ? "🔊" : "🔇";
});

window.addEventListener("keydown", (e) => {
  if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")) return;
  if (e.code === "Space") {
    e.preventDefault();
    const earned = applyTap(state);
    sound.playTap();
    const rect = canvas.getBoundingClientRect();
    const x = rect.left + rect.width * (window.innerWidth >= 1024 ? 0.34 : 0.45);
    const y = rect.top + rect.height * 0.5;
    spawnTapText(x, y, earned);
    world.spawnSplash(-1.2, 0.5, 2.0, 8);
    updateHudAndButtons();
    return;
  }
  const tabMap = { Digit1: "stations", Digit2: "upgrades", Digit3: "shop", Digit4: "prestige" };
  if (tabMap[e.code]) {
    const targetBtn = document.querySelector(`.tab-btn[data-tab='${tabMap[e.code]}']`);
    if (targetBtn) targetBtn.click();
    return;
  }
  if (e.code === "KeyQ") {
    const camBtns = Array.from(document.querySelectorAll(".cam-btn"));
    const curIdx = camBtns.findIndex((b) => b.classList.contains("active"));
    const nextBtn = camBtns[(curIdx + 1) % camBtns.length];
    if (nextBtn) nextBtn.click();
  }
});

btnClaimOffline.addEventListener("click", () => {
  offlineModal.classList.add("hidden");
  sound.playUnlock();
});

if (offlineEarned > 0) {
  const mins = Math.max(1, Math.floor(offlineSeconds / 60));
  offlineTime.textContent = `Вы отсутствовали ${mins} мин.`;
  offlineReward.textContent = `+${formatCompact(offlineEarned, "$")}`;
  offlineModal.classList.remove("hidden");
}

window.addEventListener("resize", () => world.resize());
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") saveState(state);
});
window.addEventListener("pagehide", () => saveState(state));

let lastFrameTime = performance.now();
let uiAccumulator = 0;
let saveAccumulator = 0;

function frame(now) {
  const dt = (now - lastFrameTime) / 1000;
  lastFrameTime = now;

  if ((state.boosters?.auto_tap || 0) > 0) {
    autoTapAcc += dt;
    if (autoTapAcc >= 0.34) {
      autoTapAcc = 0;
      const earned = applyTap(state);
      const rect = canvas.getBoundingClientRect();
      spawnTapText(rect.left + rect.width * 0.42, rect.top + rect.height * 0.48, earned);
      world.spawnSplash(-1.2, 0.5, 2.0, 4);
    }
  }

  const payouts = tickEconomy(state, dt);
  world.render(state);

  for (const p of payouts) {
    world.triggerStationPulse(p.stationId);
    spawnStationIncomePopup(p.stationId, p.amount);
  }

  uiAccumulator += dt;
  if (uiAccumulator >= 0.1) {
    uiAccumulator = 0;
    updateHudAndButtons();
  }

  saveAccumulator += dt;
  if (saveAccumulator >= 5) {
    saveAccumulator = 0;
    saveState(state);
  }

  requestAnimationFrame(frame);
}

renderCards();
updateHudAndButtons();
requestAnimationFrame(frame);

window.__WATER_POWER_DEBUG__ = {
  state,
  world,
  getTotals: () => getTotals(state),
  grantCash: (amt) => {
    state.cash += amt;
    state.runCash += amt;
    state.lifetimeCash += amt;
    renderCards();
    updateHudAndButtons();
  }
};
