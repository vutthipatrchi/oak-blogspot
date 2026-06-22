import type { Article } from '../data/articles'
import HeroBook from './HeroBook'

interface HeroSectionProps {
  articles: Article[]
  onSelectArticle: (id: number) => void
}

export default function HeroSection({ articles, onSelectArticle }: HeroSectionProps) {
  return (
    <section className="mb-12 grid grid-cols-1 items-center gap-8 lg:mb-20 lg:grid-cols-[minmax(190px,0.8fr)_minmax(420px,1.7fr)_minmax(190px,0.8fr)] lg:gap-9">
      <div className="flex flex-col items-start text-left lg:items-end lg:text-right">
        <h1 className="mb-6 text-[clamp(2.5rem,4.5vw,3.5rem)] leading-[1.2] font-semibold tracking-[-0.03em]">
          Stay<br />Informed,<br />Stay Inspired
        </h1>
        <p className="max-w-none text-base leading-7 text-stone-500 lg:max-w-[300px]">
          Discover remarkable thinkers and writers through their lives, ideas, and work.
        </p>
      </div>

      <HeroBook articles={articles} onSelectArticle={onSelectArticle} />

      <div className="max-w-none lg:max-w-[300px]">
        <span className="mb-2 block text-xs text-stone-500">— About this archive</span>
        <h2 className="mb-4 text-xl font-semibold">Thinkers &amp; Writers</h2>
        <p className="mb-4 text-sm leading-6 text-stone-500">
          พื้นที่รวบรวมเรื่องราวของนักคิดและนักเขียนที่เราชื่นชอบ ผ่านบทความ ประวัติ แนวคิด และผลงานที่น่าสนใจ
        </p>
        <p className="text-sm leading-6 text-stone-500">
          เปิดหนังสือเล่มกลางเพื่อไล่ดูภาพ และเลือกหน้าที่ต้องการเพื่ออ่านบทความฉบับเต็ม
        </p>
      </div>
    </section>
  )
}
