// src/routes/app.index.tsx

import { createFileRoute } from '@tanstack/react-router'
import {
  Activity,
  Gauge,
  TrendingUp,
} from 'lucide-react'

import { MetricCard } from '@/components/analytics/metric-card'
import { PageContainer } from '@/components/layout/page-container'
import { WorkoutHeroCard } from '@/components/training/workout-hero-card'
import { Card, CardContent } from '@/components/ui/card'
import { VolumeChartCard } from '@/components/analytics/volume-chart-card'
import { NextWorkoutCard } from '@/components/training/next-workout-card'

export const Route = createFileRoute('/app/')({
  component: DashboardPage,
})

const backdowns = [
  {
    id: 1,
    weight: 365,
    reps: 5,
    rpe: 6,
    completed: true,
  },
  {
    id: 2,
    weight: 365,
    reps: 5,
    rpe: 7,
    completed: true,
  },
  {
    id: 3,
    weight: 365,
    reps: 5,
    rpe: 7,
    completed: false,
  },
]

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

      <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1.8fr)_minmax(260px,0.8fr)]">
        <WorkoutHeroCard
          exercise="Competition Squat"
          topSet={{
            weight: 405,
            reps: 3,
            rpe: 7,
            completed: true,
          }}
          backdowns={backdowns}
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <MetricCard
            label="Estimated 1RM"
            value="447"
            unit="LB"
            change={2.7}
            detail="from last week"
            icon={<TrendingUp className="size-4" />}
          />

          <MetricCard
            label="Training Volume"
            value="12,840"
            unit="LB"
            change={8.2}
            detail="from last week"
            icon={<Activity className="size-4" />}
          />
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.8fr)_minmax(260px,0.8fr)]">
        <VolumeChartCard />

        <NextWorkoutCard
          title="Bench Press Focus"
          block="Week 3"
          day="Day 3"
          exercises={[
            {
              name: 'Competition Bench',
              weightUnit: 'lb',
              ratingUnit: 'RPE',
              topSet: {
                weight: 275,
                reps: 3,
                rating: 7,
              },
              backdowns: {
                weight: 255,
                sets: 3,
                reps: 5,
                rating: 6,
              },
            },
            {
              name: 'Paused Bench',
            },
            {
              name: 'Accessories',
            },
          ]}
        />
      </div>

      <Card className="mt-4 shadow-none">
        <CardContent className="p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                Volume over time
              </p>

              <h2 className="mt-2 text-base font-medium tracking-tight">
                Last 30 days
              </h2>
            </div>
          </div>

          <div className="mt-6 flex h-56 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
            Chart goes here
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  )
}
