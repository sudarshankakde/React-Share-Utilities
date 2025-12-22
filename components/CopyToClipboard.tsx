/**
 * CopyToClipboard Component
 * 
 * A button component that copies content to clipboard with status feedback.
 * 
 * Key Features:
 * - Automatic clipboard fallback (never uses native share API)
 * - Reuses ShareButton styling and structure
 * - Icon state transitions (default → busy → success/error)
 * - Custom className support with full CSS override capability
 * - Supports custom variant="custom" for zero preset styles
 * 
 * Important API Limitations:
 * - LinkedIn Share API: Only accepts `url` parameter. title/text/files are ignored
 * - Twitter/X: Supports url, text, via, hashtags. Files not supported
 * - Facebook: Only accepts url parameter
 * - WhatsApp/Telegram: Support url and text only
 * - Email: Supports subject (title) and body (text) but not files
 * - Web Share API: Requires HTTPS and user gesture. Clipboard is the fallback
 * 
 * Usage:
 * ```tsx
 * import CopyToClipboard from './components/CopyToClipboard';
 * 
 * // Simple usage
 * <CopyToClipboard data="Copy me!" />
 * 
 * // With custom styling
 * <CopyToClipboard 
 *   data="https://example.com"
 *   variant="custom"
 *   className="px-4 py-2 bg-blue-500 text-white rounded"
 * />
 * 
 * // With custom icons
 * <CopyToClipboard 
 *   data="Hello World"
 *   customLabelIcons={{
 *     default: "share-fill",
 *     busy: "busy-loader",
 *     success: "success",
 *     error: "error"
 *   }}
 * />
 * ```
 */

import React, { useEffect } from "react";
import type { ReactNode } from "react";

import "./Button.css";
import { ICONS } from "../../assets/CopyToClipboard";
import useClipboard from "../../hooks/useClipboard";
import type { UseCopyClipboardOptions } from "../../types";


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

type ShareIconName = "share-fill" | "share" | "copy";
type SuccessIconName = "success";
type ErrorIconName = "error";
type BusyIconName = "busy-clock" | "busy-loader";

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
 * Props for CopyToClipboard button component
 * 
 * @param data - Content to copy. Copies in priority order: text → url → JSON stringified object
 * @param customLabelIcons - Icon state names or custom ReactNode elements
 *   Available icons: "share-fill", "share", "success", "error", "busy-clock", "busy-loader"
 * @param className - Custom CSS classes. Overrides all preset styles when variant="custom"
 * @param variant - Styling variant. Use "custom" for zero preset styles
 * @param options - useShare options (timeout, messages, toast callbacks)
 * 
 * Note: This component forces clipboard path (preferNative: false, fallback: "clipboard")
 *       so it will always copy to clipboard regardless of Web Share API availability.
 */
