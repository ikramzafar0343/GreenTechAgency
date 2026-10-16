export function splitQuoteWithEmphasis(
  quote: string,
  emphasisText: string | null,
): { before: string; emphasis: string; after: string } | null {
  if (!emphasisText || !quote.includes(emphasisText)) {
    return null;
  }
  const index = quote.indexOf(emphasisText);
  return {
    before: quote.slice(0, index),
    emphasis: emphasisText,
    after: quote.slice(index + emphasisText.length),
  };
}
