export type Category = 'Highlight' | 'Thinker' | 'Writer' | 'Literature'

export interface ArticleSection {
  title: string
  paragraphs: string[]
  bullets?: { term: string; description: string }[]
}

export interface Comment {
  id: number
  author: string
  avatar: string
  date: string
  text: string
}

export interface Article {
  id: number
  category: Exclude<Category, 'Highlight'>
  tags: string[]
  title: string
  excerpt: string
  image: string
  author: string
  authorAvatar: string
  authorBio: string[]
  date: string
  likes: number
  sections: ArticleSection[]
  source?: { label: string; url: string }
  comments: Comment[]
}

export const categories: Category[] = [
  'Highlight',
  'Thinker',
  'Writer',
  'Literature',
]

const authorBio = [
  'I am a pet enthusiast and freelance writer who specializes in animal behavior and care. With a deep love for cats, I enjoy sharing insights on feline companionship and wellness.',
  "When i'm not writing, I spends time volunteering at my local animal shelter, helping cats find loving homes.",
]

const defaultComments: Comment[] = [
  {
    id: 1,
    author: 'Jacob Lash',
    avatar:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&crop=face',
    date: '12 September 2024 at 18:30',
    text: 'I loved this article! It really helped me understand my cat better.',
  },
  {
    id: 2,
    author: 'Ahri',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face',
    date: '12 September 2024 at 20:15',
    text: 'So insightful! The section on body language was especially helpful.',
  },
  {
    id: 3,
    author: 'Mimi mama',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
    date: '13 September 2024 at 09:42',
    text: 'My two cats definitely have playful personalities. Great read!',
  },
]

