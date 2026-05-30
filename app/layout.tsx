import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Custom Software Readiness Assessment | GOLM',
  description: 'See if custom software is worth it for your niche operations business. Free 2-minute assessment.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Read env vars at render time. Template literals require string — guard with || ''
  // so TypeScript is happy when the var is undefined (not yet configured, D-009).
  const ga4Id = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || ''
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || ''

  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-base text-text">
        {children}

        {/* ── GA4 — only injected when the measurement ID is configured ─── */}
        {ga4Id && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                window.gtag = gtag;
                gtag('js', new Date());
                gtag('config', '${ga4Id}', {
                  send_page_view: false
                });
              `}
            </Script>
          </>
        )}

        {/* ── Microsoft Clarity — only injected when the project ID is configured */}
        {clarityId && (
          <Script id="clarity-init" strategy="afterInteractive">
            {`
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${clarityId}");
            `}
          </Script>
        )}
      </body>
    </html>
  )
}
