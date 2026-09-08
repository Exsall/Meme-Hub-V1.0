// Yandex Games SDK TypeScript definitions & Helper wrapper

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
    showFullscreenAdv: (callbacks?: {
      onOpen?: () => void;
      onClose?: (wasShown: boolean) => void;
      onError?: (error: unknown) => void;
      onOffline?: () => void;
    }) => void;
    showRewardedVideo: (callbacks?: {
      onOpen?: () => void;
      onRewarded?: () => void;
      onClose?: () => void;
      onError?: (error: unknown) => void;
    }) => void;
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
}

declare global {
  interface Window {
    YaGames?: {
      init: () => Promise<YandexSDK>;
    };
    ysdk?: YandexSDK;
  }
}

class YandexGamesService {
  private ysdk: YandexSDK | null = null;
  private player: YandexPlayer | null = null;
  private isInitializing: boolean = false;
  private initPromise: Promise<boolean> | null = null;
  private isPlayerGuest: boolean = true;
  private isInitialized: boolean = false;

  public async init(): Promise<boolean> {
    if (this.isInitialized) return true;
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      this.isInitializing = true;
      try {
        if (typeof window !== 'undefined' && window.YaGames) {
          console.log('[Yandex SDK] Initializing SDK...');
          const sdk = await window.YaGames.init();
          this.ysdk = sdk;
          window.ysdk = sdk;

          // Notify loading ready
          try {
            sdk.features?.LoadingAPI?.ready();
          } catch (e) {
            console.warn('[Yandex SDK] LoadingAPI ready warning:', e);
          }

          // Try to get player
          try {
            this.player = await sdk.getPlayer({ scopes: false });
            this.isPlayerGuest = this.player.getMode() === 'lite';
            console.log('[Yandex SDK] Player loaded. Mode:', this.player.getMode());
          } catch (playerErr) {
            console.warn('[Yandex SDK] Failed to get player object:', playerErr);
            this.player = null;
            this.isPlayerGuest = true;
          }

          this.isInitialized = true;
          console.log('[Yandex SDK] Successfully initialized!');
          return true;
        } else {
          console.log('[Yandex SDK] YaGames script not detected on window. Running in standalone / fallback mode.');
          return false;
        }
      } catch (err) {
        console.warn('[Yandex SDK] Initialization error (likely not on Yandex Games domain):', err);
        return false;
      } finally {
        this.isInitializing = false;
      }
    })();

    return this.initPromise;
  }

  public getSDK(): YandexSDK | null {
    return this.ysdk;
  }

  public getPlayer(): YandexPlayer | null {
    return this.player;
  }

  public isAvailable(): boolean {
    return this.ysdk !== null;
  }

  public isCloudSaveAvailable(): boolean {
    return this.player !== null;
  }

  public isGuest(): boolean {
    return this.isPlayerGuest;
  }

  /**
   * Load game save data from Yandex Cloud (player.getData).
   * Falls back to localStorage if Yandex Cloud is unavailable or empty.
   */
  public async loadData(storageKey: string): Promise<Record<string, unknown> | null> {
    // 1. If SDK is available and player is logged, load from cloud
    if (this.player) {
      try {
        console.log('[Yandex SDK] Requesting cloud save from player.getData...');
        const cloudData = await this.player.getData([storageKey]);
        if (cloudData && cloudData[storageKey]) {
          const raw = cloudData[storageKey];
          console.log('[Yandex SDK] Cloud save successfully retrieved!');
          if (typeof raw === 'string') {
            try {
              return JSON.parse(raw);
            } catch {
              return null;
            }
          } else if (typeof raw === 'object' && raw !== null) {
            return raw as Record<string, unknown>;
          }
        }
      } catch (e) {
        console.warn('[Yandex SDK] Error reading player cloud data:', e);
      }
    }

    // 2. Fallback to localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const local = localStorage.getItem(storageKey);
        if (local) {
          return JSON.parse(local);
        }
      } catch (e) {
        console.warn('[Yandex SDK] Error reading fallback localStorage:', e);
      }
    }

    return null;
  }

  /**
   * Save game data to both LocalStorage and Yandex Cloud (player.setData).
   */
  public async saveData(storageKey: string, data: Record<string, unknown>): Promise<boolean> {
    // 1. Always save to localStorage immediately for offline safety
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(data));
      } catch (e) {
        console.error('[Yandex SDK] LocalStorage save error:', e);
      }
    }

    // 2. Save to Yandex Cloud with flush=true for instant persist
    if (this.player) {
      try {
        await this.player.setData(
          {
            [storageKey]: data,
            _lastUpdated: Date.now(),
          },
          true
        );
        return true;
      } catch (e) {
        console.warn('[Yandex SDK] player.setData failed (cloud save error):', e);
        return false;
      }
    }

    return true;
  }

  /**
   * Show Rewarded Video Ad with promise result
   */
  public showRewardedVideo(): Promise<{ success: boolean; error?: unknown }> {
    return new Promise((resolve) => {
      if (!this.ysdk || !this.ysdk.adv) {
        console.log('[Yandex SDK] SDK Rewarded Video not available. Resolving fallback success.');
        resolve({ success: true });
        return;
      }

      try {
        let rewarded = false;

        this.ysdk.adv.showRewardedVideo({
          onOpen: () => {
            console.log('[Yandex SDK] Rewarded video opened');
          },
          onRewarded: () => {
            console.log('[Yandex SDK] Rewarded callback fired');
            rewarded = true;
          },
          onClose: () => {
            console.log('[Yandex SDK] Rewarded video closed. Rewarded:', rewarded);
            resolve({ success: rewarded });
          },
          onError: (err) => {
            console.warn('[Yandex SDK] Rewarded video error:', err);
            resolve({ success: false, error: err });
          },
        });
      } catch (e) {
        console.error('[Yandex SDK] Exception triggering rewarded video:', e);
        resolve({ success: false, error: e });
      }
    });
  }

  /**
   * Show Interstitial / Fullscreen ad
   */
  public showFullscreenAdv(): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.ysdk || !this.ysdk.adv) {
        resolve(true);
        return;
      }

      try {
        this.ysdk.adv.showFullscreenAdv({
          onOpen: () => {
            console.log('[Yandex SDK] Fullscreen ad opened');
          },
          onClose: (wasShown) => {
            console.log('[Yandex SDK] Fullscreen ad closed. Shown:', wasShown);
            resolve(wasShown);
          },
          onError: (err) => {
            console.warn('[Yandex SDK] Fullscreen ad error:', err);
            resolve(false);
          },
          onOffline: () => {
            console.log('[Yandex SDK] Offline mode, ad skipped');
            resolve(false);
          },
        });
      } catch (e) {
        console.error('[Yandex SDK] Exception triggering fullscreen ad:', e);
        resolve(false);
      }
    });
  }

  public notifyGameplayStart(): void {
    try {
      this.ysdk?.features?.GameplayAPI?.start();
    } catch {}
  }

  public notifyGameplayStop(): void {
    try {
      this.ysdk?.features?.GameplayAPI?.stop();
    } catch {}
  }
}

export const yandexSdk = new YandexGamesService();
