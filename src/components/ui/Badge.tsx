import React from 'react'
import { cn, getStatusColor } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  className?: string
  variant?: string
}

export function Badge({ children, className, variant }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
        variant ? getStatusColor(variant) : 'bg-secondary text-secondary-foreground',
        className
      )}
    >
      {children}
    </span>
  )
}
