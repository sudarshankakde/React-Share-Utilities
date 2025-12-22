import React from "react";
import type { ReactNode } from "react";

import "./Button.css";
import { LOGOS } from "../assets/DeepLinkLogo";
import { generateDeepLink } from "../hooks/deeplink/DeepLink";
import { detectOS } from "../hooks/helper/detectOS";
import { detectPlatform } from "../hooks/helper/detectPlatform";
import { openLink } from "../hooks/deeplink/openLink";
import type { Variant ,Size,Color, DeepLinkOpenProps, } from "../index.d.ts";

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




function DeepLinkOpen({
	url,
	label = "Open in app",
	variant = "solid",
	color = "primary",
	size = "md",
	className,
	disabled,
	options,
	onOpened,
	as,
	...btnProps
}: DeepLinkOpenProps) {
	const Tag: React.ElementType = as || "button";
	const [isOpening, setIsOpening] = React.useState(false);
	const deepLink = React.useMemo(() => generateDeepLink(url), [url]);
	const os = React.useMemo(() => detectOS(), []);

	const handleClick = () => {
		if (disabled || isOpening) return;
		setIsOpening(true);
		try {
			openLink(url, options);
			onOpened?.({ deepLink, os });
		} finally {
			// Reset "opening" state after fallback window
			const delay = (options?.fallbackDelay ?? 2500) + 300;
			setTimeout(() => setIsOpening(false), delay);
		}
	};

	const ariaLabel =
		typeof label === "string"
			? label
			: isOpening
			? "Opening in app"
			: "Open in app";
  const platform = detectPlatform(url);
  const platformLogo = LOGOS[platform] || LOGOS["unknown"];
	return (
		<Tag
			type={Tag === "button" ? "button" : undefined}
			role={Tag !== "button" ? "button" : undefined}
			aria-label={ariaLabel}
			aria-busy={isOpening}
			aria-disabled={disabled || isOpening}
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
			disabled={Tag === "button" ? disabled || isOpening : undefined}
			onClick={handleClick}
			{...btnProps}
		>
      {platformLogo}
			<span aria-live="polite">{label}</span>
		</Tag>
	);
}

export default DeepLinkOpen;
