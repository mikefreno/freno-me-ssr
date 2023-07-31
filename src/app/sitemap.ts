import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://www.freno.me",
      lastModified: new Date(),
    },
    {
      url: "https://www.freno.me/projects",
      lastModified: new Date(),
    },
    {
      url: "https://www.freno.me/blog",
      lastModified: new Date(),
    },
    {
      url: "https://www.freno.me/contact",
      lastModified: new Date(),
    },
    {
      url: "https://www.freno.me/login",
      lastModified: new Date(),
    },
  ];
}
