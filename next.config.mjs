/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
      return [
        {
          source: '/',       // Origem: página inicial
          destination: '/login',  // Destino: página de login
          permanent: true,    // Redirecionamento permanente
        },
      ];
    },
  };
  
  export default nextConfig;
  