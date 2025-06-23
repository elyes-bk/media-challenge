/** @type {import('next').NextConfig} 
/*
const nextConfig = {};

export default nextConfig;
*/

import nextPWA from 'next-pwa';

const isDev = process.env.NODE_ENV === 'development'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // ajoute ici d'autres options si nécessaire
};

export default nextPWA({
  dest: 'public',
  disable: isDev, //desactive le pwa en mode developpement
  register: true,
  skipWaiting: true,
})(nextConfig);

