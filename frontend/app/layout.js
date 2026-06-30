import './globals.css'
import { Inter, Oswald } from 'next/font/google'
import Header from '../components/Header'
import Providers from '../components/Providers'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const oswald = Oswald({ subsets: ['latin'], variable: '--font-oswald' })

export const metadata = {
  title: 'UniVoz — UFVJM',
  description: 'Rede social acadêmica para compartilhar demandas e problemas da UFVJM.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${oswald.variable}`}>
      <body className="min-h-screen font-sans" style={{ backgroundColor: '#F1F7D4' }}>
        <Providers>
          <Header />
          <div className="mx-auto max-w-3xl px-3 py-4 sm:px-4 sm:py-6">{children}</div>
        </Providers>
      </body>
    </html>
  )
}
