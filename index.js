// ============================================
// HOOKS
// ============================================
export { default as useShare, toShareData } from "./hooks/useShare";
export { default as useClipboard } from "./hooks/useClipboard";
export { default as useSupports } from "./hooks/useSupports";
export { default as deeplink } from "./hooks/deeplink";
export { default as helper } from "./hooks/helper";

// ============================================
// COMPONENTS
// ============================================
export { default as ShareButton } from "./components/ShareButton";
export { default as SocialShareButton } from "./components/SocialShareButton";
export { default as DeepLinkOpen } from "./components/DeepLinkOpen";
export { default as ShareFallbackModal } from "./components/fallback";
export { default as CopyToClipboard } from "./components/CopyToClipboard";

// Also export as default for convenience
export { default } from "./components/CopyToClipboard";

// ============================================
// ASSETS / ICONS
// ============================================
export { ICONS as SHARE_BUTTON_ICONS } from "./assets/ShareButton";
export { ICONS as COPY_TO_CLIPBOARD_ICONS } from "./assets/CopyToClipboard";
export { ICONS } from "./assets";
export { LOGOS } from "./assets/DeepLinkLogo";

// ============================================
// UTILITY FUNCTIONS
// ============================================
export { openLink } from "./hooks/deeplink/openLink";
export { generateDeepLink, buildSocialUrl } from "./hooks/deeplink/DeepLink";
export { detectOS } from "./hooks/helper/detectOS";
export { detectPlatform } from "./hooks/helper/detectPlatform";
export { safeNavigator } from "./hooks";
