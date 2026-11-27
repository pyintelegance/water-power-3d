/**
 * Unified lifecycle, telemetry, haptics & portal SDK bridge for Poki, CrazyGames, Yandex Games, itch.io, and Capacitor Android.
 * Gracefully degrades to no-ops in standalone web or offline APK builds.
 */
export class PlatformBridge {
  constructor(onVisibilityPause) {
    this.onVisibilityPause = onVisibilityPause;
    this.sdkType = "standalone";
    this.ysdk = null;
    this.events = [];
    this.init();
  }

  async init() {
    try {
      if (typeof window.YaGames !== "undefined" && window.YaGames.init) {
        this.sdkType = "yandex";
        this.ysdk = await window.YaGames.init();
        this.ysdk?.features?.LoadingAPI?.ready?.();
        this.ysdk?.features?.GameplayAPI?.start?.();
      } else if (window.CrazyGames?.SDK) {
        this.sdkType = "crazygames";
        await window.CrazyGames.SDK.init?.();
        window.CrazyGames.SDK.game?.sdkGameLoadingStart?.();
        window.CrazyGames.SDK.game?.sdkGameLoadingStop?.();
        window.CrazyGames.SDK.game?.gameplayStart?.();
      } else if (window.PokiSDK) {
        this.sdkType = "poki";
        await window.PokiSDK.init?.();
        window.PokiSDK.gameLoadingFinished?.();
        window.PokiSDK.gameplayStart?.();
      }
    } catch {
      this.sdkType = "standalone";
    }

    document.addEventListener("visibilitychange", () => {
      if (this.onVisibilityPause) {
        this.onVisibilityPause(document.visibilityState === "hidden");
      }
    });
    window.addEventListener("blur", () => {
      if (this.onVisibilityPause) this.onVisibilityPause(true);
    });
    window.addEventListener("focus", () => {
      if (this.onVisibilityPause) this.onVisibilityPause(false);
    });
  }

  vibrate(ms = 12) {
    try {
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(ms);
      }
    } catch {
      // Haptics unavailable
    }
  }

  happyTime() {
    try {
      if (this.sdkType === "poki") window.PokiSDK?.happyTime?.(0.75);
      else if (this.sdkType === "crazygames") window.CrazyGames?.SDK?.game?.happytime?.();
    } catch {
      // Ignore portal errors
    }
  }

  trackEvent(name, params = {}) {
    try {
      this.events.push({ name, params, ts: Date.now() });
      if (this.events.length > 50) this.events.shift();
      if (typeof window.gtag === "function") {
        window.gtag("event", name, params);
      }
      if (window.GameAnalytics?.addDesignEvent) {
        window.GameAnalytics.addDesignEvent(name);
      }
    } catch {
      // Telemetry is best-effort
    }
  }
}
