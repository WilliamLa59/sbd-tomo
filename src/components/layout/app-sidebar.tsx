// src/components/layout/app-sidebar.tsx

import {
  BarChart3,
  CalendarDays,
  Dumbbell,
  History,
  Home,
  Settings,
} from 'lucide-react'

import { Link, useRouterState } from '@tanstack/react-router'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

const navigation = [
  {
    title: 'Today',
    to: '/app',
    icon: Home,
  },
  {
    title: 'Training',
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
    title: 'Programming',
    to: '/app/programming',
    icon: CalendarDays,
  },
] as const

export function AppSidebar() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  return (
    <Sidebar
      variant="inset"
      collapsible="icon"
      className="hidden md:flex"
    >
      <SidebarHeader className="p-3">
        <Link
          to="/app"
          className="
            flex h-12 items-center gap-3 rounded-lg px-1
            group-data-[collapsible=icon]:justify-center
            group-data-[collapsible=icon]:px-0
          "
        >
          <div
            className="
              flex size-10 shrink-0 items-center justify-center
              rounded-lg bg-brand text-sm font-semibold
              text-brand-foreground
            "
          >
            S
          </div>

          <div
            className="
              min-w-0 leading-tight
              group-data-[collapsible=icon]:hidden
            "
          >
            <div className="truncate font-medium tracking-tight">
              SBD Tomo
            </div>

            <div className="truncate text-xs text-muted-foreground">
              Training
            </div>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
            Training
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {navigation.map((item) => {
                const isActive =
                  item.to === '/app'
                    ? pathname === '/app'
                    : pathname.startsWith(item.to)

                return (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className="
                        h-11 gap-3 px-3
                        group-data-[collapsible=icon]:size-11
                        group-data-[collapsible=icon]:justify-center
                        group-data-[collapsible=icon]:p-0
                        [&>a]:flex
                        [&>a]:h-full
                        [&>a]:w-full
                        [&>a]:items-center
                        [&>a]:gap-3
                        [&>a]:whitespace-nowrap
                        group-data-[collapsible=icon]:[&>a]:justify-center
                      "
                    >
                      <Link to={item.to}>
                        <item.icon className="size-5 shrink-0" />

                        <span className="group-data-[collapsible=icon]:hidden">
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith('/app/settings')}
              tooltip="Settings"
              className="
                h-11 gap-3 px-3
                group-data-[collapsible=icon]:size-11
                group-data-[collapsible=icon]:justify-center
                group-data-[collapsible=icon]:p-0
                [&>a]:flex
                [&>a]:h-full
                [&>a]:w-full
                [&>a]:items-center
                [&>a]:gap-3
                [&>a]:whitespace-nowrap
                group-data-[collapsible=icon]:[&>a]:justify-center
              "
            >
              <Link to="/app/settings">
                <Settings className="size-5 shrink-0" />

                <span className="group-data-[collapsible=icon]:hidden">
                  Settings
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

