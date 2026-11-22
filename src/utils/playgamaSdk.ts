import { soundManager } from './audio';

type RewardedState = 'loading' | 'opened' | 'rewarded' | 'closed' | 'failed';
type InterstitialState = 'loading' | 'opened' | 'closed' | 'failed';
type BannerPosition = 'top' | 'bottom';

interface PlaygamaEventEmitter {
  on: (eventName: string, callback: (...args: any[]) => void) => void;
  off: (eventName: string, callback?: (...args: any[]) => void) => void;
}

export interface PlaygamaAdvertisement extends PlaygamaEventEmitter {
  isRewardedSupported: boolean;
  rewardedState: RewardedState;
  rewardedPlacement: string | null;
  isInterstitialSupported: boolean;
  interstitialState: InterstitialState;
  isBannerSupported: boolean;
  preloadRewarded: (placement?: string | null) => void;
  showRewarded: (placement?: string | null) => void;
  preloadInterstitial: (placement?: string | null) => void;
  showInterstitial: (placement?: string | null) => void;
  showBanner: (position?: BannerPosition, placement?: string | null) => void;
  hideBanner: () => void;
  checkAdBlock?: () => Promise<unknown>;
}

export interface PlaygamaStorage {
  get: (key: string | string[], tryParseJson?: boolean) => Promise<unknown>;
  set: (key: string | string[], value: unknown | unknown[]) => Promise<void>;
  delete: (key: string | string[]) => Promise<void>;
  flush?: () => Promise<void>;
}

export interface PlaygamaPlatform extends PlaygamaEventEmitter {
  id: string;
  language: string;
  isAudioEnabled: boolean;
  isPaused: boolean;
  sendMessage: (message: string, options?: Record<string, unknown> | null) => Promise<unknown>;
  getServerTime?: () => Promise<unknown>;
}

export interface PlaygamaPlayer {
  id?: string | null;
  name?: string | null;
  isAuthorized?: boolean;
  isAuthorizationSupported?: boolean;
}

export interface PlaygamaBridge {
  initialize: (options?: Record<string, unknown>) => Promise<void>;
  platform: PlaygamaPlatform;
  storage: PlaygamaStorage;
  advertisement: PlaygamaAdvertisement;
  player?: PlaygamaPlayer;
  gameVersion?: string;
}

declare global {
  interface Window {
    bridge?: PlaygamaBridge;
    playgamaBridgePromise?: Promise<PlaygamaBridge | null>;
  }
}

const SUPPORTED_LANGUAGES = new Set(['ru']);
const SDK_OPERATION_TIMEOUT_MS = 8_000;
const AD_OPERATION_TIMEOUT_MS = 120_000;

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

const withTimeout = async <T>(promise: Promise<T>, timeoutMs: number, label: string): Promise<T> => {
  let timer: ReturnType<typeof setTimeout> | null = null;

  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => reject(new Error(`${label} timed out after ${timeoutMs}ms`)), timeoutMs);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
};

class PlaygamaService {
  private bridge: PlaygamaBridge | null = null;
  private initPromise: Promise<boolean> | null = null;
  private isInitialized = false;
  private lifecycleAttached = false;
  private gameReadySent = false;
  private gameReadySending = false;
  private gameReadyScheduled = false;
  private firstGameplayInteractionArmed = false;
  private activeLanguage = 'ru';

  private readonly platformPauseCallback = (isPaused: boolean) => {
    if (isPaused) {
      soundManager.muteForAd();
      void this.flushStorage();
      window.dispatchEvent(new CustomEvent('meme-lab-platform-pause'));
      return;
    }

    this.restoreAudioIfAllowed();
    window.dispatchEvent(new CustomEvent('meme-lab-platform-resume'));
  };

  private readonly platformAudioCallback = (isEnabled: boolean) => {
    if (isEnabled) {
      this.restoreAudioIfAllowed();
    } else {
      soundManager.muteForAd();
    }
  };

  private readonly visibilityCallback = () => {
    if (document.visibilityState === 'hidden') {
      soundManager.muteForAd();
      this.notifyGameplayStop();
      void this.flushStorage();
    } else {
      this.restoreAudioIfAllowed();
      if (this.gameReadySent) this.notifyGameplayStart();
    }
  };

  private readonly pageHideCallback = () => {
    void this.flushStorage();
  };

