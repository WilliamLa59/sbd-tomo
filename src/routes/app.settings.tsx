// src/routes/app.training.tsx

import { createFileRoute } from '@tanstack/react-router'
import { PageContainer } from '@/components/layout/page-container'

export const Route = createFileRoute('/app/settings')({
  component: TrainingPage,
})

function TrainingPage() {
  return (
    <PageContainer>
      <h1 className="text-2xl font-medium tracking-tight">
        Settings
      </h1>
    </PageContainer>
  )
}
