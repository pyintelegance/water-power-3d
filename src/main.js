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
  canTriggerArchitect,
  checkAchievements,
  checkAndClaimGoals,
  claimDailyReward,
  claimQuestReward,
  collectRiverEventReward,
  computePendingEngineers,
  consumeSurgeEvent,
  formatCompact,
  formatWatts,
  getActiveQuest,
  getActiveZone,
  getArchitectTargetWatts,
  getBoosterCashCost,
  getBulkStationCost,
  getCityEraIndex,
  getCurrentGoalProgress,
  getDailyStatus,
  getMaxAffordableStationLevels,
  getOnboardingUnlocks,
  getPlayerRank,
  getPrestigeThreshold,
  getShopPerkCost,
  getStationOutput,
  getStationUpgradePreview,
  getTotals,
  getUpgradeCost,
  getUpgradeEffectText,
  getZoneStations,
  getZoneUpgrades,
  loadState,
  resetAllProgress,
  saveState,
  startCitySurge,
  tickEconomy,
  triggerArchitectAscension,
  triggerPrestige
} from "./economy.js";
import { iconHtml } from "./icons.js";
import { SoundEngine } from "./audio.js";
import { PlatformBridge } from "./platform.js";
import { WaterPowerWorld } from "./world.js";
import {
  getLang,
  setLang,
  t,
  tAchField,
  tBoosterField,
  tEraName,
  tGoalField,
  tPerkField,
  tQuestTitle,
  tRank,
  tStationField,
  tUpgradeField,
  tZoneField
} from "./i18n.js";

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
let tapCombo = 0;
let lastTapAt = 0;
let activeFlyOrbs = 0;
let lastSurgeActive = false;

// DOM refs
const canvas = document.getElementById("game-canvas");
const tapFxLayer = document.getElementById("tap-fx-layer");
const hudCash = document.getElementById("hud-cash");
const hudIncome = document.getElementById("hud-income");
const hudWatts = document.getElementById("hud-watts");
const hudEra = document.getElementById("hud-era");
const hudCrystalVal = document.getElementById("hud-crystal-val");
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
const comboPill = document.getElementById("combo-pill");
const surgePill = document.getElementById("surge-pill");
const btnEventAlert = document.getElementById("btn-event-alert");
const questPill = document.getElementById("quest-pill");
const questText = document.getElementById("quest-text");
const btnQuestClaim = document.getElementById("btn-quest-claim");
const onboardingHint = document.getElementById("onboarding-hint");
const activeBoostersEl = document.getElementById("active-boosters");
const cashPillEl = document.querySelector(".cash-pill");
const crystalPillEl = document.getElementById("hud-crystals");
const btnResetPrompt = document.getElementById("btn-reset-prompt");
const resetConfirmBox = document.getElementById("reset-confirm-box");
const btnResetCancel = document.getElementById("btn-reset-cancel");
const btnResetConfirm = document.getElementById("btn-reset-confirm");
const btnPanToggle = document.getElementById("btn-pan-toggle");
const cardsList = document.getElementById("cards-list");
const drawer = document.getElementById("drawer");
const btnBuyMult = document.getElementById("btn-buy-mult");
const btnCollapse = document.getElementById("btn-collapse");
const btnProfile = document.getElementById("btn-profile");
const btnSound = document.getElementById("btn-sound");
const btnDaily = document.getElementById("btn-daily");
const dailyBtnIcon = document.getElementById("daily-btn-icon");
const dailyDot = document.getElementById("daily-dot");
const dailyModal = document.getElementById("daily-modal");
const btnCloseDaily = document.getElementById("btn-close-daily");
const dailyGrid = document.getElementById("daily-grid");
const btnClaimDaily = document.getElementById("btn-claim-daily");
const btnLang = document.getElementById("btn-lang");
const btnFullscreen = document.getElementById("btn-fullscreen");
const pcHintsEl = document.getElementById("pc-hints");
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
const zoneModalIcon = document.getElementById("zone-modal-icon");
const zoneModalTitle = document.getElementById("zone-modal-title");
const zoneModalDesc = document.getElementById("zone-modal-desc");
const btnCancelZone = document.getElementById("btn-cancel-zone");
const btnConfirmZone = document.getElementById("btn-confirm-zone");
const offlineModal = document.getElementById("offline-modal");
const offlineIcon = document.getElementById("offline-icon");
const offlineTime = document.getElementById("offline-time");
const offlineReward = document.getElementById("offline-reward");
const btnClaimOffline = document.getElementById("btn-claim-offline");

// Mount static vector HUD icons
document.getElementById("hud-cash-icon").innerHTML = iconHtml("cash");
document.getElementById("hud-power-icon").innerHTML = iconHtml("power");
document.getElementById("hud-crystal-icon").innerHTML = iconHtml("crystal", "svg-ic-sm");
btnSound.innerHTML = iconHtml("sound_on");
if (dailyBtnIcon) dailyBtnIcon.innerHTML = iconHtml("gift");
if (btnFullscreen) btnFullscreen.innerHTML = iconHtml("fullscreen");
if (btnPanToggle) btnPanToggle.innerHTML = iconHtml("pan", "svg-ic-sm");
offlineIcon.innerHTML = iconHtml("power", "svg-ic-hero");

