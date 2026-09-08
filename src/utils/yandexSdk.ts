import { soundManager } from './audio';

// Yandex Games SDK typings used by Meme Lab.
// The shapes mirror the current HTML5 SDK API while keeping the project dependency-free.
export interface YandexPlayer {
  getUniqueID: () => string;
  getName: () => string;
  getPhoto: (size: 'small' | 'medium' | 'large') => string;
  getMode: () => 'lite' | '';
  getData: (keys?: string[]) => Promise<Record<string, unknown>>;
  setData: (data: Record<string, unknown>, flush?: boolean) => Promise<void>;
  getStats: (keys?: string[]) => Promise<Record<string, number>>;
  setStats: (stats: Record<string, number>) => Promise<void>;
  incrementStats: (increments: Record<string, number>) => Promise<Record<string, number>>;
}

type YandexSdkEvent = 'game_api_pause' | 'game_api_resume';

type FullscreenCallbacks = {
  onOpen?: () => void;
  onClose?: (wasShown: boolean) => void;
  onError?: (error: unknown) => void;
  onOffline?: () => void;
};

type RewardedCallbacks = {
  onOpen?: () => void;
  onRewarded?: () => void;
  onClose?: (wasShown: boolean) => void;
  onError?: (error: unknown) => void;
};

export interface YandexSDK {
  deviceInfo: {
    type: 'desktop' | 'mobile' | 'tablet' | 'tv';
    isMobile: () => boolean;
    isTablet: () => boolean;
    isDesktop: () => boolean;
    isTV: () => boolean;
  };
  environment: {
    app: { id: string };
    browser: { lang: string };
    i18n: { lang: string; tld: string };
  };
  getPlayer: (options?: { scopes?: boolean; signed?: boolean }) => Promise<YandexPlayer>;
  feedback?: {
    canReview: () => Promise<{ value: boolean; reason?: string }>;
    requestReview: () => Promise<{ value: boolean }>;
  };
  adv: {
    showFullscreenAdv: (options?: { callbacks?: FullscreenCallbacks }) => void;
    showRewardedVideo: (options?: { callbacks?: RewardedCallbacks }) => void;
  };
  features: {
    LoadingAPI?: {
      ready: () => void;
    };
    GameplayAPI?: {
      start: () => void;
      stop: () => void;
    };
  };
  on?: (event: YandexSdkEvent, callback: () => void) => void;
  off?: (event: YandexSdkEvent, callback: () => void) => void;
}

declare global {
  interface Window {
    YaGames?: {
      init: () => Promise<YandexSDK>;
    };
    ysdk?: YandexSDK;
  }
}

type PendingCloudSave = {
  storageKey: string;
  data: Record<string, unknown>;
};

const CLOUD_SAVE_MIN_INTERVAL_MS = 15_000;
const CLOUD_SAVE_MAX_BYTES = 195 * 1024;
const SUPPORTED_LANGUAGES = new Set(['ru']);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const parseStoredValue = (value: unknown): Record<string, unknown> | null => {
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return isRecord(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }

  return isRecord(value) ? value : null;
};

const getTimestamp = (data: Record<string, unknown> | null, fallback = 0): number => {
  if (!data) return fallback;
  const raw = data.lastActiveTimestamp;
  const value = typeof raw === 'number' ? raw : Number(raw);
  return Number.isFinite(value) && value > 0 ? value : fallback;
};

class YandexGamesService {
  private ysdk: YandexSDK | null = null;
  private player: YandexPlayer | null = null;
  private initPromise: Promise<boolean> | null = null;
  private isPlayerGuest = true;
  private isInitialized = false;
  private gameReadySent = false;
  private gameReadyScheduled = false;
  private firstGameplayInteractionArmed = false;
  private activeLanguage = 'ru';

  private pendingCloudSave: PendingCloudSave | null = null;
  private cloudSaveTimer: ReturnType<typeof setTimeout> | null = null;
  private cloudSaveInFlight = false;
  private lastCloudSaveAt = 0;

  private readonly pauseCallback = () => {
    soundManager.muteForAd();
    void this.flushPendingCloudSave(true, true);
    window.dispatchEvent(new CustomEvent('meme-lab-platform-pause'));
  };

  private readonly resumeCallback = () => {
    if (document.visibilityState !== 'hidden') {
      soundManager.unmuteAfterAd();
    }
    window.dispatchEvent(new CustomEvent('meme-lab-platform-resume'));
  };

