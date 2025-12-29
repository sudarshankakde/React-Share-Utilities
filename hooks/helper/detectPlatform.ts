/**
 * Open a link with automatic deep linking for mobile apps
 * Falls back to web URL if app is not installed
 *
 * Supports deep linking for: YouTube, Instagram, TikTok, LinkedIn, Twitter, Telegram, Facebook, WhatsApp, Spotify
 */

import type { DeepLinkPlatform } from "../../index.d.ts";
import { generateDeepLink } from "../deeplink/DeepLink";

// Small helper: determine platform name from URL via deep-link detection
function detectPlatform(url: string): DeepLinkPlatform {
  return generateDeepLink(url).platform;
}

export { detectPlatform };
