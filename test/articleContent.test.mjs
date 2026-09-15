import assert from 'node:assert/strict'
import { test } from 'node:test'
import { articles } from '../src/data/articles.ts'
import { articleSectionsFromForm, isPublishedArticle } from '../src/lib/articleContent.ts'

function formFor(sections) {
  const form = new FormData()
  sections.forEach((section, index) => {
    form.set(`section-title-${index}`, section.title)
    form.set(`section-content-${index}`, section.paragraphs.join('\n\n'))
    section.bullets?.forEach((bullet, bulletIndex) => {
      form.set(`section-bullet-term-${index}-${bulletIndex}`, bullet.term)
      form.set(`section-bullet-description-${index}-${bulletIndex}`, bullet.description)
    })
  })
  return form
}
const sections = [
  { title: 'หัวข้อแรก', paragraphs: ['Paragraph with\ninternal newline', 'Second paragraph'], bullets: [
    { term: 'คำศัพท์', description: 'คำอธิบาย\nอีกบรรทัด' },
    { term: 'Second term', description: 'Second description' },
  ] },
  { title: 'หัวข้อสอง', paragraphs: ['Another section'] },
]
test('saving every seed article preserves headings, paragraphs, bullets, and section order', () => {
  for (const article of articles) {
    assert.deepEqual(articleSectionsFromForm(formFor(article.sections), article.sections), article.sections)
  }
})
test('saving unchanged structured content preserves exact text and does not mutate input', () => {
  const original = structuredClone(sections)
  const saved = articleSectionsFromForm(formFor(sections), sections)
  assert.deepEqual(saved, original)
  saved[0].paragraphs.push('Changed')
  saved[0].bullets[0].term = 'Changed'
  assert.deepEqual(sections, original)
})
test('editing one section or bullet leaves other content intact', () => {
  const form = formFor(sections)
  form.set('section-title-0', 'New heading')
  form.set('section-content-1', 'Updated paragraph\n\nNext paragraph')
  form.set('section-bullet-description-0-1', 'Updated description')
  const expected = structuredClone(sections)
  expected[0].title = 'New heading'
  expected[1].paragraphs = ['Updated paragraph', 'Next paragraph']
  expected[0].bullets[1].description = 'Updated description'
  assert.deepEqual(articleSectionsFromForm(form, sections), expected)
})
test('new plain content and bullet-only sections can be saved', () => {
  const empty = [{ title: '', paragraphs: [] }]
  const form = formFor(empty)
  form.set('section-content-0', 'First paragraph\r\n\r\nSecond paragraph')
  assert.deepEqual(articleSectionsFromForm(form, empty), [{ title: '', paragraphs: ['First paragraph', 'Second paragraph'] }])
  const bulletsOnly = [{ title: 'List', paragraphs: [], bullets: [{ term: 'Term', description: 'Description' }] }]
  assert.deepEqual(articleSectionsFromForm(formFor(bulletsOnly), bulletsOnly), bulletsOnly)
})
test('articles without an explicit status remain visible as published static fallbacks', () => {
  assert.equal(articles.every(isPublishedArticle), true)
  assert.equal(isPublishedArticle({ ...articles[0], status: 'draft' }), false)
})
