export default function robots() {
  return {
    rules: [
      { userAgent: '*', disallow: ['/admin', '/api'] },
    ],
    sitemap: null,
  };
}
