// src/components/layout/mobile-bottom-nav.tsx

import {
  BarChart3,
  Dumbbell,
  History,
  Home,
  MoreHorizontal,
} from 'lucide-react'

import { Link, useRouterState } from '@tanstack/react-router'

const items = [
  {
    title: 'Today',
    to: '/app',
    icon: Home,
  },
  {
    title: 'Train',
    to: '/app/training',
    icon: Dumbbell,
  },
  {
    title: 'History',
    to: '/app/history',
    icon: History,
  },
  {
    title: 'Analytics',
    to: '/app/analytics',
    icon: BarChart3,
  },
  {
    title: 'More',
    to: '/app/settings',
    icon: MoreHorizontal,
  },
] as const

export function MobileBottomNav() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      <div className="grid h-16 grid-cols-5">
        {items.map((item) => {
          const active =
            item.to === '/app'
              ? pathname === '/app'
              : pathname.startsWith(item.to)

          return (
            <Link
              key={item.to}
              to={item.to}
              className="flex min-w-0 flex-col items-center justify-center gap-1 px-1"
            >
              <item.icon
                className={
                  active
                    ? 'size-5 text-brand'
                    : 'size-5 text-muted-foreground'
                }
              />

              <span
                className={
                  active
                    ? 'text-[11px] font-medium text-foreground'
                    : 'text-[11px] text-muted-foreground'
                }
              >
                {item.title}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
