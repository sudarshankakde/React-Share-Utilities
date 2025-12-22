/**
 * SocialShareButton Component
 * 
 * Share content directly to social platforms using socialUrl() and openSocialShare()
 * 
 * Supported Platforms & Field Support:
 * - LinkedIn: ✓ url only (title, text, hashtags, via are IGNORED)
 * - Twitter/X: ✓ url, text, via, hashtags (NO files)
 * - Facebook: ✓ url only (other fields ignored)
 * - Reddit: ✓ url, title
 * - WhatsApp: ✓ text, url (combines as "text url")
 * - Telegram: ✓ text, url
 * - Email: ✓ title (subject), text (body) - no url in body for email
 * 
 * Usage:
 * ```tsx
 * import SocialShareButton from './components/SocialShareButton';
 * import { useShare } from './hooks/useShare';
 * 
 * const { openSocialShare, socialUrl } = useShare();
 * 
 * // Open in new window
 * <SocialShareButton 
 *   platform="linkedin"
 *   params={{ url: "https://example.com" }}
 *   openSocialShare={openSocialShare}
 *   label="Share on LinkedIn"
 * />
 * 
 * // Get URL without opening
 * <SocialShareButton 
 *   platform="twitter"
 *   params={{ 
 *     url: "https://example.com",
 *     text: "Check this out!",
 *     hashtags: ["react", "sharing"]
 *   }}
 *   socialUrl={socialUrl}
 *   getUrlOnly={true}
 *   onGetUrl={(url) => console.log("Share URL:", url)}
 * />
 * ```
 */

import React from "react";
import type { ReactNode } from "react";
import type { SocialPlatform, SocialParams } from "../types";
import "./Button.css";
import { ICONS } from "../../src/assets";

type Variant =
  | "solid"
  | "outline"
  | "ghost"
  | "soft"
  | "link"
  | "destructive"
  | "custom";

type Color = "primary" | "success" | "danger" | "warning" | "neutral";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  solid: "variant-solid",
  outline: "variant-outline",
  ghost: "variant-ghost",
  soft: "variant-soft",
  link: "variant-link",
  destructive: "variant-destructive",
  custom: "variant-custom",
};

const COLORS: Record<Color, string> = {
  primary: "color-primary",
  success: "color-success",
  danger: "color-danger",
  warning: "color-warning",
  neutral: "color-neutral",
};

const SIZES: Record<Size, string> = {
  sm: "size-sm",
  md: "size-md",
  lg: "size-lg",
};

/**
 * Platform-specific info and defaults
 */
const PLATFORM_INFO: Record<SocialPlatform, { label: string; color: Color; icon: string | ReactNode }> = {
  linkedin: { label: "LinkedIn", color: "primary", icon: ICONS.linkedin || "bi-linkedin" },
  twitter: { label: "Twitter/X", color: "primary", icon: ICONS.twitter || "bi-twitter" },
  x: { label: "X", color: "neutral", icon: ICONS.x || "bi-x" },
  facebook: { label: "Facebook", color: "primary", icon: ICONS.facebook || "bi-facebook" },
  reddit: { label: "Reddit", color: "danger", icon: ICONS.reddit || "bi-reddit" },
  whatsapp: { label: "WhatsApp", color: "success", icon: ICONS.whatsapp || "bi-whatsapp" },
  telegram: { label: "Telegram", color: "primary", icon: ICONS.telegram || "bi-telegram" },
  email: { label: "Email", color: "warning", icon: ICONS.email || "bi-envelope" },
  instagram: { label: "Instagram", color: "danger", icon: ICONS.instagram || "bi-instagram" },
  snapchat: { label: "Snapchat", color: "warning", icon: ICONS.snapchat || "bi-snapchat" },
};

export type SocialShareButtonProps = {
  /** Social platform to share to */
  platform: SocialPlatform;
  /** Share parameters - platform support varies (see documentation) */
  params: SocialParams;
  /** Function to open social share (opens in new window) */
  openSocialShare?: (
    platform: SocialPlatform,
    params: SocialParams,
    target?: string
  ) => string;
  /** Function to get social share URL without opening */
  socialUrl?: (platform: SocialPlatform, params: SocialParams) => string;
  /** If true, gets URL instead of opening window */
  getUrlOnly?: boolean;
  /** Callback when URL is generated (for getUrlOnly mode) */
  onGetUrl?: (url: string) => void;
  /** Button label (defaults to platform name) */
  label?: ReactNode;
  /** Custom button className */
  className?: string;
  /** Disable the button */
  disabled?: boolean;
  /** Styling variant */
  variant?: Variant;
  /** Color scheme */
  color?: Color;
  /** Size */
  size?: Size;
  /** Custom HTML element to render as */
  as?: React.ElementType;
  /** Target for window.open (default: "_blank") */
  target?: string;

  /** Show label text (default: true) */
  showLabel?: boolean;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick">;

/**
 * SocialShareButton - Share to social platforms
 *
 * Platform API Limitations:
 * - LinkedIn: ONLY url parameter is used. title, text, hashtags, via are ignored.
 * - Twitter: Supports url, text, via, hashtags. Files not supported.
 * - Facebook: Only url is supported.
 * - Reddit: url and title supported.
 * - Email: Maps title to subject, text to body.
 */
function SocialShareButton({
  platform,
  params,
  openSocialShare,
  socialUrl,
  getUrlOnly = false,
  onGetUrl,
  label,
  className,
  disabled,
  variant = "solid",
  color,
  size = "md",
  as,
  showLabel = true,
  target = "_blank",
  ...btnProps
}: SocialShareButtonProps) {
  const platformInfo = PLATFORM_INFO[platform] || { label: platform, color: "primary", icon: "bi-share" };
 
  const finalLabel = label || platformInfo.label;
  const finalColor = color || platformInfo.color;
  const Tag: React.ElementType = as || "button";

  const handleClick = () => {
    if (getUrlOnly && socialUrl) {
      // Mode 1: Get URL without opening
      const url = socialUrl(platform, params);
      onGetUrl?.(url);
    } else if (openSocialShare) {
      // Mode 2: Open in new window
      openSocialShare(platform, params, target);
    }
  };

  return (
    <Tag
      type={Tag === "button" ? "button" : undefined}
      role={Tag !== "button" ? "button" : undefined}
      aria-label={typeof finalLabel === "string" ? finalLabel : `Share on ${platform}`}
      tabIndex={disabled ? -1 : 0}
      className={[
        "Share-React-Button",
        variant !== "custom" && VARIANTS[variant],
        variant !== "custom" && COLORS[finalColor],
        variant !== "custom" && SIZES[size],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      disabled={Tag === "button" ? disabled : undefined}
      onClick={handleClick}
      {...btnProps}
    >
      {typeof platformInfo.icon === "string" ? (
        <i className={`bi ${platformInfo.icon}`}></i>
      ) : (
        platformInfo.icon
      )}
      {showLabel &&  <span >{finalLabel}</span>}
     
    </Tag>
  );
}

export default SocialShareButton;
