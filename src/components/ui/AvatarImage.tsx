import type { ImgHTMLAttributes } from 'react'

const defaultAvatar = '/anonymous-avatar.svg'

interface AvatarImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'onError'> {
  src?: string | null
}

export function AvatarImage({ src, ...props }: AvatarImageProps) {
  return (
    <img
      {...props}
      src={src?.trim() || defaultAvatar}
      onError={(event) => {
        if (event.currentTarget.getAttribute('src') !== defaultAvatar) {
          event.currentTarget.src = defaultAvatar
        }
      }}
    />
  )
}
