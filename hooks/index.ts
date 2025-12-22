


function safeNavigator(): Navigator | undefined {
  if (typeof window === "undefined") return undefined;
  return typeof navigator === "undefined" ? undefined : navigator;
}



export {  safeNavigator };