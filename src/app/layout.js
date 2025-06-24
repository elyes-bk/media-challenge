import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import 'leaflet/dist/leaflet.css';
import Nav from '../components/Nav';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Nav />
        {children}
      </body>
    </html>
  );
}
