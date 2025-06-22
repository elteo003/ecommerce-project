// File: pages/_app.tsx
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { SessionProvider } from 'next-auth/react'
import Layout from '../components/Layout'
import { AuthProvider } from '../contexts/AuthContext'
import { CartProvider } from '../contexts/CartContext'

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const router = useRouter()
  return (
    <SessionProvider session={session}>
      <AuthProvider>
        <CartProvider>
           <Layout>
            <Component {...pageProps} />
            </Layout>
        
        </CartProvider>
      </AuthProvider>
    </SessionProvider>
  )
}
