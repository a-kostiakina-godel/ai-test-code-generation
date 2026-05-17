export function parsePriceText(text: string): number {
  return parseFloat(text.replace('$', ''));
}
