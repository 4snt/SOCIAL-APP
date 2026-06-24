import './globals.css'
import { Inter } from 'next/font/google'
import Header from '../components/Header'
import Providers from '../components/Providers'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata = {
  title: 'UniVoz — UFVJM',
  description: 'Rede social acadêmica para compartilhar demandas e problemas da UFVJM.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="min-h-screen font-sans bg-slate-50">
        <Providers>
          <Header />
          <div className="mx-auto max-w-3xl px-4 py-6">{children}</div>
        </Providers>
      </body>
    </html>
  )
}
