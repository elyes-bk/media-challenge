'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Nav() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Accueil' },
    { href: '/login', label: 'Connexion' },
    { href: '/register', label: 'Inscription' },
    { href: '/events', label: 'Événements' },
  ];

  return (
    <nav style={{
      display: 'flex',
      gap: '16px',
      padding: '12px 24px',
      borderBottom: '1px solid #ddd',
      backgroundColor: '#f9f9f9'
    }}>
      {links.map(({ href, label }) => (
        <Link key={href} href={href} style={{
          textDecoration: pathname === href ? 'underline' : 'none',
          fontWeight: pathname === href ? 'bold' : 'normal',
          color: '#333'
        }}>
          {label}
        </Link>
      ))}
    </nav>
  );
}
