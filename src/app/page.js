'use client';
import Image from "next/image";
import Nav from '../components/Nav';

export default function Home({children}) {
  return (
    <html lang="fr">
      <body>
        <Nav />
        <main>{children}</main>
      </body>
    </html>
  );
}
