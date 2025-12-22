import { useCallback, useMemo, useRef, useState } from "react";
import type {  SocialParams, SocialPlatform , ShareInput,UseShareOptions } from "../../pakage/types";
import { detectPlatform } from "./helper/detectPlatform";
import { buildSocialUrl } from "./deeplink/DeepLink";
import  useClipboard from "./useClipboard";
import useSupports from "./useSupports";
import { detectOS } from "./helper/detectOS";


// Build ShareData object from ShareInput type 
export function toShareData(input: ShareInput): ShareData {
  if (!input) return {} as ShareData;
  if (
    "files" in (input as any) ||
    "url" in (input as any) ||
    "text" in (input as any) ||
    "title" in (input as any)
  ) {
    const i = input as any;
    return {
      title: i.title,
      text: i.text,
      url: i.url,
      files: i.files,
    } as ShareData;
  }
  return input as ShareData;
}





// use share is used to share content via Web Share API or fallback methods
function useShare(options: UseShareOptions = {}) {
  const {
    timeout = 2000,
    preferNative = true,
    fallback = "clipboard",
    onSuccess,
    onError,
    toast,
    messages,
  } = options;

  const { copyToClipboard , canShare  } = useClipboard(
    { onSuccess : () => {}
      , onError: () => {} }
  );
  const { supportsWebShare, supportsCanShare, supportsClipboard , nav } = useSupports();
  const [isSharedId, setIsSharedId] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "sharing" | "success" | "error"
  >("idle");
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

 

  

  const socialUrl = useCallback(
    (platform: SocialPlatform, params: SocialParams) => {
      const build = buildSocialUrl(platform, params);
      console.log("called", build);
      return build;
    },
    []
  );

  const openSocialShare = useCallback(
    (
      platform: SocialPlatform,
      params: SocialParams,
      target: string = "_blank"
    ) => {
      const href = socialUrl(platform, params);
      if (typeof window !== "undefined") {
        window.open(href, target, "noopener,noreferrer");
      }
      return href;
    },
    [socialUrl]
  );

  const share = useCallback(
    async (data: ShareInput, opts?: { id?: string }) => {
      const shareData = toShareData(data);
      setIsSharing(true);
      setStatus("sharing");
      setError(null);

      const finish = (ok: boolean, method: "native" | "fallback") => {
        setIsSharing(false);
        setStatus(ok ? "success" : "error");
        if (ok && opts?.id) {
          setIsSharedId(opts.id ?? null);
          timerRef.current = window.setTimeout(
            () => setIsSharedId(null),
            timeout
          );
        }
        if (ok && onSuccess)
          onSuccess({ id: opts?.id, method, data: shareData });
        if (ok && toast?.success) {
          const msg =
            method === "fallback"
              ? typeof messages?.fallbackCopied === "function"
                ? messages!.fallbackCopied!(shareData)
                : messages?.fallbackCopied ?? "Copied to clipboard"
              : typeof messages?.success === "function"
              ? messages!.success!({ method, data: shareData })
              : messages?.success ?? "Shared successfully";
          toast.success(msg);
        }
      };

      try {
        if (preferNative && supportsWebShare && canShare(shareData)) {
          await (nav as any).share(shareData);
          finish(true, "native");
          return { ok: true as const, method: "native" as const };
        }

        // Fallback path
        if (fallback === "clipboard") {
          copyToClipboard(
            shareData.text || 
              shareData.url ||
              `${shareData.text ? shareData.text + "\n" : ""
              }${shareData.url ? shareData.url : ""}`
          );
          finish(true, "fallback");
          return { ok: true as const, method: "fallback" as const };
        }
        if (fallback === "none") {
          finish(true, "fallback");
          return { ok: true as const, method: "fallback" as const };
        }
        if (typeof fallback === "function") {
          await fallback(shareData);
          finish(true, "fallback");
          return { ok: true as const, method: "fallback" as const };
        }

        throw new Error("Web Share API not supported and no fallback provided");
      } catch (e: any) {
        const err = e instanceof Error ? e : new Error(String(e));
        setError(err);
        setIsSharing(false);
        setStatus("error");
        if (onError) onError(err);
        if (toast?.error) {
          const msg = messages?.error ? messages.error(err) : err.message;
          toast.error(msg);
        }
        return { ok: false as const, error: err };
      }
    },
    [
      nav,
      timeout,
      preferNative,
      fallback,
      onSuccess,
      onError,
      toast,
      messages,
      supportsWebShare,
      canShare,
      copyToClipboard,
    ]
  );

  // Backward-compatible alias keeping current code working
  const handleShare = useCallback(
    (url: string, title?: string, text?: string, id?: string) =>
      share({ url, title, text }, { id }),
    [share]
  );

  const support = useMemo(
    () => ({
      webShare: supportsWebShare,
      canShareFiles: supportsCanShare,
      clipboard: supportsClipboard,
    }),
    [supportsWebShare, supportsCanShare, supportsClipboard]
  );



  return {
    // Core
    share,
    handleShare,
    copyToClipboard,
    reset,

    // Helpers
    canShare,
    support,
    socialUrl,
    openSocialShare,

    // Deep linking
    detectPlatform,
    detectOS,
 

    // State
    isSharedId,
    setIsSharing,
    isSharing,
    status,
    error,
  };
}


export default useShare;
