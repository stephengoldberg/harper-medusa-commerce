/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        // Required: Mark HarperDB as external
        config.externals.push({
            harperdb: 'commonjs harperdb',
        });
        return config;
    },
    images: {
        domains: ['images.unsplash.com'],
    },
};

module.exports = nextConfig;