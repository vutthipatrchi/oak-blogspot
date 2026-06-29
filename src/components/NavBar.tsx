import type { MemberProfile } from '../data/member'
import { Bell } from 'lucide-react'
import { ProfileMenu } from './ProfileMenu'

interface NavBarProps {
  member: MemberProfile | null
  onLogin: () => void
  onSignUp: () => void
  onProfile: () => void
  onResetPassword: () => void
  onLogout: () => void
}

export function NavBar({ member, onLogin, onSignUp, onProfile, onResetPassword, onLogout }: NavBarProps) {
  return (
    <header className="flex items-center justify-between py-6 pb-8 md:pb-12">
      <a href="/" className="text-2xl font-semibold tracking-tight no-underline">
        hh<span className="text-emerald-500">.</span>
      </a>

      {member ? (
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            type="button"
            className="grid size-10 cursor-pointer place-items-center rounded-full border border-stone-200 bg-white text-stone-500 sm:size-12"
            aria-label="Notifications"
          >
            <Bell className="size-5" strokeWidth={1.7} aria-hidden="true" />
          </button>
          <ProfileMenu
            member={member}
            buttonClassName="flex cursor-pointer items-center gap-2 border-0 bg-transparent p-0 font-medium text-stone-700"
            avatarClassName="size-10 rounded-full object-cover sm:size-12"
            nameClassName="hidden sm:inline"
            chevronClassName="size-4"
            onProfile={onProfile}
            onResetPassword={onResetPassword}
            onLogout={onLogout}
          />
        </div>
      ) : (
        <div className="flex gap-2 sm:gap-3">
          <button type="button" className="cursor-pointer rounded-full border border-stone-800 bg-transparent px-4 py-2 text-sm font-medium text-stone-800 transition-opacity hover:opacity-75 sm:px-6 sm:py-3 sm:text-base" onClick={onLogin}>
            Log in
          </button>
          <button type="button" className="cursor-pointer rounded-full border border-stone-800 bg-stone-800 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-80 sm:px-6 sm:py-3 sm:text-base" onClick={onSignUp}>
            Sign up
          </button>
        </div>
      )}
    </header>
  )
}
