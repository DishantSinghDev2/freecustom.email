export const metadata = {
  title: 'Free Custom Temporary Email Address - Temp Mail',
  description: 'Keep your real email inbox clean with our fastest temp mail service. Temporary emails are perfect for any transaction where you want to improve your online privacy. Use our disposable email addresses for ad blocking, no spam, no ads, just temporary email.',
  favicon: '/favicon.ico',
  // Open Graph
  ogTitle: 'Free Custom Temporary Email Address - Temp Mail',
  ogDescription: 'Keep your real email inbox clean with our fastest temp mail service. Temporary emails are perfect for any transaction where you want to improve your online privacy. Use our disposable email addresses for ad blocking, no spam, no ads, just temporary email.',
  ogImage: 'https://freecustom.email/logo.png',
  ogUrl: 'https://freecustom.email/',
  // Target Keywords
  keywords: 'temp mail, custom mail, disposable email, temporary email, fake email, email privacy, spam-free email, temporary inbox, 10minmail, fastest temp mail, no ads temp mail, forever free temp mail'
}
import { GoogleAnalytics } from '@next/third-parties/google'
import "@/styles/global.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
      <GoogleAnalytics gaId="G-RXTEEVC8C4" />
        <link rel="icon" href="/favicon.ico" />
<script type="text/javascript" src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js" async></script>
      </head>
      <body>{children}</body>
    </html>
  )
}
