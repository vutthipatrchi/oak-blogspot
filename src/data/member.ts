export interface MemberProfile {
  id: string
  name: string
  username: string
  email: string
  avatar: string
}

export const defaultMember: MemberProfile = {
  id: 'demo-member',
  name: 'Moodeng ja',
  username: 'moodeng.cute',
  email: 'moodeng.cute@gmail.com',
  avatar: 'https://api.dicebear.com/9.x/thumbs/svg?seed=Moodeng',
}
