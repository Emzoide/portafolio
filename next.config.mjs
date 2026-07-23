/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Optimización activada: las capturas pesan hasta 435KB en PNG; next/image
  // las sirve en WebP al tamaño real de pantalla. (El scaffold de v0 venía con
  // unoptimized: true, que en Vercel es desperdicio.)
}

export default nextConfig
