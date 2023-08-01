import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/blog", "/projects"],
      disallow: ["/login", "/debug/**", "/databaseMGMT"],
    },
    sitemap: "https://www.freno.me/sitemap.xml",
  };
}
