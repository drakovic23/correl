/** @type {import('next').NextConfig} */
const nextConfig = {    async headers() {
        return [
            {
                // matching all API routes
                source: "/",
                headers: [
                    { key: "Access-Control-Allow-Origin", value: "*" },
                    { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
                    { key: "Access-Control-Allow-Headers", value: "Content-Type Date Server Transfer-Encoding" },
                ]
            }
        ]
    }};

export default nextConfig;