function applyStaticTranslations() {
  document.title = t("pageTitle");
  document.documentElement.lang = getLang();
  if (btnLang) {
    btnLang.textContent = getLang().toUpperCase();
    btnLang.title = t("titleLang");
  }
  if (btnFullscreen) btnFullscreen.title = t("titleFullscreen");
  if (btnDaily) btnDaily.title = t("titleDaily");
  const dTitle = document.getElementById("daily-modal-title");
  const dSub = document.getElementById("daily-modal-sub");
  if (dTitle) dTitle.textContent = t("dailyTitle");
  if (dSub) dSub.textContent = t("dailySub");
  btnProfile.title = t("titleProfile");
  btnSound.title = t("titleSound");
  crystalPillEl.title = t("titleCrystals");
  btnGoalCollapse.title = t("collapseGoal");
  btnCollapse.title = t("collapseDrawer");
  onboardingHint.textContent = t("onboardingHint");
  if (pcHintsEl) pcHintsEl.innerHTML = t("pcHints");

  const tabLabels = { stations: "tabStations", upgrades: "tabUpgrades", shop: "tabShop", prestige: "tabPrestige" };
  for (const [key, tKey] of Object.entries(tabLabels)) {
    const el = document.querySelector(`.tab-btn[data-tab="${key}"]`);
    if (el) el.textContent = t(tKey);
  }
  const camLabels = { 0: "camOverview", 1: "camStations", 2: "camDam", 3: "camCity" };
  for (const [camIdx, tKey] of Object.entries(camLabels)) {
    const el = document.querySelector(`.cam-btn[data-cam="${camIdx}"]`);
    if (el) el.textContent = t(tKey);
  }
  btnPanToggle.title = t("titlePan");

  const profileTitleEl = document.getElementById("profile-modal-title");
  if (profileTitleEl) profileTitleEl.textContent = t("profileTitle");
  profileNameInput.placeholder = t("profileNamePlaceholder");
  const achHeadingEl = document.getElementById("ach-heading");
  if (achHeadingEl) achHeadingEl.textContent = t("achHeading");
  btnResetPrompt.textContent = t("resetBtnPrompt");
  const resetConfirmTextEl = document.getElementById("reset-confirm-text");
  if (resetConfirmTextEl) resetConfirmTextEl.textContent = t("resetConfirmText");
  btnResetCancel.textContent = t("resetCancel");
  btnResetConfirm.textContent = t("resetConfirm");

  const zoneResetBoxEl = document.getElementById("zone-reset-box");
  if (zoneResetBoxEl) zoneResetBoxEl.innerHTML = t("zoneResetBullets");
  btnCancelZone.textContent = t("zoneCancel");
  btnConfirmZone.textContent = t("zoneConfirm");

  const offlineTitleEl = document.getElementById("offline-title");
  if (offlineTitleEl) offlineTitleEl.textContent = t("offlineTitle");
  btnClaimOffline.textContent = t("offlineClaim");
  lastZoneStripSig = "";
}

function getComboMult() {
  return 1 + Math.min(1.5, Math.floor(tapCombo / 5) * 0.25);
}

function registerTapCombo() {
  const now = performance.now();
  if (now - lastTapAt <= 950) {
    tapCombo = Math.min(32, tapCombo + 1);
  } else {
    tapCombo = 1;
  }
  lastTapAt = now;
  return getComboMult();
}

function pulseHudPill(el) {
  if (!el) return;
  el.classList.remove("pill-pop");
  void el.offsetWidth;
  el.classList.add("pill-pop");
}

function spawnFlyingOrbs(startX, startY, targetEl, kind = "gold", count = 3) {
  if (!targetEl || activeFlyOrbs >= 16) return;
  const rect = targetEl.getBoundingClientRect();
  const endX = rect.left + rect.width * 0.25;
  const endY = rect.top + rect.height * 0.5;
  const actualCount = Math.min(count, 16 - activeFlyOrbs);

  for (let i = 0; i < actualCount; i += 1) {
    activeFlyOrbs += 1;
    const orb = document.createElement("div");
    orb.className = `fly-orb ${kind}`;
    tapFxLayer.appendChild(orb);

    const sx = startX + (Math.random() - 0.5) * 26;
    const sy = startY + (Math.random() - 0.5) * 18;
    const cx = (sx + endX) * 0.5 + (Math.random() - 0.5) * 90;
    const cy = Math.min(sy, endY) - 45 - Math.random() * 45;
    const dur = 460 + i * 55;
    const t0 = performance.now();

    const stepOrb = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      const inv = 1 - p;
      const x = inv * inv * sx + 2 * inv * p * cx + p * p * endX;
      const y = inv * inv * sy + 2 * inv * p * cy + p * p * endY;
      orb.style.transform = `translate(${x - 6}px, ${y - 6}px) scale(${1 - p * 0.35})`;
      orb.style.opacity = p > 0.85 ? String((1 - p) / 0.15) : "1";
      if (p < 1) {
        requestAnimationFrame(stepOrb);
      } else {
        orb.remove();
        activeFlyOrbs = Math.max(0, activeFlyOrbs - 1);
        if (i === 0) pulseHudPill(targetEl);
      }
    };
    requestAnimationFrame(stepOrb);
  }
}

function spawnTapText(x, y, amount, comboMult = 1) {
  const el = document.createElement("div");
  el.className = "tap-float";
  el.textContent = comboMult > 1 ? `+${formatCompact(amount, "$")} x${comboMult}` : `+${formatCompact(amount, "$")}`;
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  tapFxLayer.appendChild(el);
  setTimeout(() => el.remove(), 840);
}

