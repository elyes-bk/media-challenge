'use client';
import Image from "next/image";
import Nav from '../components/Nav';

export default function Home({children}) {
  return (
      <div>
        <Nav />
        <main>{children}</main>
      </div>
  );
}
