import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Map of Mathematics',
  description: 'A website showing maths subjects and their dependencies',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className+ " bg-gradient-to-br from-slate-800 to-slate-950"}>{children}</body>
    </html>
  )
}
