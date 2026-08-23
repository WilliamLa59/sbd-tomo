// src/routes/app.index.tsx

import { createFileRoute } from '@tanstack/react-router'

import { PageContainer } from '@/components/layout/page-container'

export const Route = createFileRoute('/app/')({
  component: DashboardPage,
})

function DashboardPage() {
  return (
    <PageContainer>
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
          Today
        </p>

        <h1 className="mt-2 text-2xl font-medium tracking-tight md:text-3xl">
          Good afternoon
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Week 3 · Day 2
        </p>
      </div>

      <div className="mt-8 rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
        Dashboard content goes here.
      </div>
    </PageContainer>
  )
}
