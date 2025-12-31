# React Share Utilities

Lightweight React helpers for sharing content, copying to clipboard, and opening deep links with smart fallbacks. Built with TypeScript types, zero runtime dependencies, and drop-in components.

- Docs: https://react-share.sudarshankakde.tech/
- NPM: https://www.npmjs.com/package/react-share-utilities

## Installation

```bash
npm install react-share-utilities
```

**Or using yarn:**
```bash
yarn add react-share-utilities
```

**Or using pnpm:**
```bash
pnpm add react-share-utilities
```

> Works with React 18+ and 19+. Browser-only (uses `navigator`).

## Quick Start

```tsx
import { useShare } from "react-share-utilities";

export default function Example() {
  const { share, isSharing, status, error } = useShare();

  return (
    <button
      disabled={isSharing}
      onClick={() =>
        share({
          url: "https://example.com",
          title: "Hello world",
          text: "Check this out!",
        })
      }
    >
      {status === "sharing" ? "Sharing…" : "Share"}
    </button>
  );
}
```

## Components

### ShareButton

Simplest way to trigger native share with fallback.

```tsx
import { ShareButton } from "react-share-utilities";

<ShareButton
  data={{ url: "https://example.com", title: "Hello", text: "Check this out" }}
  variant="solid"
  color="primary"
  onSuccess={(info) => console.log("shared via", info.method)}
/>;
```

### CopyToClipboard

```tsx
import { CopyToClipboard } from "react-share-utilities";

<CopyToClipboard
  data="https://example.com"
  label="Copy link"
  successLabel="Copied!"
  variant="outline"
/>;
```

### SocialShareButton

Generate and open platform URLs (X, Facebook, LinkedIn, Reddit, WhatsApp, Telegram, Email, etc.).

```tsx
import { SocialShareButton } from "react-share-utilities";

<SocialShareButton
  platform="twitter"
  params={{
    url: "https://example.com",
    title: "A great article",
    via: "yourhandle",
    hashtags: ["react", "sharing"],
  }}
  label="Share on X"
/>;
```

### DeepLinkOpen

Open native apps with graceful web fallback.

```tsx
import { DeepLinkOpen } from "react-share-utilities";

<DeepLinkOpen
  url="https://open.spotify.com/playlist/123"
  label="Open in Spotify"
  options={{ fallbackToWeb: true, fallbackDelay: 2000 }}
  onOpened={({ deepLink, os }) => console.log("opened for", os, deepLink)}
/>;
```

### ShareFallbackModal

UI modal you can show when native sharing is unavailable. (Import and render when `method === 'fallback'` from `useShare`.)

```tsx
import { ShareFallbackModal } from "react-share-utilities";
```

## Hooks

### useShare(options)

- Native `navigator.share` when available; falls back to clipboard or custom function.
- Returns helpers: `share`, `handleShare`, `copyToClipboard`, `openSocialShare`, `socialUrl`, `detectPlatform`, `detectOS`, plus status flags.
- Options: `timeout`, `preferNative`, `fallback` ("clipboard" | "none" | custom fn), `toast` handlers, `messages`, `onSuccess`, `onError`.

### useClipboard(options)

- `copyToClipboard(text)` with status flags and optional fallback.

### useSupports()

- Feature detection for `navigator.share`, `navigator.canShare`, and clipboard.

## Utilities

- `openLink(url, opts)` – deep link with fallback to web.
- `generateDeepLink(url)` – map common URLs to app schemes.
- `buildSocialUrl(platform, params)` – build share URLs for platforms.
- `detectOS()` and `detectPlatform(url)` helpers.
- `safeNavigator()` – guard for SSR/unsupported envs.

## Props & Types

Key types are exported: `ShareInput`, `UseShareOptions`, `UseClipboardReturn`, `UseShareReturn`, `SocialPlatform`, `SocialParams`, `DeepLinkPlatform`, `OpenLinkOptions`, `Variant`, `Color`, `Size`, and icon maps `ICONS`, `LOGOS`, `SHARE_BUTTON_ICONS`, `COPY_TO_CLIPBOARD_ICONS`.

## Styling

Components ship with minimal inline styles; you can style via `className`, `variant`, `color`, and `size`. Icon sets are exported if you want to build custom buttons.

## Examples & Docs

Full docs, live demos, and more recipes: https://react-share.sudarshankakde.tech/

## License

This project is licensed under the [MIT License](https://github.com/sudarshankakde/React-Share-Utilities/blob/main/LICENSE).
