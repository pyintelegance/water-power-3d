import "./style.css";
import {
  CITY_ERAS,
  STATION_DEFS,
  UPGRADE_DEFS,
  applyTap,
  buyStationAction,
  buyUpgradeAction,
  checkAndClaimGoals,
  computePendingEngineers,
  formatCompact,
  formatWatts,
  getBulkStationCost,
  getCityEraIndex,
  getCurrentGoalProgress,
  getMaxAffordableStationLevels,
  getStationOutput,
  getStationUpgradePreview,
  getTotals,
  getUpgradeCost,
  getUpgradeEffectText,
  loadState,
  saveState,
  tickEconomy,
  triggerPrestige
} from "./economy.js";
import { SoundEngine } from "./audio.js";
import { WaterPowerWorld } from "./world.js";

const { state, offlineEarned, offlineSeconds } = loadState();
const sound = new SoundEngine();

let activeTab = "stations";
let buyMult = "x1";
let lastEraIndex = getCityEraIndex(getTotals(state).totalWatts);
let eraToastTimer = null;
let lastStationFloatAt = 0;

// DOM refs
const canvas = document.getElementById("game-canvas");
const tapFxLayer = document.getElementById("tap-fx-layer");
const hudCash = document.getElementById("hud-cash");
const hudIncome = document.getElementById("hud-income");
const hudWatts = document.getElementById("hud-watts");
const hudEra = document.getElementById("hud-era");
const goalTitle = document.getElementById("goal-title");
const goalNumbers = document.getElementById("goal-numbers");
const goalFill = document.getElementById("goal-fill");
const goalSub = document.getElementById("goal-sub");
const overdriveFill = document.getElementById("overdrive-fill");
const overdriveLabel = document.getElementById("overdrive-label");
const cardsList = document.getElementById("cards-list");
const drawer = document.getElementById("drawer");
const btnBuyMult = document.getElementById("btn-buy-mult");
const btnCollapse = document.getElementById("btn-collapse");
const btnSound = document.getElementById("btn-sound");
const eraToast = document.getElementById("era-toast");
const eraToastBadge = document.getElementById("era-toast-badge");
const eraToastTitle = document.getElementById("era-toast-title");
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

