import type { ReactNode, FC, ButtonHTMLAttributes, ElementType } from "react";
i;
// ============================================
// TYPES
// ============================================
type ShareInput =
  | ShareData
  | {
      url?: string;
      title?: string;
      text?: string;
      files?: File[];
    };

type FallbackStrategy =
  | "clipboard"
  | "none"
  | ((data: ShareInput) => Promise<void> | void);

type UseShareOptions = {
  timeout?: number;
  preferNative?: boolean;
  fallback?: FallbackStrategy;
  onSuccess?: (info: {
    id?: string | null;
    method: "native" | "fallback";
    data: ShareInput;
  }) => void;
  onError?: (error: Error) => void;
  toast?: ToastApi;
  messages?: MessageOptions;
};

type UseCopyClipboardOptions = {
  timeout?: number;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  fallback?: FallbackStrategy;
};

type SocialPlatform =
  | "x"
  | "twitter"
  | "facebook"
  | "linkedin"
  | "reddit"
  | "whatsapp"
  | "telegram"
  | "email"
  | "instagram"
  | "snapchat";

type SocialParams = {
  url: string;
  title?: string;
  text?: string;
  via?: string; // for X/Twitter
  hashtags?: string[]; // for X/Twitter
};

type ToastApi = {
  success?: (message: string) => void;
  error?: (message: string) => void;
  info?: (message: string) => void;
};

type MessageOptions = {
  success?:
    | string
    | ((info: { method: "native" | "fallback"; data: ShareInput }) => string);
  fallbackCopied?: string | ((data: ShareInput) => string);
  error?: (error: Error) => string;
};

/**
 * Deep Link Support
 * Maps URLs to native app deep links with automatic OS detection
 */
type DeepLinkPlatform =
  | "youtube"
  | "youtube_channel"
  | "instagram"
  | "tiktok"
  | "linkedin"
  | "linkedin_company"
  | "twitter"
  | "whatsapp"
  | "telegram"
  | "facebook"
  | "spotify"
  | "unknown";

type OSType = "ios" | "android" | "desktop";

export type {
  OSType,
  DeepLinkPlatform,
  FallbackStrategy,
  MessageOptions,
  ShareInput,
  SocialParams,
  SocialPlatform,
  ToastApi,
  UseShareOptions,
  UseCopyClipboardOptions,
};

// ============================================
// INTERFACES
// ============================================

export interface DeepLinkResult {
  webUrl: string;
  ios: string | null;
  android: string | null;
  platform: DeepLinkPlatform;
}

export interface OpenLinkOptions {
  /** Fall back to web URL if app deep link fails (default: true) */
  fallbackToWeb?: boolean;
  /** Delay before fallback to web (default: 2500ms) */
  fallbackDelay?: number;
  /** Open in new tab instead of replacing (default: false) */
  openInNewTab?: boolean;
}

// ============================================
// HOOK RETURN TYPES
// ============================================
export interface UseShareReturn {
  share: (data: ShareInput, opts?: { id?: string }) => Promise<{ ok: boolean; method: "native" | "fallback"; error?: Error }>;
  handleShare: (url: string, title?: string, text?: string, id?: string) => Promise<{ ok: boolean; method: "native" | "fallback"; error?: Error }>;
  copyToClipboard: (text: string) => Promise<void>;
  
  canShare: (data?: ShareInput) => boolean;
  support: {
    webShare: boolean;
    clipboard: boolean;
    canShare: boolean;
  };
  isSharedId: string | null;
  isSharing: boolean;
  status: "idle" | "sharing" | "success" | "error";
  error: Error | null;
  reset: () => void;
  socialUrl: (platform: SocialPlatform, params: SocialParams) => string;
  openSocialShare: (
    platform: SocialPlatform,
    params: SocialParams,
    target?: string
  ) => string;
  detectPlatform: (url: string) => DeepLinkPlatform;
  detectOS: () => OSType;
  setIsSharing: (sharing: boolean) => void;
}

export interface UseClipboardReturn {
  copyToClipboard: (text: string) => Promise<void>;
  canShare: (data?: ShareInput) => boolean;
  isSharedId: string | null;
  isSharing: boolean;
  status: "idle" | "sharing" | "success" | "error";
  error: Error | null;
  reset: () => void;
}
export interface UseSupportsReturn {
  supportsWebShare: boolean;
  supportsCanShare: boolean;
  supportsClipboard: boolean;
  nav: Navigator | undefined;
}

// ============================================
// HOOKS
// ============================================
export function useShare(options?: UseShareOptions): UseShareReturn;
export function useClipboard(
  options?: UseCopyClipboardOptions
): UseClipboardReturn;
export function useSupports(): UseSupportsReturn;
export function toShareData(input: ShareInput): ShareData;

