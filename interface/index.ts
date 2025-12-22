import type {DeepLinkPlatform }  from "../types";
interface DeepLinkResult {
  webUrl: string;
  ios: string | null;
  android: string | null;
  platform: DeepLinkPlatform;
}

interface OpenLinkOptions {
  /** Fall back to web URL if app deep link fails (default: true) */
  fallbackToWeb?: boolean;
  /** Delay before fallback to web (default: 2500ms) */
  fallbackDelay?: number;
  /** Open in new tab instead of replacing (default: false) */
  openInNewTab?: boolean;
}

export type { OpenLinkOptions, DeepLinkResult };