function spawnStationIncomePopup(stationId, amount) {
  const now = performance.now();
  if (now - lastStationFloatAt < 200) return;
  const pos = world.getStationScreenPosition(stationId);
  if (!pos) return;
  const drawerTop = drawer.getBoundingClientRect().top;
  if (pos.y < 140 || pos.y > drawerTop - 16) return;
  lastStationFloatAt = now;

  const el = document.createElement("div");
  el.className = "station-float";
  el.textContent = `+${formatCompact(amount, "$")}`;
  el.style.left = `${pos.x}px`;
  el.style.top = `${pos.y}px`;
  tapFxLayer.appendChild(el);
  setTimeout(() => el.remove(), 1020);
  spawnFlyingOrbs(pos.x, pos.y, cashPillEl, "gold", 2);
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

function handleEventCollected(collected) {
  if (!collected) return;
  const reward = collectRiverEventReward(state, collected.type);
  sound.playUnlock();
  world.triggerShake(0.16);
  if (reward.crystals > 0) {
    spawnFlyingOrbs(collected.screenX, collected.screenY, crystalPillEl, "crystal", 5);
    showBannerToast(t("toastDrone"), `+${reward.crystals} ${t("crystalsShort")}`);
  } else {
    spawnFlyingOrbs(collected.screenX, collected.screenY, cashPillEl, "gold", 6);
    showBannerToast(t("toastCrate"), `+${formatCompact(reward.cash, "$")}`);
  }
  saveState(state);
  updateHudAndButtons();
}

const world = new WaterPowerWorld(
  canvas,
  (x, y) => {
    const comboMult = registerTapCombo();
    const earned = applyTap(state, comboMult);
    sound.playTap(tapCombo);
    platform.vibrate(8);
    if (state.profile.totalTaps === 1) platform.trackEvent("first_tap");
    spawnTapText(x, y, earned, comboMult);
    spawnFlyingOrbs(x, y, cashPillEl, "gold", 2);
    updateHudAndButtons();
  },
  handleEventCollected
);

function applyOnboardingVisibility() {
  const unlocks = getOnboardingUnlocks(state);
  const upTab = document.querySelector(".tab-btn[data-tab='upgrades']");
  const shopTab = document.querySelector(".tab-btn[data-tab='shop']");
  const presTab = document.querySelector(".tab-btn[data-tab='prestige']");
  if (upTab) upTab.classList.toggle("hidden-locked", !unlocks.upgrades);
  if (shopTab) shopTab.classList.toggle("hidden-locked", !unlocks.shop);
  if (presTab) presTab.classList.toggle("hidden-locked", !unlocks.prestige);
  zoneStrip.classList.toggle("hidden-locked", !unlocks.zones);
  document.body.classList.toggle("zones-unlocked", unlocks.zones);

  const showHint =
    state.activeZoneId === "valley" &&
    state.stations.s0?.level === 1 &&
    !state.stations.s1?.unlocked &&
    state.lifetimeCash < 25;
  onboardingHint.classList.toggle("hidden", !showHint);
}

function renderZoneStrip() {
  const curZone = getActiveZone(state);
  const readyNext = canAdvanceZone(state);
  const sig = `${getLang()}|${state.activeZoneId}|${(state.completedZones || []).join(",")}|${readyNext?.id || ""}`;
  if (sig === lastZoneStripSig) return;
  lastZoneStripSig = sig;
  zoneStrip.innerHTML = "";

  for (const z of ZONES) {
    const isCurrent = state.activeZoneId === z.id;
    const isCompleted = state.completedZones?.includes(z.id);
    const shortName = tZoneField(z, "shortName");
    const chip = document.createElement("div");

    if (isCurrent) {
      chip.className = "zone-chip active";
      chip.innerHTML = `${iconHtml(z.icon, "svg-ic-sm")}<span>${t("zoneCurrentBadge", { name: shortName, mult: z.incomeMult })}</span>`;
    } else if (isCompleted) {
      chip.className = "zone-chip done";
      chip.innerHTML = `${iconHtml(z.icon, "svg-ic-sm")}<span>${t("zoneDoneBadge", { name: shortName })}</span>`;
    } else if (readyNext && readyNext.id === z.id) {
      chip.className = "zone-chip active";
      chip.innerHTML = `${iconHtml(z.icon, "svg-ic-sm")}<span>${t("zoneReadyBadge", { name: shortName })}</span>`;
    } else {
      chip.className = "zone-chip locked";
      const reqText =
        z.index === curZone.index + 1 && curZone.nextZoneTargetWatts
          ? formatWatts(curZone.nextZoneTargetWatts)
          : t("zoneNextLabel");
      chip.innerHTML = `${iconHtml(z.icon, "svg-ic-sm")}<span>${t("zoneLockedBadge", { name: shortName, req: reqText })}</span>`;
    }
    zoneStrip.appendChild(chip);
  }
}

function renderCards() {
  cardsList.innerHTML = "";
  const zoneStations = getZoneStations(state.activeZoneId);
  const zoneUpgrades = getZoneUpgrades(state.activeZoneId);
  const sec = t("secUnit");

  if (activeTab === "stations") {
    for (const def of zoneStations) {
      const st = state.stations[def.id];
      const out = getStationOutput(state, def);
      const stName = tStationField(state.activeZoneId, def, "name");
      const stDesc = tStationField(state.activeZoneId, def, "desc");

      let cost = 0;
      let actionLabel = t("actionUpgrade");
      let buyCount = 1;

      if (!st.unlocked) {
        cost = def.unlockCost;
        actionLabel = t("actionBuild");
      } else if (buyMult === "x10") {
        buyCount = 10;
        cost = getBulkStationCost(def, st.level, 10);
        actionLabel = t("actionUpN", { n: 10 });
      } else if (buyMult === "MAX") {
        buyCount = Math.max(1, getMaxAffordableStationLevels(def, st.level, state.cash));
        cost = getBulkStationCost(def, st.level, buyCount);
        actionLabel = t("actionUpN", { n: buyCount });
      } else {
        cost = getBulkStationCost(def, st.level, 1);
        actionLabel = t("actionUp1");
      }

      const preview = getStationUpgradePreview(state, def, buyCount);
      const milestoneNote =
        st.unlocked && preview.nextMilestone ? t("milestoneNote", { m: preview.nextMilestone }) : "";
      const readyToBuild = !st.unlocked && state.cash >= cost;

      const card = document.createElement("div");
      card.className = `card${st.unlocked ? "" : " locked"}`;
      card.innerHTML = `
        <div class="card-left">
          <div class="card-icon-box">${iconHtml(def.icon, "svg-ic-lg")}</div>
          <div class="card-info">
            <div class="card-title">
              <span>${stName}</span>
              <span class="lvl-badge${readyToBuild ? " ready" : ""}" data-badge="${def.id}">${
                st.unlocked ? t("lvlBadge", { lvl: st.level }) : t(readyToBuild ? "readyToBuild" : "notBuilt")
              }</span>
            </div>
            <div class="card-meta">
              ${
                st.unlocked
                  ? t("stationOutput", { cash: formatCompact(out.incomePerSec, "$"), sec, watts: formatWatts(out.watts) })
                  : stDesc
              }
            </div>
            <div class="card-delta" data-delta="${def.id}">
              ${
                st.unlocked
                  ? t("stationGain", { cash: formatCompact(preview.deltaIncome, "$"), sec, watts: formatWatts(preview.deltaWatts), ms: milestoneNote })
                  : t("stationLaunch", { cash: formatCompact(preview.deltaIncome, "$"), sec, watts: formatWatts(preview.deltaWatts) })
              }
            </div>
            ${
              st.unlocked
                ? `<div class="cycle-row">
                    <div class="cycle-track"><div class="cycle-fill" data-cycle="${def.id}" style="width:${Math.round((st.cycleProgress || 0) * 100)}%"></div></div>
                    <span class="cycle-mined" data-mined="${def.id}">${t("minedTotal", { cash: formatCompact(st.totalMined || 0, "$") })}</span>
                  </div>`
                : ""
            }
          </div>
        </div>
        <button class="buy-btn" data-action="station" data-id="${def.id}" data-cost="${cost}">
          <span class="buy-cost">${formatCompact(cost, "$")}</span>
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
      const effectText = isMax ? t("maxLevel") : getUpgradeEffectText(state, up);
      const upName = tUpgradeField(state.activeZoneId, up, "name");
      const upTarget = tUpgradeField(state.activeZoneId, up, "targetLabel");

      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <div class="card-left">
          <div class="card-icon-box">${iconHtml(up.icon, "svg-ic-lg")}</div>
          <div class="card-info">
            <div class="card-title">
              <span>${upName}</span>
              <span class="lvl-badge">${lvl}/${up.maxLevel}</span>
            </div>
            <div class="card-meta">${upTarget}</div>
            <div class="card-delta">${effectText}</div>
          </div>
        </div>
        <button class="buy-btn" data-action="upgrade" data-id="${up.id}" data-cost="${cost}" ${isMax ? "disabled" : ""}>
          <span>${isMax ? t("actionMax") : formatCompact(cost, "$")}</span>
          <span class="buy-action">${isMax ? t("actionDone") : t("actionUpgrade")}</span>
        </button>
      `;
      cardsList.appendChild(card);
    }
  } else if (activeTab === "shop") {
    const bHeader = document.createElement("div");
    bHeader.className = "shop-section-title";
    bHeader.textContent = t("shopBoostersHead");
    cardsList.appendChild(bHeader);

    for (const b of BOOSTER_DEFS) {
      const cashCost = getBoosterCashCost(state, b);
      const rem = Math.ceil(state.boosters?.[b.id] || 0);
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <div class="card-left">
          <div class="card-icon-box">${iconHtml(b.icon, "svg-ic-lg")}</div>
          <div class="card-info">
            <div class="card-title">
              <span>${tBoosterField(b, "name")}</span>
              ${rem > 0 ? `<span class="lvl-badge">${rem}${sec}</span>` : ""}
            </div>
            <div class="card-meta">${tBoosterField(b, "desc")}</div>
          </div>
        </div>
        <div class="btn-stack">
          ${
            cashCost !== null
              ? `<button class="buy-btn" data-action="booster-cash" data-id="${b.id}" data-cost="${cashCost}">
                  <span>${formatCompact(cashCost, "$")}</span>
                  <span class="buy-action">${t("actionActivate")}</span>
                </button>`
              : ""
          }
          <button class="buy-btn crystal-btn" data-action="booster-crystal" data-id="${b.id}" data-crystal-cost="${b.crystalCost}">
            <span>${t("crystalCount", { n: b.crystalCost })}</span>
            <span class="buy-action">${t("actionForCrystals")}</span>
          </button>
        </div>
      `;
      cardsList.appendChild(card);
    }

    const pHeader = document.createElement("div");
    pHeader.className = "shop-section-title";
    pHeader.textContent = t("shopPerksHead");
    cardsList.appendChild(pHeader);

    for (const perk of SHOP_PERK_DEFS) {
      const lvl = state.shopPerks?.[perk.id] || 0;
      const isMax = lvl >= perk.maxLevel;
      const cCost = isMax ? 0 : getShopPerkCost(perk, lvl);
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <div class="card-left">
          <div class="card-icon-box">${iconHtml(perk.icon, "svg-ic-lg")}</div>
          <div class="card-info">
            <div class="card-title">
              <span>${tPerkField(perk, "name")}</span>
              <span class="lvl-badge">${lvl}/${perk.maxLevel}</span>
            </div>
            <div class="card-meta">${tPerkField(perk, "desc")}</div>
          </div>
        </div>
        <button class="buy-btn crystal-btn" data-action="perk" data-id="${perk.id}" data-crystal-cost="${cCost}" ${isMax ? "disabled" : ""}>
          <span>${isMax ? t("actionMax") : t("crystalCount", { n: cCost })}</span>
          <span class="buy-action">${isMax ? t("actionInstalled") : t("actionInstall")}</span>
        </button>
      `;
      cardsList.appendChild(card);
    }
  } else if (activeTab === "prestige") {
    const pending = computePendingEngineers(state);
    const currentBonus = state.engineers * 50;
    const nextBonus = (state.engineers + pending) * 50;
    const reqCash = formatCompact(getPrestigeThreshold(state), "$");

    const hero = document.createElement("div");
    hero.className = "prestige-hero";
    hero.innerHTML = `
      <h3>${t("prestigeTitle")}</h3>
      <p>${t("prestigeDesc")}</p>
      <div class="prestige-stats">
        <span>${t("prestigeInStaff", { n: state.engineers, pct: currentBonus })}</span>
        <span id="prestige-pending-txt">${t("prestigePending", { n: pending, pct: nextBonus })}</span>
      </div>
      <button id="btn-prestige-hire" class="buy-btn ${pending > 0 ? "can-afford" : "cannot-afford"}" style="width:100%" data-action="prestige" ${pending <= 0 ? "disabled" : ""}>
        <span>${pending > 0 ? t("prestigeBtnHire", { n: pending }) : t("prestigeBtnNeed", { cash: reqCash })}</span>
        <span class="buy-action">${t("prestigeBtnSub")}</span>
      </button>
    `;
    cardsList.appendChild(hero);

    if (state.activeZoneId === "cyber" || (state.architects || 0) > 0) {
      const archReady = canTriggerArchitect(state);
      const archMult = Math.pow(2, state.architects || 0);
      const archTarget = formatWatts(getArchitectTargetWatts(state));
      const archHero = document.createElement("div");
      archHero.className = "prestige-hero";
      archHero.style.marginTop = "6px";
      archHero.innerHTML = `
        <h3>${t("architectTitle")}</h3>
        <p>${t("architectDesc")}</p>
        <div class="prestige-stats">
          <span>${t("architectStats", { n: state.architects || 0, mult: archMult, asc: state.ascension || 0 })}</span>
        </div>
        <button id="btn-architect-go" class="buy-btn ${archReady ? "crystal-btn can-afford" : "cannot-afford"}" style="width:100%" data-action="architect" ${archReady ? "" : "disabled"}>
          <span>${archReady ? t("architectBtnGo") : t("architectBtnNeed", { watts: archTarget })}</span>
          <span class="buy-action">${t("architectBtnSub")}</span>
        </button>
      `;
      cardsList.appendChild(archHero);
    }
  }

  refreshButtonStates();
}

function refreshMaxStationButtons() {
  if (activeTab !== "stations") return;
  const sec = t("secUnit");
  for (const def of getZoneStations(state.activeZoneId)) {
    const st = state.stations[def.id];
    const btn = cardsList.querySelector(`.buy-btn[data-action="station"][data-id="${def.id}"]`);
    if (!btn || !st) continue;
    if (!st.unlocked) {
      const badge = cardsList.querySelector(`[data-badge="${def.id}"]`);
      const canReady = state.cash >= def.unlockCost;
      if (badge) {
        badge.classList.toggle("ready", canReady);
        badge.textContent = t(canReady ? "readyToBuild" : "notBuilt");
      }
      continue;
    }
    if (buyMult === "MAX") {
      const buyCount = Math.max(1, getMaxAffordableStationLevels(def, st.level, state.cash));
      const cost = getBulkStationCost(def, st.level, buyCount);
      btn.dataset.cost = String(cost);
      const costSpan = btn.querySelector(".buy-cost");
      const actSpan = btn.querySelector(".buy-action");
      if (costSpan) costSpan.textContent = formatCompact(cost, "$");
      if (actSpan) actSpan.textContent = t("actionUpN", { n: buyCount });
      const deltaEl = cardsList.querySelector(`[data-delta="${def.id}"]`);
      if (deltaEl) {
        const preview = getStationUpgradePreview(state, def, buyCount);
        const msNote = preview.nextMilestone ? t("milestoneNote", { m: preview.nextMilestone }) : "";
        deltaEl.textContent = t("stationGain", { cash: formatCompact(preview.deltaIncome, "$"), sec, watts: formatWatts(preview.deltaWatts), ms: msNote });
      }
    }
  }
}

function refreshPrestigeLive() {
  if (activeTab !== "prestige") return;
  const pending = computePendingEngineers(state);
  const nextBonus = (state.engineers + pending) * 50;
  const reqCash = formatCompact(getPrestigeThreshold(state), "$");
  const pendEl = document.getElementById("prestige-pending-txt");
  const hireBtn = document.getElementById("btn-prestige-hire");
  if (pendEl) pendEl.innerHTML = t("prestigePending", { n: pending, pct: nextBonus });
  if (hireBtn) {
    hireBtn.disabled = pending <= 0;
    hireBtn.classList.toggle("can-afford", pending > 0);
    hireBtn.classList.toggle("cannot-afford", pending <= 0);
    const firstSpan = hireBtn.querySelector("span");
    if (firstSpan) {
      firstSpan.textContent = pending > 0 ? t("prestigeBtnHire", { n: pending }) : t("prestigeBtnNeed", { cash: reqCash });
    }
  }
  const archBtn = document.getElementById("btn-architect-go");
  if (archBtn) {
    const ready = canTriggerArchitect(state);
    archBtn.disabled = !ready;
    archBtn.classList.toggle("crystal-btn", ready);
    archBtn.classList.toggle("can-afford", ready);
    archBtn.classList.toggle("cannot-afford", !ready);
    const firstSpan = archBtn.querySelector("span");
    if (firstSpan) {
      firstSpan.textContent = ready ? t("architectBtnGo") : t("architectBtnNeed", { watts: formatWatts(getArchitectTargetWatts(state)) });
    }
  }
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
    if (mined) mined.textContent = t("minedTotal", { cash: formatCompact(st.totalMined || 0, "$") });
  }
}

