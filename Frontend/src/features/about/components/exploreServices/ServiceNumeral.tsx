type ServiceNumeralProps = {
  index: number;
  className?: string | undefined;
};

/** S. stays static; the two digits use a clone-slide window. */
export function ServiceNumeral({ index, className }: ServiceNumeralProps) {
  const digits = String(index).padStart(2, "0").split("");

  return (
    <p className={className} aria-hidden="true" data-service-numeral>
      <span className="serviceNumeralPrefix">S.</span>
      {digits.map((digit, digitIndex) => (
        <span
          key={`digit-${digitIndex}`}
          className="serviceNumeralWindow"
          data-service-digit-window
        >
          <span className="serviceNumeralTrack" data-service-digit-track>
            <span className="serviceNumeralGlyph">{digit}</span>
            <span className="serviceNumeralGlyph" aria-hidden="true">
              {digit}
            </span>
          </span>
        </span>
      ))}
    </p>
  );
}
