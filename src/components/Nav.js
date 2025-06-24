'use client'

import Image from 'next/image'
import user from '../../public/icon/user.svg'
import bell from '../../public/icon/bell.svg'
import tv from '../../public/icon/tv.png'
import map from '../../public/icon/map.png'
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Nav() {
  const pathname = usePathname();

  const links = [
    { href: '/events', icon: map },
    { href: '/video', icon: tv },
    { href: '/listEvent', icon: bell },
    { href: '/start', icon: user },
  ];

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      display: 'flex',
      justifyContent: 'space-around',
      padding: '12px 0',
      borderTop: '1px solid #ddd',
      backgroundColor: '#F4EDDE',
      height: 48,
      zIndex: 1000
    }}>
      {links.map(({ href, icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textDecoration: 'none',
              color: '#333'
            }}
          >
            <div style={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              backgroundColor: isActive ? 'rgba(0, 0, 0, 0.20)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.3s ease'
            }}>
              <Image
                src={icon}
                alt=""
                width={24}
                height={24}
                style={{
                  filter: isActive ? 'brightness(0) saturate(100%) contrast(150%)' : 'none'
                }}
              />
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
