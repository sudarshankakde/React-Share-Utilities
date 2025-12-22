import React from "react";
import SocialShareButton from "./SocialShareButton";
import { ICONS } from "../assets";
import "./fallback.css";
import useShare from "../hooks/useShare";
import type { SocialPlatform ,ShareFallbackModalProps, ShareInput } from "../index.d.ts";

const DEFAULT_PLATFORMS: SocialPlatform[] = [
	"whatsapp",
	"telegram",
	"email",
	"twitter",
  "snapchat",
  "facebook",
  "linkedin",
  "reddit",
  
];

function platformLabel(p: SocialPlatform) {
	switch (p) {
		case "x":
		case "twitter":
			return "Twitter/X";
		case "facebook":
			return "Facebook";
		case "linkedin":
			return "LinkedIn";
		case "reddit":
			return "Reddit";
		case "whatsapp":
			return "WhatsApp";
		case "telegram":
			return "Telegram";
		case "email":
			return "Email";
		case "snapchat":
			return "Snapchat";
		default:
			return p;
	}
}

export default function ShareFallbackModal({
	open,
	onClose,
	data,
	platforms = DEFAULT_PLATFORMS,
	title = "Share via social platforms",
  
}: ShareFallbackModalProps) {
	const { openSocialShare } = useShare();

	if (!open) return null;

	const isShareObj = (d: ShareInput | null): d is ShareData => {
		if (!d || typeof d !== "object") return false;
		return (
			"url" in d || "title" in d || "text" in d || "files" in d
		);
	};

	const resolvedUrl = isShareObj(data)
		? data.url ?? (typeof window !== "undefined" ? window.location.href : undefined)
		: (typeof window !== "undefined" ? window.location.href : undefined);

	const resolvedTitle = isShareObj(data) ? data.title ?? undefined : undefined;
	const resolvedText = isShareObj(data) ? data.text ?? undefined : undefined;

	return (
		<>
			{/* Semi-transparent overlay */}
			{open && <div className="fallback-overlay" onClick={onClose} />}
			
			{/* Bottom sheet */}
			<div
				role="dialog"
				aria-modal="true"
				aria-label="Share options"
				className={`fallback-sheet ${open ? "open" : "closed"}`}
				onClick={(e) => e.stopPropagation()}
			>
				{/* Handle bar */}
				<div className="fallback-handle-bar" />
 


				<div className="fallback-content">
					<h3 className="fallback-title">{title}</h3>

					{/* Share Preview Card */}
					{(resolvedUrl || resolvedTitle || resolvedText) && (
						<div className="fallback-preview-card">
							{resolvedTitle && (
								<div className="fallback-preview-title">

									{resolvedTitle}
								</div>
							)}
							{resolvedText && (
								<div className="fallback-preview-text">
									{resolvedText}
								</div>
							)}
							{resolvedUrl && (
								<div className="fallback-preview-url">
									{ICONS["unknown"]}
									<a 
										href={resolvedUrl} 
										target="_blank" 
										rel="noopener noreferrer"
										className="fallback-url-link"
									>
										{resolvedUrl}
									</a>
								</div>
							)}
						</div>
					)}

					<div className="fallback-button-container">
						{platforms.map((platform) => (
							<SocialShareButton
								key={platform}
								platform={platform}
								params={{
									url: resolvedUrl ?? "",
									title: resolvedTitle,
									text: resolvedText,
								}}
								openSocialShare={openSocialShare}
								label={platformLabel(platform)}
                style={{
                  borderRadius: '10vh',
                  padding: '20px 20px',
                }}
                showLabel={false}
                size="lg"
              
							/>
						))}
					</div>
				</div>
			</div>
		</>
	);
}


