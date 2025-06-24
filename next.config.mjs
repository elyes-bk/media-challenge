// import nextPwa from 'next-pwa'

// const withPWA = nextPwa({
//   dest: 'public',
//   register: true,
//   skipWaiting: true,
// })

// /** @type {import('next').NextConfig} */
// const nextConfig = {}

// export default withPWA(nextConfig)


import nextPwa from 'next-pwa'

const withPWA = nextPwa({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // ✅ Désactive PWA en dev
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // (facultatif mais recommandé)
}

export default withPWA(nextConfig)
