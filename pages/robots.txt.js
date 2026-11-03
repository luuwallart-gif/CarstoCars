import config from "../site.config";

export async function getServerSideProps({ res }) {
  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Cache-Control", "public, s-maxage=86400");
  res.write(`User-agent: *\nAllow: /\n\nSitemap: ${config.url}/sitemap.xml\n`);
  res.end();
  return { props: {} };
}

export default function Robots() { return null; }
