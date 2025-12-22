import { useCallback, useRef, useState } from "react";
import type { ShareInput, UseCopyClipboardOptions } from "../../pakage/types";
import useSupports from "./useSupports";
import { toShareData } from "./useShare";
const useClipboard = (
  options: UseCopyClipboardOptions
): {
  copyToClipboard: (text: string) => Promise<void>;
  canShare: (data?: ShareInput) => boolean;
  isSharedId: string | null;
  isSharing: boolean;
  status: "idle" | "sharing" | "success" | "error";
  error: Error | null;
  reset: () => void;
} => {
  const { onSuccess, onError } = options || {};
  const [isSharedId, setIsSharedId] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "sharing" | "success" | "error"
  >("idle");
  const [error, setError] = useState<Error | null>(null);
  const { supportsClipboard, supportsWebShare, supportsCanShare, nav } =
    useSupports();

  const canShare = useCallback(
    (data?: ShareInput) => {
      if (!supportsWebShare) return false;
      if (!data) return true;
      const shareData = toShareData(data);
      try {
        if (supportsCanShare && (nav as any).canShare) {
          return (nav as any).canShare(shareData);
        }
      } catch {
        return false;
      }
      return true;
    },
    [supportsWebShare, supportsCanShare, nav]
  );

  const fallbackCopy = (text: string) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      document.execCommand("copy");

    } finally {
      if (onSuccess) onSuccess();
      setIsSharing(false);
      setStatus("success");
      document.body.removeChild(textarea);
    }
  };

  const copyToClipboard = useCallback(
    async (text: string) => {
      setIsSharing(true);
      setStatus("sharing");
      // Try async Clipboard API first when supported
      if (supportsClipboard && nav?.clipboard?.writeText) {
        try {
          await nav.clipboard.writeText(text);
          setIsSharing(false);
          setStatus("success");
          if (onSuccess) onSuccess();

          return;
        } catch {
          // fall through to fallback
          setIsSharing(false);
          setStatus("error");

          if (onError) onError(new Error("Failed to copy to clipboard"));
        }
      } else {
        fallbackCopy(text);
        setIsSharing(false);
        setStatus("success");
      }
    },
    [nav, supportsClipboard]
  );

  const timerRef = useRef<number | null>(null);
  //reset share state
  const reset = useCallback(() => {
    setIsSharedId(null);
    setError(null);
    setIsSharing(false);
    setStatus("idle");
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  return {
    copyToClipboard: copyToClipboard,
    canShare,
    isSharedId,
    isSharing,
    status,
    error,
    reset,
  };
};

export default useClipboard;
