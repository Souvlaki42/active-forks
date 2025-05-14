import type { NextConfig } from "next";

import "~/lib/env";
const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				hostname: "avatars.githubusercontent.com",
				protocol: "https",
				pathname: "/**",
			},
		],
	},
};

export default nextConfig;