  public async init(): Promise<boolean> {
    if (this.isInitialized && this.bridge) return true;
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      try {
        if (typeof window === 'undefined') return false;

        let sdk: PlaygamaBridge | null = null;

        if (window.playgamaBridgePromise) {
          sdk = await window.playgamaBridgePromise;
        } else if (window.bridge) {
          window.playgamaBridgePromise = window.bridge
            .initialize()
            .then(() => window.bridge ?? null)
            .catch((error) => {
              console.warn('[Playgama Bridge] Initialization failed:', error);
              return null;
            });
          sdk = await window.playgamaBridgePromise;
        }

        if (!sdk) {
          console.log('[Playgama Bridge] SDK unavailable. Standalone preview mode.');
          return false;
        }

        this.bridge = sdk;
        this.bridge.gameVersion = '2.0';
        this.applyLanguageFromSdk();
        this.attachLifecycleListeners();
        this.isInitialized = true;

        console.log(
          '[Playgama Bridge] Initialized.',
          'Platform:',
          sdk.platform?.id ?? 'unknown',
          'Rewarded:',
          Boolean(sdk.advertisement?.isRewardedSupported),
          'Interstitial:',
          Boolean(sdk.advertisement?.isInterstitialSupported),
        );
        return true;
      } catch (error) {
        console.warn('[Playgama Bridge] Initialization failed:', error);
        return false;
      }
    })();

    return this.initPromise;
  }

  private applyLanguageFromSdk(): void {
    const requested = this.bridge?.platform?.language?.toLowerCase() || 'ru';
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
    if (!this.bridge || typeof window === 'undefined' || this.lifecycleAttached) return;
    this.lifecycleAttached = true;

    this.bridge.platform.on('pause_state_changed', this.platformPauseCallback);
    this.bridge.platform.on('audio_state_changed', this.platformAudioCallback);
    document.addEventListener('visibilitychange', this.visibilityCallback);
    window.addEventListener('pagehide', this.pageHideCallback);
  }

  private restoreAudioIfAllowed(): void {
    if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return;
    if (this.bridge?.platform?.isPaused) return;
    if (this.bridge?.platform?.isAudioEnabled === false) return;
    soundManager.unmuteAfterAd();
  }

  private scheduleGameReady(): void {
    if (this.gameReadySent || this.gameReadySending || this.gameReadyScheduled || !this.bridge) return;
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

    setTimeout(sendReady, 0);
  }

  public notifyGameReady(): void {
    if (this.gameReadySent || this.gameReadySending || !this.bridge) return;

    this.gameReadySending = true;
    this.gameReadyScheduled = false;

    void this.bridge.platform
      .sendMessage('game_ready')
      .then(() => {
        this.gameReadySent = true;
        this.gameReadySending = false;
        console.log('[Playgama Bridge] game_ready sent.');
        this.armGameplayOnFirstInteraction();
      })
      .catch((error) => {
        this.gameReadySending = false;
        console.warn('[Playgama Bridge] game_ready failed:', error);
      });
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

  public getSDK(): PlaygamaBridge | null {
    return this.bridge;
  }

  public getPlayer(): PlaygamaPlayer | null {
    return this.bridge?.player ?? null;
  }

  public getLanguage(): string {
    return this.activeLanguage;
  }

  public isAvailable(): boolean {
    // True means Playgama Bridge itself is initialized. Rewarded support is checked
    // inside showRewardedVideo(), so simulated preview ads are never shown on a
    // real Playgama/partner runtime merely because that platform has no ad fill.
    return Boolean(this.bridge && this.isInitialized);
  }

  public isRewardedAvailable(): boolean {
    return Boolean(this.bridge?.advertisement?.isRewardedSupported);
  }

  public isCloudSaveAvailable(): boolean {
    return Boolean(this.bridge && this.isInitialized);
  }

  public isGuest(): boolean {
    return this.bridge?.player?.isAuthorized !== true;
  }

  private readLocalData(storageKey: string): Record<string, unknown> | null {
    if (typeof window === 'undefined' || !window.localStorage) return null;

    try {
      const local = localStorage.getItem(storageKey);
      return local ? parseStoredValue(local) : null;
    } catch (error) {
      console.warn('[Playgama Bridge] Local save read failed:', error);
      return null;
    }
  }

  private writeLocalData(storageKey: string, data: Record<string, unknown>): void {
    if (typeof window === 'undefined' || !window.localStorage) return;

    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (error) {
      console.warn('[Playgama Bridge] Local save write failed:', error);
    }
  }

  public async loadData(storageKey: string): Promise<Record<string, unknown> | null> {
    try {
      if (!this.bridge) {
        return this.readLocalData(storageKey);
      }

      const value = await withTimeout(
        this.bridge.storage.get(storageKey, true),
        SDK_OPERATION_TIMEOUT_MS,
        'Playgama storage.get',
      );
      return parseStoredValue(value);
    } catch (error) {
      console.warn('[Playgama Bridge] Storage read failed; using local fallback:', error);
      return this.readLocalData(storageKey);
    } finally {
      this.scheduleGameReady();
    }
  }

  public async saveData(storageKey: string, data: Record<string, unknown>): Promise<boolean> {
    try {
      if (!this.bridge) {
        this.writeLocalData(storageKey, data);
        return true;
      }

      await this.bridge.storage.set(storageKey, data);
      return true;
    } catch (error) {
      console.warn('[Playgama Bridge] Storage write failed; using local fallback:', error);
      this.writeLocalData(storageKey, data);
      return false;
    }
  }

  private async flushStorage(): Promise<void> {
    try {
      await this.bridge?.storage?.flush?.();
    } catch (error) {
      console.warn('[Playgama Bridge] Storage flush failed:', error);
    }
  }

  public showRewardedVideo(placement = 'rewarded_bonus'): Promise<{ success: boolean; error?: unknown }> {
    return new Promise((resolve) => {
      const advertisement = this.bridge?.advertisement;
      if (!advertisement?.isRewardedSupported) {
        console.warn('[Playgama Bridge] Rewarded video is not supported on this platform.');
        resolve({ success: false });
        return;
      }

      let rewarded = false;
      let settled = false;
      let timer: ReturnType<typeof setTimeout> | null = null;

      const finish = (result: { success: boolean; error?: unknown }) => {
        if (settled) return;
        settled = true;
        if (timer) clearTimeout(timer);
        advertisement.off('rewarded_state_changed', onStateChanged);
        this.restoreAudioIfAllowed();
        this.notifyGameplayStart();
        resolve(result);
      };

      const onStateChanged = (state: RewardedState) => {
        if (state === 'opened') {
          soundManager.muteForAd();
          this.notifyGameplayStop();
          return;
        }

        if (state === 'rewarded') {
          rewarded = true;
          return;
        }

        if (state === 'closed') {
          finish({ success: rewarded });
          return;
        }

        if (state === 'failed') {
          finish({ success: false, error: new Error('Playgama rewarded ad failed') });
        }
      };

      try {
        advertisement.on('rewarded_state_changed', onStateChanged);
        this.notifyGameplayStop();
        soundManager.muteForAd();

        timer = setTimeout(() => {
          finish({ success: false, error: new Error('Playgama rewarded ad timed out') });
        }, AD_OPERATION_TIMEOUT_MS);

        advertisement.showRewarded(placement);
      } catch (error) {
        finish({ success: false, error });
      }
    });
  }

  public showFullscreenAdv(placement = 'game_break'): Promise<boolean> {
    return new Promise((resolve) => {
      const advertisement = this.bridge?.advertisement;
      if (!advertisement?.isInterstitialSupported) {
        resolve(false);
        return;
      }

      let settled = false;
      let timer: ReturnType<typeof setTimeout> | null = null;

      const finish = (result: boolean) => {
        if (settled) return;
        settled = true;
        if (timer) clearTimeout(timer);
        advertisement.off('interstitial_state_changed', onStateChanged);
        this.restoreAudioIfAllowed();
        this.notifyGameplayStart();
        resolve(result);
      };

      const onStateChanged = (state: InterstitialState) => {
        if (state === 'opened') {
          soundManager.muteForAd();
          this.notifyGameplayStop();
          return;
        }

        if (state === 'closed') {
          finish(true);
          return;
        }

        if (state === 'failed') {
          finish(false);
        }
      };

      try {
        advertisement.on('interstitial_state_changed', onStateChanged);
        this.notifyGameplayStop();
        soundManager.muteForAd();

        timer = setTimeout(() => finish(false), AD_OPERATION_TIMEOUT_MS);
        advertisement.showInterstitial(placement);
      } catch {
        finish(false);
      }
    });
  }

  public showBanner(position: BannerPosition = 'bottom', placement = 'persistent_banner'): boolean {
    const advertisement = this.bridge?.advertisement;
    if (!advertisement?.isBannerSupported) return false;

    try {
      advertisement.showBanner(position, placement);
      return true;
    } catch (error) {
      console.warn('[Playgama Bridge] Banner show failed:', error);
      return false;
    }
  }

  public hideBanner(): void {
    try {
      this.bridge?.advertisement?.hideBanner();
    } catch (error) {
      console.warn('[Playgama Bridge] Banner hide failed:', error);
    }
  }

  public notifyGameplayStart(): void {
    if (!this.bridge || !this.gameReadySent) return;
    void this.bridge.platform.sendMessage('gameplay_started').catch(() => {});
  }

  public notifyGameplayStop(): void {
    if (!this.bridge || !this.gameReadySent) return;
    void this.bridge.platform.sendMessage('gameplay_stopped').catch(() => {});
  }
}

export const playgamaSdk = new PlaygamaService();
