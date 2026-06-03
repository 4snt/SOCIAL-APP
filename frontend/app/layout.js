import './globals.css'
import { Inter } from 'next/font/google'
import Header from '../components/Header'
import Providers from '../components/Providers'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata = {
  title: 'social — feed',
  description: 'Rede social leve para compartilhar imagens',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="min-h-screen font-sans">
        <Providers>
          <Header />
          <div className="mx-auto max-w-3xl px-4 py-6">{children}</div>
        </Providers>
      </body>
    </html>
  )
}
