export function normalizeTextSpacing(text: string): string {
  return text
    .replace(/\n\s*\n/g, "\n\n")
    .replace(/(?<=\S)\n(?=\S)/g, " ")
    .trim();
}
