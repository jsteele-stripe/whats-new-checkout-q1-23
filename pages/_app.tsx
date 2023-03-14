import type { AppProps } from 'next/app'

import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto py-12 space-y-8">
      <Component {...pageProps} />
    </div>
  )
}