function renderActiveBoostersHud() {
  const pills = [];
  if ((state.boosters?.turbo_3x || 0) > 0) pills.push(t("boosterTurboBadge", { s: Math.ceil(state.boosters.turbo_3x) }));
  if ((state.boosters?.rain_2x || 0) > 0) pills.push(t("boosterRainBadge", { s: Math.ceil(state.boosters.rain_2x) }));
  if ((state.boosters?.auto_tap || 0) > 0) pills.push(t("boosterDroneBadge", { s: Math.ceil(state.boosters.auto_tap) }));
  if (pills.length === 0) {
    activeBoostersEl.classList.add("hidden");
    activeBoostersEl.innerHTML = "";
  } else {
    activeBoostersEl.classList.remove("hidden");
    activeBoostersEl.innerHTML = pills.map((p) => `<span class="booster-badge">${p}</span>`).join("");
  }
}

function renderProfileModal() {
  const avKey = AVATAR_CHOICES.includes(state.profile.avatar) ? state.profile.avatar : "av_0";
  btnProfile.innerHTML = iconHtml(avKey);

  avatarPicker.innerHTML = "";
  for (const av of AVATAR_CHOICES) {
    const btn = document.createElement("button");
    btn.className = `avatar-opt${avKey === av ? " selected" : ""}`;
    btn.innerHTML = iconHtml(av, "svg-ic-lg");
    btn.dataset.avatar = av;
    avatarPicker.appendChild(btn);
  }
  profileNameInput.value = state.profile.name || t("defaultCallsign");
  profileRank.textContent = t("profileRankPrefix", { rank: tRank(getPlayerRank(state)) });

  const totals = getTotals(state);
  const mins = Math.floor((state.profile.playTimeSec || 0) / 60);
  const secs = Math.floor((state.profile.playTimeSec || 0) % 60);
  const curZone = getActiveZone(state);

  profileStatsGrid.innerHTML = `
    <div class="pstat"><div class="pstat-label">${t("statLifetime")}</div><div class="pstat-val">${formatCompact(state.lifetimeCash, "$")}</div></div>
    <div class="pstat"><div class="pstat-label">${t("statPower")}</div><div class="pstat-val">${formatWatts(totals.totalWatts)}</div></div>
    <div class="pstat"><div class="pstat-label">${t("statZone")}</div><div class="pstat-val">${tZoneField(curZone, "name")}</div></div>
    <div class="pstat"><div class="pstat-label">${t("statTaps")}</div><div class="pstat-val">${state.profile.totalTaps || 0}</div></div>
    <div class="pstat"><div class="pstat-label">${t("statEngineers")}</div><div class="pstat-val">${state.engineers}</div></div>
    <div class="pstat"><div class="pstat-label">${t("statTime")}</div><div class="pstat-val">${mins}${t("minUnit")} ${secs}${t("secUnit")}</div></div>
  `;

  achList.innerHTML = "";
  for (const ach of ACHIEVEMENT_DEFS) {
    const done = state.claimedAchievements.includes(ach.id);
    const row = document.createElement("div");
    row.className = `ach-item${done ? " done" : ""}`;
    row.innerHTML = `
      <div>
        <strong>${done ? "✓ " : ""}${tAchField(ach, "name")}</strong>
        <div style="color:var(--text-muted);font-size:10px">${tAchField(ach, "desc")}</div>
      </div>
      <span style="font-weight:800;color:#e9d5ff">+${ach.crystals} ${t("crystalsShort")}</span>
    `;
    achList.appendChild(row);
  }
}

