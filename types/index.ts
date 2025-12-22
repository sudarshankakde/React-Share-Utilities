// Types exposed for package consumers
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
