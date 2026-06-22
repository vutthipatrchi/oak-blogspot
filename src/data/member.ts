export interface MemberProfile {
  name: string
  username: string
  email: string
  avatar: string
}

export const defaultMember: MemberProfile = {
  name: 'Moodeng ja',
  username: 'moodeng.cute',
  email: 'moodeng.cute@gmail.com',
  avatar: 'https://api.dicebear.com/9.x/thumbs/svg?seed=Moodeng',
}
