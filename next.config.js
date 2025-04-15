/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: false,
      },
    ]
  },
  // Configurações para otimizar o hot reload
  webpack: (config, { dev, isServer }) => {
    // Otimizações apenas para desenvolvimento
    if (dev) {
      // Habilita o hot reload para todos os módulos
      config.optimization.moduleIds = 'named';
      config.optimization.chunkIds = 'named';
      
      // Desativa a minificação em desenvolvimento para melhorar o hot reload
      config.optimization.minimize = false;
    }
    return config;
  },
};

module.exports = nextConfig; 