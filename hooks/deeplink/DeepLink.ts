import type { DeepLinkResult } from "../../../pakage/interface";
import type { SocialParams, SocialPlatform } from "../../../pakage/types";

/**
 * Generate deep links for native apps
 *
 * Supported platforms with examples:
 * - YouTube: https://youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID
 * - YouTube Channel: https://youtube.com/c/CHANNEL_NAME
 * - Instagram: https://instagram.com/USERNAME
 * - TikTok: https://tiktok.com/@USERNAME/video/VIDEO_ID or https://vt.tiktok.com/SHORT_CODE
 * - LinkedIn: https://linkedin.com/in/PROFILE_ID
 * - LinkedIn Company: https://linkedin.com/company/COMPANY_ID
 * - Twitter: https://twitter.com/USERNAME
 * - WhatsApp: Phone number format (extracted if present)
 * - Telegram: https://t.me/USERNAME
 * - Facebook: https://facebook.com/USERNAME
 * - Spotify: https://open.spotify.com/track/TRACK_ID
 */
function generateDeepLink(url: string): DeepLinkResult {
  const webUrl = url.trim();

  // YouTube video
  const youtubeWatchMatch = webUrl.match(/youtube\.com\/watch\?v=([^&]+)/);
  const youtubeShortMatch = webUrl.match(/youtu\.be\/([^?]+)/);

  if (youtubeWatchMatch || youtubeShortMatch) {
    const videoId = youtubeWatchMatch
      ? youtubeWatchMatch[1]
      : youtubeShortMatch![1];
    return {
      webUrl,
      ios: `vnd.youtube://watch?v=${videoId}`,
      android: `intent://watch?v=${videoId}#Intent;scheme=vnd.youtube;package=com.google.android.youtube;end`,
      platform: "youtube",
    };
  }

  // YouTube channel
  const youtubeChannelMatch = webUrl.match(
    /youtube\.com\/c\/([^/?]+)|youtube\.com\/@([^/?]+)/
  );
  if (youtubeChannelMatch) {
    const channelId = youtubeChannelMatch[1] || youtubeChannelMatch[2];
    return {
      webUrl,
      ios: `vnd.youtube://user/${channelId}`,
      android: `intent://user/${channelId}#Intent;scheme=vnd.youtube;package=com.google.android.youtube;end`,
      platform: "youtube_channel",
    };
  }

  // Instagram
  const instagramMatch = webUrl.match(/instagram\.com\/([^/?]+)/);
  if (instagramMatch) {
    const username = instagramMatch[1];
    return {
      webUrl,
      ios: `instagram://user?username=${username}`,
      android: `intent://instagram.com/${username}#Intent;scheme=https;package=com.instagram.android;end`,
      platform: "instagram",
    };
  }

  // TikTok
  const tiktokMatch = webUrl.match(
    /tiktok\.com\/@([^/?]+)|vt\.tiktok\.com\/([^/?]+)/
  );
  if (tiktokMatch) {
    const username = tiktokMatch[1];
    const shortCode = tiktokMatch[2];
    const deepLinkPath = username ? `@${username}` : shortCode;
    return {
      webUrl,
      ios: `tiktok://user/${deepLinkPath}`,
      android: `intent://tiktok.com/${deepLinkPath}#Intent;scheme=https;package=com.ss.android.ugc.tiktok;end`,
      platform: "tiktok",
    };
  }

  // LinkedIn profile
  const linkedinProfileMatch = webUrl.match(/linkedin\.com\/in\/([^/?]+)/);
  if (linkedinProfileMatch) {
    const profileId = linkedinProfileMatch[1];
    return {
      webUrl,
      ios: `linkedin://in/${profileId}`,
      android: `intent://in/${profileId}#Intent;scheme=linkedin;package=com.linkedin.android;end`,
      platform: "linkedin",
    };
  }

  // LinkedIn company
  const linkedinCompanyMatch = webUrl.match(/linkedin\.com\/company\/([^/?]+)/);
  if (linkedinCompanyMatch) {
    const companyId = linkedinCompanyMatch[1];
    return {
      webUrl,
      ios: `linkedin://company/${companyId}`,
      android: `intent://company/${companyId}#Intent;scheme=linkedin;package=com.linkedin.android;end`,
      platform: "linkedin_company",
    };
  }

  // Twitter
  const twitterMatch = webUrl.match(/twitter\.com\/([^/?]+)|x\.com\/([^/?]+)/);
  if (twitterMatch) {
    const username = twitterMatch[1] || twitterMatch[2];
    return {
      webUrl,
      ios: `twitter://user?screen_name=${username}`,
      android: `intent://X.com/${username}#Intent;scheme=https;package=com.twitter.android;end`,
      platform: "twitter",
    };
  }

  // Telegram
  const telegramMatch = webUrl.match(/t\.me\/([^/?]+)/);
  if (telegramMatch) {
    const username = telegramMatch[1];
    return {
      webUrl,
      ios: `tg://resolve?domain=${username}`,
      android: `intent://t.me/${username}#Intent;scheme=https;package=org.telegram.messenger;end`,
      platform: "telegram",
    };
  }

  // Facebook
  const facebookMatch = webUrl.match(/facebook\.com\/([^/?]+)/);
  if (facebookMatch) {
    const pageId = facebookMatch[1];
    return {
      webUrl,
      ios: `fb://profile/${pageId}`,
      android: `intent://facebook.com/${pageId}#Intent;scheme=https;package=com.facebook.katana;end`,
      platform: "facebook",
    };
  }

  // WhatsApp
  const whatsappMatch = webUrl.match(/wa\.me\/(\d+)/);
  if (whatsappMatch) {
    const phoneNumber = whatsappMatch[1];
    return {
      webUrl,
      ios: `whatsapp://send?phone=${phoneNumber}`,
      android: `intent://send?phone=${phoneNumber}#Intent;scheme=whatsapp;package=com.whatsapp;end`,
      platform: "whatsapp",
    };
  }

  // Spotify
  const spotifyMatch = webUrl.match(
    /open\.spotify\.com\/(track|album|playlist|artist)\/([^/?]+)/
  );
  if (spotifyMatch) {
    const type = spotifyMatch[1];
    const id = spotifyMatch[2];
    return {
      webUrl,
      ios: `spotify:${type}:${id}`,
      android: `intent://open.spotify.com/${type}/${id}#Intent;scheme=https;package=com.spotify.music;end`,
      platform: "spotify",
    };
  }

  // Unknown platform
  return {
    webUrl,
    ios: null,
    android: null,
    platform: "unknown",
  };
}

