import type { OSType } from "../../index.d.ts";

/**
 * Detect device OS from user agent
 *
 * Returns the operating system type:
 * - "ios": Apple devices (iPhone, iPad, iPod)
 * - "android": Android devices
 * - "desktop": Windows, macOS, Linux, or unknown
 */
function detectOS(): OSType {
  if (typeof window === "undefined") {
    return "desktop";
  }

  const userAgent = window.navigator.userAgent.toLowerCase();

  if (/iphone|ipad|ipod/.test(userAgent)) {
    return "ios";
  }

  if (/android/.test(userAgent)) {
    return "android";
  }

  return "desktop";
}

export { detectOS };
export default detectOS;