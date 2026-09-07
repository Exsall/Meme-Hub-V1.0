import { AnalyticsEvent } from '../types/game';
import { GAME_CONFIG } from '../config/gameConfig';

class AnalyticsTracker {
  private events: AnalyticsEvent[] = [];
  private maxStored = 100;

  constructor() {
    this.loadFromStorage();
    if (GAME_CONFIG.features.enableAnalytics) {
      this.track('game_start', { timestamp: Date.now() });
    }
  }

  private loadFromStorage() {
    try {
      const saved = localStorage.getItem('meme_lab_analytics');
      if (saved) {
        this.events = JSON.parse(saved);
      }
    } catch (e) {
      this.events = [];
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('meme_lab_analytics', JSON.stringify(this.events.slice(-this.maxStored)));
    } catch (e) {
      // Storage quota safety
    }
  }

  public track(event: string, details?: Record<string, any>) {
    if (!GAME_CONFIG.features.enableAnalytics) return;

    const entry: AnalyticsEvent = {
      event,
      timestamp: Date.now(),
      details,
    };
    this.events.push(entry);
    if (this.events.length > this.maxStored) {
      this.events.shift();
    }
    this.saveToStorage();
    if (import.meta.env.DEV) {
      console.log(`[Analytics: ${event}]`, details || {});
    }
  }

  public getEvents(): AnalyticsEvent[] {
    if (!GAME_CONFIG.features.enableAnalytics) return [];
    return [...this.events].reverse();
  }

  public clearEvents() {
    this.events = [];
    this.saveToStorage();
  }
}

export const analytics = new AnalyticsTracker();
