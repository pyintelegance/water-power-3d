/**
 * Unified lifecycle & portal bridge for Yandex Games, CrazyGames, itch.io, and Capacitor Android.
 * Gracefully degrades to no-ops in standalone web or offline APK builds.
 */
export class PlatformBridge {
  constructor(onVisibilityPause) {
    this.onVisibilityPause = onVisibilityPause;
    this.sdkType = "standalone";
    this.ysdk = null;
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
}
