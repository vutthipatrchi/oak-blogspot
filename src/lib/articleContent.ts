import type { ArticleSection } from '../data/articles'

export function splitArticleParagraphs(content: string): string[] {
  return content
    .split(/\r?\n(?:[\t ]*\r?\n)*/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
}

// Keep original paragraph boundaries when only another field was edited.
export function articleSectionsFromForm(form: FormData, sections: ArticleSection[]): ArticleSection[] {
  return sections.map((section, index) => {
    const content = String(form.get(`section-content-${index}`) ?? '')
    return {
      ...section,
      title: String(form.get(`section-title-${index}`) ?? ''),
      paragraphs: content === section.paragraphs.join('\n\n')
        ? [...section.paragraphs]
        : splitArticleParagraphs(content),
      ...(section.bullets ? {
        bullets: section.bullets.map((_bullet, bulletIndex) => ({
          term: String(form.get(`section-bullet-term-${index}-${bulletIndex}`) ?? ''),
          description: String(form.get(`section-bullet-description-${index}-${bulletIndex}`) ?? ''),
        })),
      } : {}),
    }
  })
}