function openZoneTransitionModal() {
  const nextZone = canAdvanceZone(state);
  if (!nextZone) return;
  zoneModalIcon.innerHTML = iconHtml(nextZone.icon, "svg-ic-hero");
  zoneModalTitle.textContent = t("zoneModalTitle", { name: tZoneField(nextZone, "name") });
  zoneModalDesc.textContent = t("zoneModalDesc", {
    desc: tZoneField(nextZone, "desc"),
    crystals: nextZone.rewardCrystals,
    mult: nextZone.incomeMult
  });
  zoneModal.classList.remove("hidden");
}

function updateHudAndButtons() {
  const curZone = getActiveZone(state);
  const totals = getTotals(state);
  hudCash.textContent = formatCompact(state.cash, "$");
  hudIncome.textContent = `+${formatCompact(totals.effectiveIncomePerSec, "$")}/${t("secUnit")}`;
  hudWatts.textContent = formatWatts(totals.totalWatts);
  hudCrystalVal.textContent = String(state.crystals || 0);

  const avKey = AVATAR_CHOICES.includes(state.profile.avatar) ? state.profile.avatar : "av_0";
  if (btnProfile.dataset.av !== avKey) {
    btnProfile.dataset.av = avKey;
    btnProfile.innerHTML = iconHtml(avKey);
  }

  const eraIdx = getCityEraIndex(state, totals.totalWatts);
  hudEra.textContent = tEraName(curZone, eraIdx);
  if (eraIdx > lastEraIndex) {
    lastEraIndex = eraIdx;
    sound.playFirework();
    world.spawnCityFireworks(26);
    platform.happyTime();
    platform.trackEvent("city_era_up", { zone: curZone.id, era: eraIdx });
    showBannerToast(t("toastNewEra"), tEraName(curZone, eraIdx));
  } else if (eraIdx < lastEraIndex) {
    lastEraIndex = eraIdx;
  }

  const surgeWin = consumeSurgeEvent(state);
  if (surgeWin) {
    sound.playFirework();
    world.spawnCityFireworks(30);
    world.triggerShake(0.22);
    platform.vibrate(35);
    platform.happyTime();
    platform.trackEvent("surge_cleared");
    spawnFlyingOrbs(window.innerWidth * 0.45, 220, crystalPillEl, "crystal", 5);
    showBannerToast(t("surgeWinTitle"), t("surgeWinSub", { cash: formatCompact(surgeWin.cash, "$"), crystals: surgeWin.crystals }));
  }

  if (state.surge?.active) {
    if (!lastSurgeActive) {
      lastSurgeActive = true;
      sound.playSurgeAlert();
      platform.vibrate(20);
    }
    surgePill.classList.remove("hidden");
    surgePill.textContent = t("surgeBanner", {
      taps: state.surge.taps,
      target: state.surge.targetTaps,
      sec: Math.ceil(state.surge.timeLeft)
    });
  } else {
    lastSurgeActive = false;
    surgePill.classList.add("hidden");
  }

  if (dailyDot) {
    dailyDot.classList.toggle("hidden", !getDailyStatus(state).canClaim);
  }

  const claimed = checkAndClaimGoals(state);
  if (claimed.length > 0) {
    const lastGoal = claimed[claimed.length - 1];
    sound.playUnlock();
    world.triggerShake(0.18);
    spawnFlyingOrbs(window.innerWidth * 0.4, 130, crystalPillEl, "crystal", 4);
    showBannerToast(
      t("toastGoalDone", { cash: formatCompact(lastGoal.rewardCash, "$") }),
      tGoalField(curZone.id, lastGoal, "title")
    );
  }

  const newAchs = checkAchievements(state);
  if (newAchs.length > 0) {
    sound.playUnlock();
    spawnFlyingOrbs(window.innerWidth * 0.4, 150, crystalPillEl, "crystal", 4);
    showBannerToast(t("toastAch", { crystals: newAchs[0].crystals }), tAchField(newAchs[0], "name"));
  }

  const goalInfo = getCurrentGoalProgress(state);
  const readyNext = canAdvanceZone(state);

  if (readyNext) {
    btnAdvanceZone.classList.remove("hidden");
    btnAdvanceZone.textContent = t("advanceZoneBtn", {
      name: tZoneField(readyNext, "name"),
      mult: readyNext.incomeMult,
      crystals: readyNext.rewardCrystals
    });
  } else {
    btnAdvanceZone.classList.add("hidden");
  }

  if (goalInfo.completedAll && !readyNext) {
    goalTitle.textContent = t("goalAllDoneTitle", { zone: tZoneField(curZone, "name") });
    goalNumbers.textContent = formatWatts(goalInfo.currentWatts);
    goalFill.style.width = "100%";
    goalSub.textContent = t("goalAllDoneSub");
  } else {
    goalTitle.textContent = t("goalFormat", {
      idx: goalInfo.index + 1,
      total: goalInfo.totalGoals,
      title: tGoalField(curZone.id, goalInfo.goal, "title")
    });
    goalNumbers.textContent = `${formatWatts(goalInfo.currentWatts)} / ${formatWatts(goalInfo.goal.targetWatts)}`;
    goalFill.style.width = `${goalInfo.percent.toFixed(1)}%`;
    goalSub.textContent = t("goalReward", {
      cash: formatCompact(goalInfo.goal.rewardCash, "$"),
      crystals: goalInfo.goal.rewardCrystals || 0
    });
  }

  renderZoneStrip();
  applyOnboardingVisibility();

  if (tapCombo > 1 && performance.now() - lastTapAt > 1050) {
    tapCombo = 0;
  }
  const cMult = getComboMult();
  if (cMult > 1) {
    comboPill.classList.remove("hidden");
    comboPill.textContent = t("comboLabel", { mult: cMult });
  } else {
    comboPill.classList.add("hidden");
  }

  // Event alert chip
  if (world.activeEvent) {
    btnEventAlert.classList.remove("hidden");
    btnEventAlert.textContent = world.activeEvent.type === "drone" ? t("eventDrone") : t("eventCrate");
  } else {
    btnEventAlert.classList.add("hidden");
  }

  // Mini-quest bar (unlocked after initial onboarding)
  const unlocks = getOnboardingUnlocks(state);
  if (unlocks.upgrades) {
    const q = getActiveQuest(state);
    questPill.classList.remove("hidden");
    questText.textContent = t("questPrefix", { title: tQuestTitle(q.tpl), cur: q.progress, target: q.target });
    if (q.ready) {
      btnQuestClaim.classList.remove("hidden");
      btnQuestClaim.textContent = t("questClaimBtn", { crystals: q.rewardCrystals });
    } else {
      btnQuestClaim.classList.add("hidden");
    }
  } else {
    questPill.classList.add("hidden");
  }

  const pct = Math.round(state.overdrive * 100);
  overdriveFill.style.width = `${pct}%`;
  overdriveLabel.textContent =
    state.overdrive > 0.02
      ? t("overdriveActive", { mult: totals.overdriveMult.toFixed(1) })
      : t("overdriveIdle");

  renderActiveBoostersHud();
  refreshMaxStationButtons();
  refreshPrestigeLive();
  refreshButtonStates();
  refreshMiningBars();
}

