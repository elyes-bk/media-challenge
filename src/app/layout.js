import './globals.css';
import 'leaflet/dist/leaflet.css';
import Nav from '../components/Nav';
import ClientLayout from './ClientLayout';

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="transition-colors duration-300 bg-[#f5ecdc] dark:bg-[#23221f]">
        <ClientLayout>
          <Nav />
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}

