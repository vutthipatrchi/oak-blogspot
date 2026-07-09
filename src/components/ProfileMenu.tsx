import { useEffect, useId, useRef, useState } from 'react'
import { ChevronDown, LogOut, RotateCcw, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { MemberProfile } from '../data/member'

interface ProfileMenuProps {
  member: MemberProfile
  buttonClassName: string
  avatarClassName?: string
  nameClassName?: string
  chevronClassName?: string
  onProfile: () => void
  onResetPassword: () => void
  onLogout: () => void
}

export function ProfileMenu({
  member,
  buttonClassName,
  avatarClassName,
  nameClassName,
  chevronClassName,
  onProfile,
  onResetPassword,
  onLogout,
}: ProfileMenuProps) {
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()
  const menuId = useId()
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const runAction = (action: () => void) => {
    setOpen(false)
    action()
  }

  return (
    <div className="profile-menu" ref={rootRef}>
      <button
        type="button"
        className={buttonClassName}
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
      >
        <img src={member.avatar} alt="" className={avatarClassName} />
        <span className={nameClassName}>{member.name}</span>
        <ChevronDown className={chevronClassName} aria-hidden="true" />
      </button>

      {open && (
        <div className="profile-menu__panel" id={menuId} role="menu">
          <button type="button" className="profile-menu__item" role="menuitem" onClick={() => runAction(onProfile)}>
            <User size={20} strokeWidth={1.6} aria-hidden="true" />
            <span>{t('common.profile')}</span>
          </button>
          <button
            type="button"
            className="profile-menu__item"
            role="menuitem"
            onClick={() => runAction(onResetPassword)}
          >
            <RotateCcw size={20} strokeWidth={1.6} aria-hidden="true" />
            <span>{t('common.resetPassword')}</span>
          </button>
          <button
            type="button"
            className="profile-menu__item profile-menu__item--danger"
            role="menuitem"
            onClick={() => runAction(onLogout)}
          >
            <LogOut size={20} strokeWidth={1.6} aria-hidden="true" />
            <span>{t('common.logout')}</span>
          </button>
        </div>
      )}
    </div>
  )
}
