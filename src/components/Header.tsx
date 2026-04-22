'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { translations } from '@/lib/translations'

interface HeaderProps {
  locale: string
}

export function Header({ locale }: HeaderProps) {
  const pathname = usePathname()
  const t = translations[locale as keyof typeof translations] || translations.ca

  const navItems = [
    { href: `/${locale}`, label: t.nav.home },
    { href: `/${locale}#services`, label: t.nav.services },
    { href: `/${locale}#work`, label: t.nav.work },
    { href: `/${locale}#process`, label: t.nav.process },
    { href: `/${locale}#about`, label: t.nav.about },
    { href: `/${locale}#contact`, label: t.nav.contact },
  ]

  const switchLocale = locale === 'ca' ? 'es' : 'ca'
  const switchPath = pathname.replace(`/${locale}`, `/${switchLocale}`)

  return (
    <header className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href={`/${locale}`} className="text-xl font-bold">
              FSW
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-white/70 hover:text-white transition-colors relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-orange-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <Link
              href={switchPath}
              className="text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              {switchLocale.toUpperCase()}
            </Link>
            <Link
              href={`/${locale}#contact`}
              className="bg-gradient-to-r from-blue-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:shadow-lg transition-all"
            >
              {t.nav.contact}
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}