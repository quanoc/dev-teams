import { cn } from '@/lib/utils'
import type { Member } from '@/types'

interface AvatarProps {
  member: Member
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Avatar({ member, size = 'md', className }: AvatarProps) {
  const sizes = { sm: 'w-6 h-6 text-xs', md: 'w-8 h-8 text-sm', lg: 'w-10 h-10 text-base' }
  return (
    <div
      title={member.name}
      className={cn(
        'rounded-full flex items-center justify-center text-white font-medium flex-shrink-0',
        sizes[size],
        member.color,
        className,
      )}
    >
      {member.initials}
    </div>
  )
}