export const articles: Article[] = [
  {
    id: 1,
    category: 'Thinker',
    tags: ['Thai Thinker', 'Political Philosophy', 'Interdisciplinary'],
    title:
      'ธเนศ วงศ์ยานนาวา: นักคิดข้ามศาสตร์ผู้ตั้งคำถามกับความเชื่อเดิม',
    excerpt:
      'รู้จักนักวิชาการผู้เชื่อมโยงปรัชญาการเมือง ทฤษฎีสังคม ประวัติศาสตร์ความคิด และวัฒนธรรมร่วมสมัยเข้าด้วยกันอย่างไม่จำกัดกรอบ',
    image: '/article-images/article-1.jpg',
    author: 'ธเนศ วงศ์ยานนาวา',
    authorAvatar: '/article-images/article-1.jpg',
    authorBio: [
      'ศาสตราจารย์และนักวิชาการด้านการเมืองการปกครอง ผู้เชี่ยวชาญด้านปรัชญาการเมือง ทฤษฎีสังคม และประวัติศาสตร์ความคิด',
      'ผลงานและการสอนของเขามักเชื่อมโยงการเมืองเข้ากับวัฒนธรรม ภาพยนตร์ ดนตรี เพศ และอาหาร ผ่านมุมมองแบบสหวิทยาการ',
    ],
    date: '21 June 2026',
    likes: 284,
    sections: [
      {
        title: 'นักวิชาการผู้คิดข้ามพรมแดน',
        paragraphs: [
          'ธเนศ วงศ์ยานนาวา เกิดเมื่อวันที่ 22 มิถุนายน พ.ศ. 2500 เป็นศาสตราจารย์ด้านการเมืองการปกครอง คณะรัฐศาสตร์ มหาวิทยาลัยธรรมศาสตร์ เขาเป็นที่รู้จักจากความเชี่ยวชาญด้านปรัชญาการเมือง ทฤษฎีสังคม และประวัติศาสตร์ความคิด โดยเฉพาะแนวคิดหลังสมัยใหม่ จนได้รับการกล่าวถึงว่าเป็นหนึ่งในนักคิดโพสต์โมเดิร์นคนสำคัญของไทย',
        ],
      },
      {
        title: 'เส้นทางการศึกษาและการก้าวออกจากกรอบ',
        paragraphs: [
          'ธเนศจบการศึกษาด้านสังคมวิทยาและมานุษยวิทยาจากจุฬาลงกรณ์มหาวิทยาลัย ก่อนศึกษาต่อด้านสังคมวิทยาที่มหาวิทยาลัยวิสคอนซิน–แมดิสัน และด้านทฤษฎีสังคมและการเมืองที่มหาวิทยาลัยเคมบริดจ์ ประสบการณ์เหล่านี้ทำให้เขาพัฒนาวิธีคิดที่ไม่ยึดติดกับศาสตร์ใดศาสตร์หนึ่ง และมองว่าปรากฏการณ์ทางสังคมควรถูกพิจารณาจากหลายมิติร่วมกัน',
        ],
      },
      {
        title: 'จากการเมืองสู่วัฒนธรรมในชีวิตประจำวัน',
        paragraphs: [
          'ความสนใจของธเนศไม่ได้หยุดอยู่ที่รัฐศาสตร์ แต่ขยายไปถึงดนตรี ภาพยนตร์ เพศ อาหาร และวัฒนธรรมร่วมสมัย เขามักหยิบเรื่องใกล้ตัวมาเชื่อมกับคำถามเรื่องอำนาจ ความรู้ อัตลักษณ์ และประวัติศาสตร์ ทำให้แนวคิดที่ซับซ้อนเข้าถึงผู้ฟังในพื้นที่สาธารณะได้มากขึ้น',
        ],
      },
      {
        title: 'คุณูปการทางความคิด',
        paragraphs: [
          'งานสอนและงานเขียนของธเนศชวนให้ผู้คนตรวจสอบรากของความเชื่อ ไม่แยกสิ่งต่าง ๆ ออกจากบริบท และยอมรับว่าโลกมีมากกว่าคำอธิบายเพียงแบบเดียว ผลงานของเขาครอบคลุมฟูโกต์ ประวัติศาสตร์นิยม โพสต์โมเดิร์น เสรีประชาธิปไตย และการเมืองของวัฒนธรรม ขณะเดียวกันบุคลิกที่เข้าถึงง่ายและการถ่ายทอดอย่างมีสีสันทำให้เขาเป็นนักวิชาการสาธารณะที่มีผู้ติดตามอย่างกว้างขวาง',
        ],
      },
    ],
    source: {
      label: 'วิกิพีเดีย: ธเนศ วงศ์ยานนาวา',
      url: 'https://th.wikipedia.org/wiki/%E0%B8%98%E0%B9%80%E0%B8%99%E0%B8%A8_%E0%B8%A7%E0%B8%87%E0%B8%A8%E0%B9%8C%E0%B8%A2%E0%B8%B2%E0%B8%99%E0%B8%99%E0%B8%B2%E0%B8%A7%E0%B8%B2',
    },
    comments: defaultComments,
  },
  {
    id: 2,
    category: 'Thinker',
    tags: ['Thai Thinker', 'Philosophy', 'Essay'],
    title: 'Lost in Thought: ความเปลี่ยวดายอันกึกก้องเกินต้าน',
    excerpt:
      'Explore the captivating universe of cats, from their mysterious nature to the joy they bring into our lives every day.',
    image: '/article-images/article-2.jpg',
    author: 'Thompson P.',
    authorAvatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
    authorBio,
    date: '11 September 2024',
    likes: 321,
    sections: [
      {
        title: '',
        paragraphs: [
          'Cats have captivated human hearts for thousands of years with their mysterious nature and charming personalities. From their playful antics to their soothing purrs, these furry companions bring joy and comfort to millions of households worldwide.',
        ],
      },
      {
        title: '1. Independent Yet Affectionate',
        paragraphs: [
          'Cats are known for their independent nature, but that doesn\'t mean they don\'t crave affection. Unlike dogs, who are often eager to please, cats choose when and how they interact with their human companions. This selective affection makes every moment of bonding feel special and earned.',
        ],
      },
      {
        title: '2. Playful Personalities',
        paragraphs: [
          'From chasing laser pointers to pouncing on feather toys, cats retain their hunting instincts throughout their lives. Their playful behavior is not only entertaining but also essential for their physical and mental well-being. Watching a cat play is a reminder of their wild ancestry.',
        ],
      },
      {
        title: '3. Communication Through Body Language',
        paragraphs: [
          'Cats are master communicators, using subtle body language to express their feelings. Understanding these signals can deepen your bond with your feline friend:',
        ],
        bullets: [
          {
            term: 'Purring',
            description:
              'Usually a sign of contentment, though cats may also purr when anxious or in pain.',
          },
          {
            term: 'Tail Position',
            description:
              'A tail held high indicates confidence, while a puffed tail signals fear or aggression.',
          },
          {
            term: 'Slow Blinks',
            description:
              'Often called "cat kisses," slow blinking is a sign of trust and affection.',
          },
        ],
      },
      {
        title: '4. Health Benefits of Having a Cat',
        paragraphs: [
          'Studies have shown that cat ownership can reduce stress, lower blood pressure, and even decrease the risk of heart disease. The calming effect of a cat\'s presence and the routine of caring for them can bring structure and comfort to daily life.',
        ],
      },
      {
        title: '5. A History with Humans',
        paragraphs: [
          'Cats were first domesticated in the Near East around 7500 BC. Ancient Egyptians revered them, associating cats with the goddess Bastet. Today, cats are one of the most popular pets globally, beloved for their grace, independence, and companionship.',
        ],
      },
    ],
    comments: defaultComments,
  },
  {
    id: 3,
    category: 'Writer',
    tags: ['Thai Writer', 'Literary Fiction', 'Memory'],
    title:
      'พบบางแห่งรำลึกพันธุ์ไม้นิรันดาน: เมื่อความทรงจำผลิบานผ่านวรรณกรรม',
    excerpt:
      'Learn practical strategies to maintain your motivation and find inspiration even during difficult times in life.',
    image: '/article-images/article-3.jpg',
    author: 'Thompson P.',
    authorAvatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
    authorBio,
    date: '11 September 2024',
    likes: 198,
    sections: [
      {
        title: 'Embrace Small Wins',
        paragraphs: [
          'Motivation often fades when goals feel too distant. Breaking challenges into smaller, achievable steps creates momentum and keeps inspiration alive through difficult periods.',
        ],
      },
      {
        title: 'Find Your Why',
        paragraphs: [
          'Reconnecting with the deeper purpose behind your goals can reignite passion when external circumstances feel overwhelming.',
        ],
      },
    ],
    comments: defaultComments,
  },
  {
    id: 4,
    category: 'Writer',
    tags: ['Thai Writer', 'Poetry', 'Identity'],
    title:
      'สาระของความว่างเปล่า: อ่านความเงียบที่ซ่อนอยู่ในชีวิต',
    excerpt:
      "Uncover the scientific mysteries behind a cat's purr and its surprising healing effects on both felines and humans.",
    image: '/article-images/article-4.jpg',
    author: 'Thompson P.',
    authorAvatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
    authorBio,
    date: '11 September 2024',
    likes: 256,
    sections: [
      {
        title: 'The Mechanics of Purring',
        paragraphs: [
          'Cats produce their distinctive purr through rapid vibrations of the laryngeal muscles, typically at frequencies between 25 and 150 Hertz — a range that researchers believe may promote healing.',
        ],
      },
      {
        title: 'Healing Properties',
        paragraphs: [
          'Studies suggest that exposure to these frequencies may help reduce pain, heal bones, and lower stress in both cats and the humans who care for them.',
        ],
      },
    ],
    comments: defaultComments,
  },
  {
    id: 5,
    category: 'Thinker',
    tags: ['Global Thinker', 'Psychology', 'Ideas'],
    title: 'Thinking, Fast and Slow: เข้าใจสองระบบความคิดของมนุษย์',
    excerpt:
      'Transform your daily routine with easy-to-implement habits that will unlock your creative potential and inspire fresh ideas.',
    image: '/article-images/article-5.jpeg',
    author: 'Thompson P.',
    authorAvatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
    authorBio,
    date: '11 September 2024',
    likes: 167,
    sections: [
      {
        title: 'Morning Rituals',
        paragraphs: [
          'Starting the day with a creative ritual — journaling, sketching, or simply observing your surroundings — primes the mind for innovative thinking throughout the day.',
        ],
      },
      {
        title: 'Embrace Curiosity',
        paragraphs: [
          'Asking questions and exploring unfamiliar topics keeps the creative muscle active and opens doors to unexpected inspiration.',
        ],
      },
    ],
    comments: defaultComments,
  },
  {
    id: 6,
    category: 'Literature',
    tags: ['Manga', 'Visual Culture', 'Literary Theory'],
    title: 'Theories of Manga: อ่านมังงะผ่านแนวคิดและภาษาภาพ',
    excerpt:
      'Essential veterinary-approved advice to ensure your feline friend lives a long, happy, and healthy life by your side.',
    image: '/article-images/article-6.jpg',
    author: 'Thompson P.',
    authorAvatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
    authorBio,
    date: '11 September 2024',
    likes: 312,
    sections: [
      {
        title: 'Nutrition Matters',
        paragraphs: [
          'A balanced diet tailored to your cat\'s age and health needs forms the foundation of their well-being. Fresh water and portion control are equally important.',
        ],
      },
      {
        title: 'Regular Vet Visits',
        paragraphs: [
          'Annual check-ups help catch health issues early. Vaccinations, dental care, and parasite prevention keep your cat thriving for years to come.',
        ],
      },
    ],
    comments: defaultComments,
  },
]

export function getArticleById(id: number): Article | undefined {
  return articles.find((article) => article.id === id)
}