function renderCards() {
  cardsList.innerHTML = "";

  if (activeTab === "stations") {
    for (const def of STATION_DEFS) {
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
        st.unlocked && preview.nextMilestone
          ? ` · x2 на ур.${preview.nextMilestone}`
          : "";

      const card = document.createElement("div");
      card.className = `card${st.unlocked ? "" : " locked"}`;
      card.dataset.stationCard = def.id;
      card.innerHTML = `
        <div class="card-left">
          <div class="card-emoji">${def.icon}</div>
          <div class="card-info">
            <div class="card-title">
              <span>${def.name}</span>
              <span class="lvl-badge">${st.unlocked ? `Ур. ${st.level}` : "Закрыто"}</span>
            </div>
            <div class="card-meta">
              ${
                st.unlocked
                  ? `Добыча: +${formatCompact(out.incomePerSec, "$")}/с · ${formatWatts(out.watts)}`
                  : def.desc
              }
            </div>
            <div class="card-delta">
              ${
                st.unlocked
                  ? `Апгрейд даст: +${formatCompact(preview.deltaIncome, "$")}/с (+${formatWatts(preview.deltaWatts)})${milestoneNote}`
                  : `Запуск даст: +${formatCompact(preview.deltaIncome, "$")}/с и ${formatWatts(preview.deltaWatts)}`
              }
            </div>
            ${
              st.unlocked
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
    for (const up of UPGRADE_DEFS) {
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
  } else if (activeTab === "prestige") {
    const pending = computePendingEngineers(state);
    const currentBonus = state.engineers * 50;
    const nextBonus = (state.engineers + pending) * 50;

    const hero = document.createElement("div");
    hero.className = "prestige-hero";
    hero.innerHTML = `
      <h3>👷 Главные инженеры</h3>
      <p>Расширяйте сеть: перезапуск даёт инженеров, которые навсегда увеличивают добычу всех станций на <strong>+50%</strong> за каждого. От 2 инженеров работает авто-турбо.</p>
      <div class="prestige-stats">
        <span>Сейчас: <strong>${state.engineers}</strong> (+${currentBonus}%)</span>
        <span>Доступно: <strong>+${pending}</strong> (+${nextBonus}%)</span>
      </div>
      <button class="buy-btn ${pending > 0 ? "can-afford" : "cannot-afford"}" style="width:100%" data-action="prestige" ${pending <= 0 ? "disabled" : ""}>
        <span>${pending > 0 ? `Нанять +${pending} инж.` : "Нужно $50K за забег"}</span>
        <span class="buy-action">Сброс и расширение</span>
      </button>
    `;
    cardsList.appendChild(hero);
  }

  refreshButtonStates();
}

function refreshButtonStates() {
  const buttons = cardsList.querySelectorAll(".buy-btn[data-cost]");
  for (const btn of buttons) {
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
}

function refreshMiningBars() {
  if (activeTab !== "stations") return;
  for (const def of STATION_DEFS) {
    const st = state.stations[def.id];
    if (!st || !st.unlocked) continue;
    const fill = cardsList.querySelector(`.cycle-fill[data-cycle="${def.id}"]`);
    const mined = cardsList.querySelector(`.cycle-mined[data-mined="${def.id}"]`);
    if (fill) {
      fill.style.width = `${Math.round((st.cycleProgress || 0) * 100)}%`;
    }
    if (mined) {
      mined.textContent = `Добыто: ${formatCompact(st.totalMined || 0, "$")}`;
    }
  }
}

function updateHudAndButtons() {
  const totals = getTotals(state);
  hudCash.textContent = formatCompact(state.cash, "$");
  hudIncome.textContent = `+${formatCompact(totals.effectiveIncomePerSec, "$")}/с · от ГЭС`;
  hudWatts.textContent = formatWatts(totals.totalWatts);

  const eraIdx = getCityEraIndex(totals.totalWatts);
  hudEra.textContent = CITY_ERAS[eraIdx].name;
  if (eraIdx > lastEraIndex) {
    lastEraIndex = eraIdx;
    sound.playUnlock();
    showBannerToast("НОВАЯ ЭРА ГОРОДА!", CITY_ERAS[eraIdx].name);
  } else if (eraIdx < lastEraIndex) {
    lastEraIndex = eraIdx;
  }

  const claimed = checkAndClaimGoals(state);
  if (claimed.length > 0) {
    const lastGoal = claimed[claimed.length - 1];
    sound.playUnlock();
    showBannerToast(
      `ЦЕЛЬ ВЫПОЛНЕНА! +${formatCompact(lastGoal.rewardCash, "$")}`,
      lastGoal.title
    );
  }

  const goalInfo = getCurrentGoalProgress(state);
  if (goalInfo.completedAll) {
    goalTitle.textContent = "🏆 ВСЕ ЦЕЛИ ВЫПОЛНЕНЫ!";
    goalNumbers.textContent = formatWatts(goalInfo.currentWatts);
    goalFill.style.width = "100%";
    goalSub.textContent = "Ваш город полностью работает на энергии воды!";
  } else {
    goalTitle.textContent = `🎯 ЦЕЛЬ ${goalInfo.index + 1}/${goalInfo.totalGoals}: ${goalInfo.goal.title}`;
    goalNumbers.textContent = `${formatWatts(goalInfo.currentWatts)} / ${formatWatts(goalInfo.goal.targetWatts)}`;
    goalFill.style.width = `${goalInfo.percent.toFixed(1)}%`;
    goalSub.textContent = `Награда: +${formatCompact(goalInfo.goal.rewardCash, "$")} · ${goalInfo.goal.subtitle}`;
  }

  const pct = Math.round(state.overdrive * 100);
  overdriveFill.style.width = `${pct}%`;
  overdriveLabel.textContent =
    state.overdrive > 0.02
      ? `⚡ ТУРБО НАПОР x${totals.overdriveMult.toFixed(1)}`
      : "⚡ ТАПАЙ ПО ВОДЕ ДЛЯ РАЗГОНА (x1.0)";

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
  } else if (action === "prestige") {
    if (triggerPrestige(state) > 0) {
      sound.playUnlock();
      saveState(state);
      renderCards();
      updateHudAndButtons();
    }
  }
});

document.querySelector(".cam-bar").addEventListener("click", (e) => {
  const btn = e.target.closest(".cam-btn");
  if (!btn) return;
  const camIdx = Number(btn.dataset.cam || 0);
  world.setCameraPreset(camIdx);
  document.querySelectorAll(".cam-btn").forEach((b) => {
    b.classList.toggle("active", b === btn);
  });
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

btnCollapse.addEventListener("click", () => {
  drawer.classList.toggle("collapsed");
});

btnSound.addEventListener("click", () => {
  const next = !sound.enabled;
  sound.setEnabled(next);
  btnSound.textContent = next ? "🔊" : "🔇";
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

// Main loop
let lastFrameTime = performance.now();
let uiAccumulator = 0;
let saveAccumulator = 0;

function frame(now) {
  const dt = (now - lastFrameTime) / 1000;
  lastFrameTime = now;

  const payouts = tickEconomy(state, dt);
  world.render(state);

  for (const p of payouts) {
    world.triggerStationPulse(p.stationId);
    spawnStationIncomePopup(p.stationId, p.amount);
  }

  uiAccumulator += dt;
  if (uiAccumulator >= 0.08) {
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
