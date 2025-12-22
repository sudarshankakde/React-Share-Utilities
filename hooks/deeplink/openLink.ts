import type { OpenLinkOptions } from "../../../pakage/interface";
import { detectOS } from "../helper/detectOS";
import { generateDeepLink } from "./DeepLink";


function openLink(url: string, options: OpenLinkOptions = {}): void {
  const {
    fallbackToWeb = true,
    fallbackDelay = 2500,
    openInNewTab = true,
  } = options;

  const os = detectOS();
  const result = generateDeepLink(url);

  let deepLink: string | null = null;

  if (os === "ios" && result.ios) {
    deepLink = result.ios;
  } else if (os === "android" && result.android) {
    deepLink = result.android;
  }

  if (deepLink && (os === "ios" || os === "android")) {
    // Try to open app deep link
    window.location.href = deepLink;

    if (fallbackToWeb) {
      // Fallback to web if app doesn't open in time
      setTimeout(() => {
        if (openInNewTab) {
          window.open(result.webUrl, "_blank");
        } else {
          window.location.href = result.webUrl;
        }
      }, fallbackDelay);
    }
  } else {
    // Desktop or no deep link available
    if (openInNewTab) {
      window.open(result.webUrl, "_blank");
    } else {
      window.location.href = result.webUrl;
    }
  }
}

export { openLink };