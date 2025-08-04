
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'; // ✅ Bon chemin relatif


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GameHub - Plateforme de Jeux',
  description: 'Plongez dans des aventures épiques et créez des souvenirs inoubliables',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        {children}
       
      </body>
    </html>
  )
}