import { safeNavigator } from ".";

const useSupports = () => {
  const nav = safeNavigator();
  const supportsCanShare = !!(nav && (nav as any).canShare);
  const supportsWebShare = !!(nav && (nav as any).share);
  const supportsClipboard = !!(nav && nav.clipboard && nav.clipboard.writeText);

  return {
    supportsWebShare,
    supportsCanShare,
   supportsClipboard,
   nav,
  };
};
export default useSupports;
