// src/components/layout/app-header.tsx

import { Menu } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useSidebar } from '@/components/ui/sidebar'

export function AppHeader() {
  const { toggleSidebar } = useSidebar()

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center border-b bg-background/90 px-4 backdrop-blur md:h-16 md:px-6">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="hidden md:inline-flex"
        aria-label="Toggle sidebar"
      >
        <Menu />
      </Button>

      <div className="md:hidden">
        <span className="text-sm font-semibold tracking-tight">
          SBD Tomo
        </span>
      </div>

      <div className="ml-auto">
        <div className="size-8 rounded-full bg-muted" />
      </div>
    </header>
  )
}
