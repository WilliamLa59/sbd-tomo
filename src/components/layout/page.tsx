// src/components/layout/page.tsx

import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface PageProps {
  children: ReactNode
  className?: string
}

export function Page({ children, className }: PageProps) {
  return (
    <main className={cn('py-6 md:py-8 lg:py-10', className)}>
      {children}
    </main>
  )
}
