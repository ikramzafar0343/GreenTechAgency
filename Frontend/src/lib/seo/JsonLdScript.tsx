import { jsonLdScript, type JsonLd } from "@/lib/seo/jsonLd";

export function JsonLdScript({ data }: { data: JsonLd | JsonLd[] | null }) {
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdScript(data) }}
    />
  );
}
