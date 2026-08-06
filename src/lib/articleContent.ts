export function splitArticleParagraphs(content: string): string[] {
  return content
    .split(/\r?\n(?:[\t ]*\r?\n)*/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
}