function buildSocialUrl(
  platform: SocialPlatform,
  params: SocialParams
): string {
  const { url, title, text, via, hashtags } = params;
  const enc = encodeURIComponent;
  const hash = hashtags?.length ? hashtags.join(",") : "";

  switch (platform) {
    /* ---------------- X / Twitter ---------------- */
    case "twitter":
    case "x":
      return `https://twitter.com/intent/tweet?url=${enc(url)}${
        text ? `&text=${enc(text)}` : ""
      }${via ? `&via=${enc(via)}` : ""}${hash ? `&hashtags=${enc(hash)}` : ""}`;

    /* ---------------- Facebook ---------------- */
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`;

    /* ---------------- LinkedIn ---------------- */
    case "linkedin":
      // LinkedIn officially supports ONLY url now
      return `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`;

    /* ---------------- Reddit ---------------- */
    case "reddit":
      return `https://www.reddit.com/submit?url=${enc(url)}${
        title ? `&title=${enc(title)}` : ""
      }`;

    /* ---------------- WhatsApp ---------------- */
    case "whatsapp":
      return `https://wa.me/?text=${enc(text ? `${text} ${url}` : url)}`;

    /* ---------------- Telegram ---------------- */
    case "telegram":
      return `https://t.me/share/url?url=${enc(url)}${
        text ? `&text=${enc(text)}` : ""
      }`;

    /* ---------------- Email ---------------- */
    case "email":
      return `mailto:?subject=${enc(title ?? "")}&body=${enc(
        text ? `${text}\n\n${url}` : url
      )}`;

    /* ---------------- Snapchat ---------------- */
    case "snapchat":
      // Snapchat doesn't have a standard web share dialog
      // Direct to Snapchat with the URL in the message
      return `https://www.snapchat.com/share?${url && `link=${enc(url)}&`}message=${enc(
        text ?? ""
      )}`;

    /* ---------------- Fallback ---------------- */
    default:
      return url;
  }
}
/**
 * Deep linking utilities that can be used standalone
 *
 * Usage:
 * ```tsx
 * import { generateDeepLink, openLink, detectOS } from './hooks/useShare';
 *
 * // Generate deep links
 * const result = generateDeepLink("https://youtube.com/watch?v=dQw4w9WgXcQ");
 * console.log(result.ios); // vnd.youtube://watch?v=dQw4w9WgXcQ
 *
 * // Detect OS
 * const os = detectOS(); // "ios" | "android" | "desktop"
 *
 * // Open with deep linking
 * openLink("https://instagram.com/username", {
 *   fallbackToWeb: true,
 *   fallbackDelay: 2500,
 *   openInNewTab: false
 * });
 * ```
 */
export { generateDeepLink, buildSocialUrl };
