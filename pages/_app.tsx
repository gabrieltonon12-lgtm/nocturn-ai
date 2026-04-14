import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import '../styles/globals.css'

declare global {
  interface Window { fbq: any; ttq: any }
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      // Facebook Pixel — PageView on every route
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'PageView')
      }
      // TikTok Pixel — page on every route
      if (typeof window !== 'undefined' && window.ttq) {
        window.ttq.page()
      }

      // Facebook — InitiateCheckout when visiting billing/plans
      if (url.includes('billing') || url.includes('planos')) {
        if (typeof window !== 'undefined' && window.fbq) {
          window.fbq('track', 'InitiateCheckout', { currency: 'BRL', value: 97 })
        }
      }
    }

    router.events.on('routeChangeComplete', handleRouteChange)
    return () => router.events.off('routeChangeComplete', handleRouteChange)
  }, [router.events])

  return <Component {...pageProps} />
}