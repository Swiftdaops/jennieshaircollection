/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    domains: ["res.cloudinary.com"],
  },
  async rewrites() {
    return [
      {
        source: "/images/wigs.jpg",
        destination:
          "https://res.cloudinary.com/ds2cq1vue/image/upload/v1769796442/Wig_shop_c7qdzn.jpg",
      },
      {
        source: "/images/tools.jpg",
        destination:
          "https://images.unsplash.com/photo-1540574163026-643ea20ade25?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&s=9f6b1d2b0b4f5c7d9b4c0a6c8f3a2b1a",
      },
      {
        source: "/images/accessories.jpg",
        destination:
          "https://res.cloudinary.com/ds2cq1vue/image/upload/v1769796638/__3_gzqq3h.jpg",
      },
    ];
  },
};

export default nextConfig;