cardsList.addEventListener("click", (e) => {
  const btn = e.target.closest(".buy-btn");
  if (!btn) return;

  const action = btn.dataset.action;
  const id = btn.dataset.id;

  if (action === "station") {
    const wasUnlocked = state.stations[id]?.unlocked;
    if (buyStationAction(state, id, buyMult)) {
      if (!wasUnlocked) {
        sound.playBuild();
        world.triggerShake(0.24);
        platform.vibrate(18);
        platform.trackEvent("station_unlocked", { id, zone: state.activeZoneId });
      } else {
        sound.playBuy();
        platform.vibrate(8);
      }
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
        showBannerToast(t("toastInvest"), `+${formatCompact(res.cashGranted, "$")}`);
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
  } else if (action === "architect") {
    if (triggerArchitectAscension(state) > 0) {
      sound.playUnlock();
      lastEraIndex = 0;
      lastZoneStripSig = "";
      world.setZoneTheme(state.activeZoneId);
      world.setCameraPreset(0);
      showBannerToast(t("toastArchitect", { mult: Math.pow(2, state.architects || 0) }), t("architectBtnSub"));
      saveState(state);
      renderCards();
      updateHudAndButtons();
    }
  }
});

btnAdvanceZone.addEventListener("click", openZoneTransitionModal);

btnEventAlert.addEventListener("click", () => {
  const collected = world.collectActiveEvent();
  if (collected) handleEventCollected(collected);
});

btnQuestClaim.addEventListener("click", () => {
  const res = claimQuestReward(state);
  if (res) {
    sound.playUnlock();
    const rect = questPill.getBoundingClientRect();
    spawnFlyingOrbs(rect.right - 30, rect.top + 10, crystalPillEl, "crystal", 4);
    spawnFlyingOrbs(rect.left + 40, rect.top + 10, cashPillEl, "gold", 3);
    showBannerToast(t("toastQuestDone"), `+${formatCompact(res.cash, "$")} · +${res.crystals} ${t("crystalsShort")}`);
    saveState(state);
    updateHudAndButtons();
  }
});
btnCancelZone.addEventListener("click", () => zoneModal.classList.add("hidden"));
btnConfirmZone.addEventListener("click", () => {
  const nextZone = advanceToNextZone(state);
  if (nextZone) {
    zoneModal.classList.add("hidden");
    lastEraIndex = 0;
    sound.playUnlock();
    world.setZoneTheme(state.activeZoneId);
    showBannerToast(t("toastNewZone", { mult: nextZone.incomeMult }), tZoneField(nextZone, "name"));
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
    btnPanToggle.title = t("titlePan");
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
  resetConfirmBox.classList.add("hidden");
  renderProfileModal();
  profileModal.classList.remove("hidden");
});
btnCloseProfile.addEventListener("click", () => {
  profileModal.classList.add("hidden");
  saveState(state);
});

function renderDailyModal() {
  if (!dailyGrid || !btnClaimDaily) return;
  const st = getDailyStatus(state);
  dailyGrid.innerHTML = "";
  for (let i = 0; i < st.rewards.length; i += 1) {
    const r = st.rewards[i];
    const completed = i < (st.streak % 7) || (!st.canClaim && i === st.nextDayIndex - 1);
    const isCurrent = st.canClaim && i === st.nextDayIndex;
    const card = document.createElement("div");
    card.className = `daily-card${completed ? " claimed" : ""}${isCurrent ? " active" : ""}`;
    card.innerHTML = `
      <strong>${t("dailyDay", { d: r.day })}</strong>
      <span style="color:#e9d5ff;font-weight:800">+${r.crystals} ${t("crystalsShort")}</span>
      <span style="color:#4ade80;font-size:10px">+${r.cashSec}${t("secUnit")}</span>
    `;
    dailyGrid.appendChild(card);
  }
  btnClaimDaily.disabled = !st.canClaim;
  btnClaimDaily.textContent = st.canClaim ? t("dailyClaim") : t("dailyDone");
}

if (btnDaily) {
  btnDaily.addEventListener("click", () => {
    renderDailyModal();
    dailyModal.classList.remove("hidden");
  });
}
if (btnCloseDaily) {
  btnCloseDaily.addEventListener("click", () => dailyModal.classList.add("hidden"));
}
if (btnClaimDaily) {
  btnClaimDaily.addEventListener("click", () => {
    const res = claimDailyReward(state);
    if (res) {
      sound.playFirework();
      world.spawnCityFireworks(22);
      platform.vibrate(25);
      platform.trackEvent("daily_claimed", { day: res.day });
      dailyModal.classList.add("hidden");
      showBannerToast(t("toastDaily", { d: res.day }), `+${formatCompact(res.cash, "$")} · +${res.crystals} ${t("crystalsShort")}`);
      saveState(state);
      updateHudAndButtons();
    }
  });
}

btnResetPrompt.addEventListener("click", () => {
  resetConfirmBox.classList.toggle("hidden");
});
btnResetCancel.addEventListener("click", () => {
  resetConfirmBox.classList.add("hidden");
});
btnResetConfirm.addEventListener("click", () => {
  resetAllProgress(state);
  resetConfirmBox.classList.add("hidden");
  profileModal.classList.add("hidden");
  lastEraIndex = 0;
  lastZoneStripSig = "";
  tapCombo = 0;
  activeTab = "stations";
  document.querySelectorAll(".tab-btn").forEach((b) => {
    b.classList.toggle("active", b.dataset.tab === "stations");
  });
  world.setZoneTheme("valley");
  world.setCameraPreset(0);
  renderCards();
  updateHudAndButtons();
  showBannerToast(t("toastResetTitle"), t("toastResetSub"));
});
avatarPicker.addEventListener("click", (e) => {
  const opt = e.target.closest(".avatar-opt");
  if (!opt) return;
  state.profile.avatar = opt.dataset.avatar;
  renderProfileModal();
  saveState(state);
});
profileNameInput.addEventListener("input", () => {
  state.profile.name = profileNameInput.value.trim() || t("defaultCallsign");
});

if (btnLang) {
  btnLang.addEventListener("click", () => {
    setLang(getLang() === "ru" ? "en" : "ru");
    applyStaticTranslations();
    renderCards();
    updateHudAndButtons();
  });
}

if (btnFullscreen) {
  btnFullscreen.addEventListener("click", () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  });
}

btnSound.addEventListener("click", () => {
  userMuted = !userMuted;
  sound.setEnabled(!userMuted);
  btnSound.innerHTML = iconHtml(userMuted ? "sound_off" : "sound_on");
});

window.addEventListener("keydown", (e) => {
  if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")) return;
  if (e.code === "Space") {
    e.preventDefault();
    if (e.repeat) return;
    const comboMult = registerTapCombo();
    const earned = applyTap(state, comboMult);
    sound.playTap(tapCombo);
    const rect = canvas.getBoundingClientRect();
    const x = rect.left + rect.width * (window.innerWidth >= 1024 ? 0.34 : 0.45);
    const y = rect.top + rect.height * 0.5;
    spawnTapText(x, y, earned, comboMult);
    spawnFlyingOrbs(x, y, cashPillEl, "gold", 2);
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
  offlineTime.textContent = t("offlineAway", { mins });
  offlineReward.textContent = `+${formatCompact(offlineEarned, "$")}`;
  offlineModal.classList.remove("hidden");
}

let lastFrameTime = performance.now();
let uiAccumulator = 0;
let saveAccumulator = 0;
let lastEventType = null;
let hiddenAt = null;
let rafId = 0;

window.addEventListener("resize", () => world.resize());
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    hiddenAt = Date.now();
    saveState(state);
    sound.setEnabled(false);
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
  } else {
    if (hiddenAt) {
      const awaySec = Math.min(8 * 3600, Math.max(0, (Date.now() - hiddenAt) / 1000));
      hiddenAt = null;
      if (awaySec >= 3) {
        const { unboostedIncomePerSec } = getTotals(state);
        const offlineMult = 0.35 + (state.shopPerks?.offline_amp || 0) * 0.25;
        const gained = unboostedIncomePerSec * awaySec * offlineMult;
        if (gained > 0) {
          state.cash += gained;
          state.runCash += gained;
          state.lifetimeCash += gained;
        }
      }
    }
    sound.setEnabled(!userMuted);
    lastFrameTime = performance.now();
    if (!rafId) rafId = requestAnimationFrame(frame);
  }
});
window.addEventListener("pagehide", () => saveState(state));