// ============================================
// COMPONENT PROPS
// ============================================
export type Variant =
  | "solid"
  | "outline"
  | "ghost"
  | "soft"
  | "link"
  | "destructive"
  | "custom";

export type Color = "primary" | "success" | "danger" | "warning" | "neutral";
export type Size = "sm" | "md" | "lg";

export interface CopyToClipboardProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  data: string;
  id?: string;
  label?: ReactNode;
  busyLabel?: ReactNode;
  successLabel?: ReactNode;
  className?: string;
  disabled?: boolean;
  customLabelIcons?: {
    default?: "share-fill" | "share" | "copy" | ReactNode;
    success?: "success" | ReactNode;
    error?: "error" | ReactNode;
    busy?: "busy-clock" | "busy-loader" | ReactNode;
  };
  options?: UseCopyClipboardOptions;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  as?: ElementType;
  variant?: Variant;
  color?: Color;
  size?: Size;
  showLabel?: boolean;
}

export interface ShareButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  data: ShareInput;
  id?: string;
  label?: ReactNode;
  busyLabel?: ReactNode;
  successLabel?: ReactNode;
  className?: string;
  disabled?: boolean;
  customLabelIcons?: {
    default?: "share-fill" | "share" | ReactNode;
    success?: "success" | "success-check" | ReactNode;
    error?: "error" | "error-exclamation" | ReactNode;
    busy?: "busy-loader" | "busy-clock" | ReactNode;
  };
  variant?: Variant;
  color?: Color;
  size?: Size;
  options?: Omit<UseShareOptions, "onSuccess" | "onError">;
  onSuccess?: UseShareOptions["onSuccess"];
  onError?: UseShareOptions["onError"];
  as?: ElementType;
}

export interface SocialShareButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  platform: SocialPlatform;
  params: SocialParams;
  openSocialShare?: (
    platform: SocialPlatform,
    params: SocialParams,
    target?: string
  ) => string;
  socialUrl?: (platform: SocialPlatform, params: SocialParams) => string;
  getUrlOnly?: boolean;
  onGetUrl?: (url: string) => void;
  label?: ReactNode;
  className?: string;
  disabled?: boolean;
  variant?: Variant;
  color?: Color;
  size?: Size;
  as?: ElementType;
  target?: string;
  showLabel?: boolean;
}

export interface DeepLinkOpenProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  url: string;
  label?: ReactNode;
  variant?: Variant;
  color?: Color;
  size?: Size;
  className?: string;
  disabled?: boolean;
  options?: OpenLinkOptions;
  onOpened?: (info: { deepLink: DeepLinkResult; os: string }) => void;
  as?: ElementType;
}

export interface ShareFallbackModalProps {
  open: boolean;
  onClose: () => void;
  data: ShareInput | null;
  platforms?: SocialPlatform[];
  title?: string;
}

// ============================================
// COMPONENTS
// ============================================
export const CopyToClipboard: FC<CopyToClipboardProps>;
export const ShareButton: FC<ShareButtonProps>;
export const SocialShareButton: FC<SocialShareButtonProps>;
export const DeepLinkOpen: FC<DeepLinkOpenProps>;
export const ShareFallbackModal: FC<ShareFallbackModalProps>;

// Default export
export default CopyToClipboard;

// ============================================
// UTILITY FUNCTIONS
// ============================================
export function openLink(url: string, options?: OpenLinkOptions): void;
export function generateDeepLink(url: string): DeepLinkResult;
export function buildSocialUrl(
  platform: SocialPlatform,
  params: SocialParams
): string;
export function detectOS(): OSType;
export function detectPlatform(url: string): DeepLinkPlatform;
export function safeNavigator(): Navigator | undefined;

// ============================================
// DEEP LINK MODULE
// ============================================
export const deeplink: {
  openLink: typeof openLink;
  generateDeepLink: typeof generateDeepLink;
  buildSocialUrl: typeof buildSocialUrl;
};

// ============================================
// HELPER MODULE
// ============================================
export const helper: {
  detectOS: typeof detectOS;
  detectPlatform: typeof detectPlatform;
};

// ============================================
// ASSETS / ICONS
// ============================================
export const ICONS: Record<string, ReactNode>;
export const LOGOS: Record<string, ReactNode>;
export const SHARE_BUTTON_ICONS: {
  default: Record<string, ReactNode>;
  success: Record<string, ReactNode>;
  error: Record<string, ReactNode>;
  busy: Record<string, ReactNode>;
};
export const COPY_TO_CLIPBOARD_ICONS: {
  default: Record<string, ReactNode>;
  success: Record<string, ReactNode>;
  error: Record<string, ReactNode>;
  busy: Record<string, ReactNode>;
};
