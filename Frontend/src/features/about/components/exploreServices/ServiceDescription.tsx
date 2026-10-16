import { Link } from "@/i18n/navigation";
import type { AboutServiceRow } from "@/features/about/model/aboutPageTypes";

type ServiceDescriptionProps = {
  service: AboutServiceRow;
  className?: string | undefined;
  linkClassName?: string | undefined;
};

function splitWords(text: string) {
  return text.split(/(\s+)/).filter((part) => part.length > 0);
}

export function ServiceDescription({
  service,
  className,
  linkClassName,
}: ServiceDescriptionProps) {
  const parts = splitWords(service.description);

  return (
    <p className={className} data-service-description>
      {parts.map((part, index) => {
        if (/^\s+$/.test(part)) {
          return <span key={`space-${index}`}>{part}</span>;
        }

        return (
          <span
            key={`word-${index}-${part}`}
            className="serviceWordWindow"
            data-service-word-window
          >
            <span className="serviceWordInner" data-service-word-inner>
              {part}
            </span>
          </span>
        );
      })}{" "}
      <Link href={service.href} className={linkClassName}>
        Explore
      </Link>
    </p>
  );
}
