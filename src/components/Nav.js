'use client'

import Image from 'next/image'
import user from '../../public/icon/user.svg'
import bell from '../../public/icon/bell.svg'
import tv from '../../public/icon/tv.png'
import map from '../../public/icon/map.png'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Nav() {
  const pathname = usePathname()

  const links = [
    { href: '/events', icon: map },
    { href: '/video', icon: tv },
    { href: '/listEvent', icon: bell },
    { href: '/start', icon: user },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 flex justify-around items-center h-12 bg-[#F4EDDE] border-t border-gray-300 z-1000">
      {links.map(({ href, icon }) => {
        const isActive = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center text-gray-800"
          >
            <div className={`w-6 h-6 flex items-center justify-center rounded-full transition-colors duration-300 ${
              isActive ? 'bg-black/20' : ''
            }`}>
              <Image
                src={icon}
                alt=""
                width={24}
                height={24}
                className={isActive ? 'filter brightness-0 contrast-150' : ''}
              />
            </div>
          </Link>
        )
      })}
    </nav>
  )
}