const defaultCustomLabelIcons = {
  default: "copy",
  busy: "busy-clock",
  error: "error",
  success: "success",
};
export type CopyToClipboardProps = {
	/** Content to copy - will auto-serialize based on content type */
	data: string;
	/** Optional ID for tracking copy events */
	id?: string;
	/** Label text or node shown by default */
	label?: ReactNode;
	/** Label shown while copying */
	busyLabel?: ReactNode;
	/** Label shown after successful copy */
	successLabel?: ReactNode;
	/** Custom CSS classes (overrides presets when used) */
	className?: string;
	/** Disable the button */
	disabled?: boolean;
	/** Icon state mappings - use icon names or custom JSX */
	customLabelIcons?: {
		/** Icon when idle - e.g., "share-fill" or <CustomIcon /> */
		default?: ShareIconName | ReactNode;
		/** Icon while copying */
		success?: SuccessIconName | ReactNode;
		/** Icon on error */
		error?: ErrorIconName | ReactNode;
		busy?: BusyIconName | ReactNode;
	};
	/** Share hook options - timeout, messages, toast callbacks 
	 *  NOTE: fallback and preferNative are forced (clipboard only) */
	options?: UseCopyClipboardOptions;
	/** Callback on successful copy */
	onSuccess?: UseCopyClipboardOptions["onSuccess"];
	/** Callback on copy error */
	onError?: UseCopyClipboardOptions["onError"];
	/** Custom HTML element to render as (default: "button") */
	as?: React.ElementType;
	/** Styling variant ("solid", "outline", "ghost", "soft", "link", "destructive", "custom") */
	variant?: Variant;
	/** Color scheme ("primary", "success", "danger", "warning", "neutral") */
	color?: Color;
	/** Size ("sm", "md", "lg") */
	size?: Size;
  showLabel?: boolean;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick">;

function CopyToClipboard({
  showLabel = true,
	data,
	
	label = "Copy",
	busyLabel = "Copying…",
	successLabel = "Copied",
	customLabelIcons = defaultCustomLabelIcons,
	className,
	disabled,
	options,
	onSuccess,
	onError,
	as,
	variant = "solid",
	size = "md",
	color = "primary",
	...btnProps
}: CopyToClipboardProps) {
	// Force clipboard-only behavior (no native Web Share API)
	// This ensures consistent copy-to-clipboard experience across all browsers
  
  const {copyToClipboard ,reset, isSharing, status} = useClipboard({ 
    ...(options || {}),
    onSuccess:()=>{
      if(onSuccess){
        onSuccess();
      }else if(options && options.onSuccess ){
        options.onSuccess();
      }
    },
    onError: (err)=>{
      if(onError){
        onError(err);
      }
      else if(options && options.onError ){
        options.onError(err);
      }
    }
  }, );

	const Tag: React.ElementType = as || "button";
	const isSuccess = status === "success";
	const isBusy = isSharing || status === "sharing";

	/**
	 * Resolves icon name strings to their JSX components.
	 * Available icon names: "share-fill", "share", "success", "error", "busy-clock", "busy-loader"
	 * Also accepts custom ReactNode elements.
	 */
	const resolveIcon = (
		icon: ShareIconName | SuccessIconName | ErrorIconName | BusyIconName | ReactNode | undefined
	): ReactNode => {
		if (!icon) return null;
		if (typeof icon !== "string") return icon;
		if (icon === "share-fill" || icon === "share" || icon === "copy") return ICONS.default[icon];
		if (icon === "success") return ICONS.success[icon];
		if (icon === "error") return ICONS.error[icon];
		if (icon === "busy-clock" || icon === "busy-loader") return ICONS.busy[icon];
		return null;
	};

	React.useEffect(() => {
		if (isSuccess ) {
			const t = setTimeout(reset, options?.timeout || 3000);
			return () => clearTimeout(t);
		}
	}, [isSuccess, options?.timeout, reset]);

	const ariaLabel =
		typeof label === "string"
			? label
			: isBusy
			? "Copying content"
			: "Copy content";

	/**
	 * Handles copy action. Uses the share() function with forced clipboard fallback
	 * to leverage built-in status management, toast notifications, and callbacks.
	 */
	const handleCopy = () => {
    console.log("copying", data);
		return copyToClipboard(data);
	};
  useEffect(() => {
    console.log("isSharing", isSharing, status);
  }, [isSharing, status]);

	return (
		<Tag
			type={Tag === "button" ? "button" : undefined}
			role={Tag !== "button" ? "button" : undefined}
			aria-label={ariaLabel}
			aria-busy={isBusy}
			aria-disabled={disabled || isBusy}
			tabIndex={disabled ? -1 : 0}
			className={[
				"Share-React-Button",
				variant !== "custom" && VARIANTS[variant],
				variant !== "custom" && COLORS[color],
				variant !== "custom" && SIZES[size],
				className,
			]
				.filter(Boolean)
				.join(" ")}
			disabled={Tag === "button" ? disabled || isBusy : undefined}
			onClick={handleCopy}
			{...btnProps}
		>
			{customLabelIcons &&
				(isSuccess
					? resolveIcon(customLabelIcons.success ? customLabelIcons.success : defaultCustomLabelIcons.success)
					: isBusy
					? resolveIcon(customLabelIcons.busy ? customLabelIcons.busy : defaultCustomLabelIcons.busy)
					: resolveIcon(customLabelIcons.default ? customLabelIcons.default : defaultCustomLabelIcons.default))}

      {showLabel &&<span aria-live="polite">
				{isSuccess ? successLabel : isBusy ? busyLabel : label}
			</span> }
			
		</Tag>
	);
}

export default CopyToClipboard;
