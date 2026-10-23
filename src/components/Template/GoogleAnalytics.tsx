import Script from 'next/script';

/** GA4 measurement IDs are `G-` plus uppercase letters and digits. */
const GA_ID_PATTERN = /^G-[A-Z0-9]+$/;

/**
 * Google Analytics 4, off unless NEXT_PUBLIC_GA_TRACKING_ID is set at build.
 *
 * Plain `next/script` rather than `@next/third-parties/google`: the latter
 * reaches into Next internals that vinext does not implement, and rendered as
 * `undefined` in the static export. The ID is validated before it is written
 * into the inline snippet, so a malformed value cannot inject script.
 */
export default function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_TRACKING_ID;

  if (!gaId || !GA_ID_PATTERN.test(gaId)) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`}
      </Script>
    </>
  );
}
