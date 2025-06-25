import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import 'leaflet/dist/leaflet.css';
import Nav from '../components/Nav';

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icon/Frame.png" />
        <meta name="theme-color" content="# #0070f3" />      
      </head>
      <body>
        <Nav />
        {children}
      </body>
    </html>
  );
}

