import { createFileRoute, Outlet } from '@tanstack/react-router'

import { AppHeader } from '@/components/layout/app-header'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav'
import {
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar'

export const Route = createFileRoute('/app')({
  component: AppLayout,
})

function AppLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset className="min-w-0">
        <AppHeader />

        <div className="flex min-h-0 flex-1 flex-col pb-20 md:pb-0">
          <Outlet />
        </div>

        <MobileBottomNav />
      </SidebarInset>
    </SidebarProvider>
  )
}
