import React from "react";
import ShareFallbackModal from "./fallback";
import type { ReactNode } from "react";
import "./Button.css";
import { ICONS } from "../assets/ShareButton";
import useShare from "../hooks/useShare";
import type { Size ,Variant,Color,ShareButtonProps, ShareInput} from "../index.d.ts";


// Extract valid icon names from ICONS object
type DefaultIconName = "share-fill" | "share";
type SuccessIconName = "success" | "success-check";
type ErrorIconName = "error" | "error-exclamation";
type BusyIconName = "busy-loader" | "busy-clock";


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



function ShareButton({
  data,
  id,
  label = "Share",
  busyLabel = "Sharing…",
  successLabel = "Shared",
  customLabelIcons = {
    default: "share-fill",
    busy: "busy-loader",
    error: "error-exclamation",
    success:"success",
  },
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
}: ShareButtonProps) {
  const [showFallback, setShowFallback] = React.useState(false);
  const [fallbackData, setFallbackData] = React.useState<ShareInput| null>(null);

  const { share, isSharing, status, reset } = useShare({
    ...(options || {}),
    // If consumer didn't specify a fallback, open the social modal
    fallback: options?.fallback ?? ((d: ShareInput) => {
      setFallbackData(d);
      setShowFallback(true);
    }),
    onSuccess,
    onError,
  });


  const Tag: React.ElementType = as || "button";
  const isSuccess = status === "success" && !showFallback;
  const isBusy = isSharing || status === "sharing" || showFallback;

  // Helper to resolve icon name to JSX
  const resolveIcon = (icon: DefaultIconName | SuccessIconName | ErrorIconName | BusyIconName | ReactNode | undefined): ReactNode => {
    if (!icon) return null;
    if (typeof icon !== "string") return icon;
    
    // Resolve string icon names
    if (icon === "share-fill" || icon === "share") return ICONS.default[icon as DefaultIconName];
    if (icon === "success" || icon === "success-check") return ICONS.success[icon as SuccessIconName];
    if (icon === "error" || icon === "error-exclamation") return ICONS.error[icon as ErrorIconName];
    if (icon === "busy-clock" || icon === "busy-loader") return ICONS.busy[icon as BusyIconName];

    return null;
  };

  React.useEffect(() => {
    if (isSuccess  ) {
      const t = setTimeout(reset, options?.timeout || 3000);
      return () => clearTimeout(t);
    }
  }, [isSuccess, options?.timeout, reset]);

  const ariaLabel =
    typeof label === "string"
      ? label
      : isBusy
        ? "Sharing content"
        : "Share content";

  return (
    <>
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
        ].filter(Boolean).join(" ")}
        disabled={Tag === "button" ? disabled || isBusy : undefined}
        onClick={() => share(data, { id })}
        {...btnProps}
      >
        {customLabelIcons &&
          (isSuccess
            ? resolveIcon(customLabelIcons.success)
            : isBusy 
              ? resolveIcon(customLabelIcons.busy)
              : resolveIcon(customLabelIcons.default))}

        <span aria-live="polite">
          {isSuccess ? successLabel : isBusy ? busyLabel : label}
        </span>
      </Tag>
      <ShareFallbackModal
        open={showFallback}
        onClose={() => {setShowFallback(false)
        }}
        data={fallbackData}
      />
    </>
  );
}


export default ShareButton;