function frame(now) {
  const dt = (now - lastFrameTime) / 1000;
  lastFrameTime = now;

  if ((state.boosters?.auto_tap || 0) > 0) {
    autoTapAcc += dt;
    if (autoTapAcc >= 0.34) {
      autoTapAcc -= 0.34;
      const earned = applyTap(state);
      const rect = canvas.getBoundingClientRect();
      spawnTapText(rect.left + rect.width * 0.42, rect.top + rect.height * 0.48, earned);
      world.spawnSplash(-1.2, 0.5, 2.0, 4);
    }
  }

  const payouts = tickEconomy(state, dt);
  world.render(state);

  const curEventType = world.activeEvent ? world.activeEvent.type : null;
  if (curEventType !== lastEventType) {
    lastEventType = curEventType;
    updateHudAndButtons();
  }

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

  rafId = requestAnimationFrame(frame);
}

applyStaticTranslations();
renderCards();
updateHudAndButtons();
rafId = requestAnimationFrame(frame);

window.__WATER_POWER_DEBUG__ = {
  state,
  world,
  platform,
  startSurge: () => {
    startCitySurge(state);
    updateHudAndButtons();
  },
  setLang: (lang) => {
    setLang(lang);
    applyStaticTranslations();
    renderCards();
    updateHudAndButtons();
  },
  refreshHud: updateHudAndButtons,
  getTotals: () => getTotals(state),
  grantCash: (amt) => {
    state.cash += amt;
    state.runCash += amt;
    state.lifetimeCash += amt;
    renderCards();
    updateHudAndButtons();
  }
};