  private readonly visibilityCallback = () => {
    if (document.visibilityState === 'hidden') {
      soundManager.muteForAd();
      this.notifyGameplayStop();
      void this.flushPendingCloudSave(true, true);
    } else {
      soundManager.unmuteAfterAd();
      if (this.gameReadySent) this.notifyGameplayStart();
    }
  };

  private readonly pageHideCallback = () => {
    void this.flushPendingCloudSave(true, true);
  };

  public async init(): Promise<boolean> {
    if (this.isInitialized) return true;
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      try {
        if (typeof window === 'undefined' || !window.YaGames) {
          console.log('[Yandex SDK] YaGames is unavailable. Standalone development mode.');
          return false;
        }

        console.log('[Yandex SDK] Initializing SDK...');
        const sdk = await window.YaGames.init();
        this.ysdk = sdk;
        window.ysdk = sdk;

        this.applyLanguageFromSdk();
        this.attachLifecycleListeners();

        try {
          this.player = await sdk.getPlayer({ scopes: false });
          this.isPlayerGuest = this.player.getMode() === 'lite';
          console.log('[Yandex SDK] Player loaded. Mode:', this.player.getMode());
        } catch (playerErr) {
          console.warn('[Yandex SDK] Player object is unavailable:', playerErr);
          this.player = null;
          this.isPlayerGuest = true;
        }

        this.isInitialized = true;
        console.log('[Yandex SDK] Successfully initialized.');
        return true;
      } catch (err) {
        console.warn('[Yandex SDK] Initialization failed:', err);
        return false;
      }
    })();

    return this.initPromise;
  }

  private applyLanguageFromSdk(): void {
    const requested = this.ysdk?.environment?.i18n?.lang?.toLowerCase() || 'ru';
    this.activeLanguage = SUPPORTED_LANGUAGES.has(requested) ? requested : 'ru';

    if (typeof document !== 'undefined') {
      document.documentElement.lang = this.activeLanguage;
      document.documentElement.dataset.platformLanguage = requested;
    }

    window.dispatchEvent(
      new CustomEvent('meme-lab-language', {
        detail: { requested, active: this.activeLanguage },
      }),
    );
  }

  private attachLifecycleListeners(): void {
    if (!this.ysdk || typeof window === 'undefined') return;

    this.ysdk.on?.('game_api_pause', this.pauseCallback);
    this.ysdk.on?.('game_api_resume', this.resumeCallback);
    document.addEventListener('visibilitychange', this.visibilityCallback);
    window.addEventListener('pagehide', this.pageHideCallback);
  }

  private scheduleGameReady(): void {
    if (this.gameReadySent || this.gameReadyScheduled || !this.ysdk) return;
    this.gameReadyScheduled = true;

    const sendReady = () => {
      if (typeof requestAnimationFrame === 'function') {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => this.notifyGameReady());
        });
      } else {
        setTimeout(() => this.notifyGameReady(), 0);
      }
    };

    // Queue after the caller's await continuation so React can apply loaded save state first.
    setTimeout(sendReady, 0);
  }

  public notifyGameReady(): void {
    if (this.gameReadySent || !this.ysdk) return;

    try {
      this.ysdk.features?.LoadingAPI?.ready();
      this.gameReadySent = true;
      console.log('[Yandex SDK] LoadingAPI.ready() sent.');
      this.armGameplayOnFirstInteraction();
    } catch (error) {
      this.gameReadyScheduled = false;
      console.warn('[Yandex SDK] LoadingAPI.ready() failed:', error);
    }
  }

  private armGameplayOnFirstInteraction(): void {
    if (this.firstGameplayInteractionArmed || typeof window === 'undefined') return;
    this.firstGameplayInteractionArmed = true;

    const start = () => {
      if (document.visibilityState !== 'hidden') {
        this.notifyGameplayStart();
      }
    };

    window.addEventListener('pointerdown', start, { once: true, passive: true });
    window.addEventListener('keydown', start, { once: true });
  }

  public getSDK(): YandexSDK | null {
    return this.ysdk;
  }

  public getPlayer(): YandexPlayer | null {
    return this.player;
  }

  public getLanguage(): string {
    return this.activeLanguage;
  }

  public isAvailable(): boolean {
    // Production must never fall back to simulated rewarded ads if the SDK failed.
    // Returning true in PROD routes ad requests through the real-SDK wrapper, which
    // safely returns failure when ysdk is missing. DEV keeps the existing mock ads.
    return this.ysdk !== null || import.meta.env.PROD;
  }

  public isCloudSaveAvailable(): boolean {
    return this.player !== null;
  }

  public isGuest(): boolean {
    return this.isPlayerGuest;
  }

  private readLocalData(storageKey: string): Record<string, unknown> | null {
    if (typeof window === 'undefined' || !window.localStorage) return null;

    try {
      const local = localStorage.getItem(storageKey);
      return local ? parseStoredValue(local) : null;
    } catch (error) {
      console.warn('[Yandex SDK] Local save read failed:', error);
      return null;
    }
  }

  private writeLocalData(storageKey: string, data: Record<string, unknown>): void {
    if (typeof window === 'undefined' || !window.localStorage) return;

    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('[Yandex SDK] Local save write failed:', error);
    }
  }

  /**
   * Loads both local and cloud saves and returns the newest copy.
   * This prevents an older cloud snapshot from overwriting newer local progress.
   */
  public async loadData(storageKey: string): Promise<Record<string, unknown> | null> {
    const localData = this.readLocalData(storageKey);
    let cloudData: Record<string, unknown> | null = null;
    let cloudUpdatedAt = 0;

    try {
      if (this.player) {
        const result = await this.player.getData([storageKey, '_lastUpdated']);
        cloudData = parseStoredValue(result?.[storageKey]);
        const rawUpdated = result?.['_lastUpdated'];
        const parsedUpdated = typeof rawUpdated === 'number' ? rawUpdated : Number(rawUpdated);
        cloudUpdatedAt = Number.isFinite(parsedUpdated) ? parsedUpdated : 0;
      }

      const localUpdatedAt = getTimestamp(localData);
      const effectiveCloudUpdatedAt = Math.max(cloudUpdatedAt, getTimestamp(cloudData));

      let chosen: Record<string, unknown> | null = null;

      if (localData && cloudData) {
        chosen = localUpdatedAt > effectiveCloudUpdatedAt ? localData : cloudData;
      } else {
        chosen = cloudData || localData;
      }

      if (chosen === cloudData && cloudData) {
        // Keep the local fallback synchronized with the selected cloud snapshot.
        this.writeLocalData(storageKey, cloudData);
      } else if (chosen === localData && localData && this.player) {
        // Local data is newer; queue it back to cloud without blocking startup.
        this.pendingCloudSave = { storageKey, data: localData };
        this.scheduleCloudSave();
      }

      return chosen;
    } catch (error) {
      console.warn('[Yandex SDK] Cloud save read failed; using local fallback:', error);
      return localData;
    } finally {
      this.scheduleGameReady();
    }
  }

  /**
   * Saves locally immediately and coalesces cloud writes. The SDK limit is
   * 100 setData calls per 5 minutes, so cloud writes are intentionally throttled.
   */
  public async saveData(storageKey: string, data: Record<string, unknown>): Promise<boolean> {
    this.writeLocalData(storageKey, data);
    this.pendingCloudSave = { storageKey, data };

    if (!this.player) return true;

    const elapsed = Date.now() - this.lastCloudSaveAt;
    if (elapsed >= CLOUD_SAVE_MIN_INTERVAL_MS && !this.cloudSaveInFlight) {
      return this.flushPendingCloudSave(false, false);
    }

    this.scheduleCloudSave();
    return true;
  }

  private scheduleCloudSave(): void {
    if (!this.player || this.cloudSaveTimer || !this.pendingCloudSave) return;

    const elapsed = Date.now() - this.lastCloudSaveAt;
    const delay = Math.max(250, CLOUD_SAVE_MIN_INTERVAL_MS - elapsed);

    this.cloudSaveTimer = setTimeout(() => {
      this.cloudSaveTimer = null;
      void this.flushPendingCloudSave(false, false);
    }, delay);
  }

  private async flushPendingCloudSave(flush: boolean, force: boolean): Promise<boolean> {
    if (!this.player || !this.pendingCloudSave) return true;

    if (this.cloudSaveInFlight) {
      this.scheduleCloudSave();
      return true;
    }

    const elapsed = Date.now() - this.lastCloudSaveAt;
    if (!force && elapsed < CLOUD_SAVE_MIN_INTERVAL_MS) {
      this.scheduleCloudSave();
      return true;
    }

    if (this.cloudSaveTimer) {
      clearTimeout(this.cloudSaveTimer);
      this.cloudSaveTimer = null;
    }

    const pending = this.pendingCloudSave;
    this.pendingCloudSave = null;
    this.cloudSaveInFlight = true;

    const payload: Record<string, unknown> = {
      [pending.storageKey]: pending.data,
      _lastUpdated: Date.now(),
    };

    try {
      const bytes = new Blob([JSON.stringify(payload)]).size;
      if (bytes > CLOUD_SAVE_MAX_BYTES) {
        console.error(
          `[Yandex SDK] Cloud save skipped: ${bytes} bytes exceeds safe ${CLOUD_SAVE_MAX_BYTES}-byte budget.`,
        );
        return false;
      }

      await this.player.setData(payload, flush);
      this.lastCloudSaveAt = Date.now();
      return true;
    } catch (error) {
      console.warn('[Yandex SDK] player.setData failed:', error);
      // Preserve the newest pending snapshot for a later retry.
      if (!this.pendingCloudSave) this.pendingCloudSave = pending;
      this.scheduleCloudSave();
      return false;
    } finally {
      this.cloudSaveInFlight = false;
      if (this.pendingCloudSave) this.scheduleCloudSave();
    }
  }

  /** Show a rewarded video and resolve success only after onRewarded. */
  public showRewardedVideo(): Promise<{ success: boolean; error?: unknown }> {
    return new Promise((resolve) => {
      if (!this.ysdk?.adv) {
        console.warn('[Yandex SDK] Rewarded video unavailable. No reward will be granted.');
        resolve({ success: false });
        return;
      }

      let rewarded = false;
      let settled = false;

      const finish = (result: { success: boolean; error?: unknown }) => {
        if (settled) return;
        settled = true;
        if (document.visibilityState !== 'hidden') {
          soundManager.unmuteAfterAd();
          this.notifyGameplayStart();
        }
        resolve(result);
      };

      try {
        this.notifyGameplayStop();
        soundManager.muteForAd();

        this.ysdk.adv.showRewardedVideo({
          callbacks: {
            onOpen: () => {
              console.log('[Yandex SDK] Rewarded video opened.');
              this.notifyGameplayStop();
              soundManager.muteForAd();
            },
            onRewarded: () => {
              rewarded = true;
              console.log('[Yandex SDK] Rewarded callback fired.');
            },
            onClose: () => {
              console.log('[Yandex SDK] Rewarded video closed. Rewarded:', rewarded);
              finish({ success: rewarded });
            },
            onError: (error) => {
              console.warn('[Yandex SDK] Rewarded video error:', error);
              finish({ success: false, error });
            },
          },
        });
      } catch (error) {
        console.error('[Yandex SDK] Rewarded video exception:', error);
        finish({ success: false, error });
      }
    });
  }

  /** Show an interstitial/fullscreen ad. */
  public showFullscreenAdv(): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.ysdk?.adv) {
        resolve(false);
        return;
      }

      let settled = false;
      const finish = (result: boolean) => {
        if (settled) return;
        settled = true;
        if (document.visibilityState !== 'hidden') {
          soundManager.unmuteAfterAd();
          this.notifyGameplayStart();
        }
        resolve(result);
      };

      try {
        this.notifyGameplayStop();
        soundManager.muteForAd();

        this.ysdk.adv.showFullscreenAdv({
          callbacks: {
            onOpen: () => {
              console.log('[Yandex SDK] Fullscreen ad opened.');
              this.notifyGameplayStop();
              soundManager.muteForAd();
            },
            onClose: (wasShown) => {
              console.log('[Yandex SDK] Fullscreen ad closed. Shown:', wasShown);
              finish(wasShown);
            },
            onError: (error) => {
              console.warn('[Yandex SDK] Fullscreen ad error:', error);
              finish(false);
            },
            onOffline: () => {
              console.log('[Yandex SDK] Offline mode, fullscreen ad skipped.');
              finish(false);
            },
          },
        });
      } catch (error) {
        console.error('[Yandex SDK] Fullscreen ad exception:', error);
        finish(false);
      }
    });
  }

  public notifyGameplayStart(): void {
    try {
      this.ysdk?.features?.GameplayAPI?.start();
    } catch (error) {
      console.warn('[Yandex SDK] GameplayAPI.start() failed:', error);
    }
  }

  public notifyGameplayStop(): void {
    try {
      this.ysdk?.features?.GameplayAPI?.stop();
    } catch (error) {
      console.warn('[Yandex SDK] GameplayAPI.stop() failed:', error);
    }
  }
}

export const yandexSdk = new YandexGamesService();
