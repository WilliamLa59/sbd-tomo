// src/components/training/workout-hero-card.tsx

import { Check } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type WorkoutSet = {
  id: number
  weight: number
  reps: number
  rpe: number
  completed?: boolean
}

type WorkoutHeroCardProps = {
  exercise: string

  topSet: {
    weight: number
    reps: number
    rpe: number
    completed?: boolean
  }

  backdowns: WorkoutSet[]

  className?: string
}

export function WorkoutHeroCard({
  exercise,
  topSet,
  backdowns,
  className,
}: WorkoutHeroCardProps) {
  return (
    <Card className={cn('overflow-hidden shadow-none', className)}>
      <CardContent className="p-0">
        <div className="p-5 sm:p-6">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-brand">
            Current Exercise
          </p>

          <h2 className="mt-2 text-lg font-medium tracking-tight sm:text-xl">
            {exercise}
          </h2>

          <div className="mt-8">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
              Top Set
            </p>

            <div className="mt-3 flex items-end gap-3">
              <span className="font-mono text-5xl font-medium tracking-[-0.06em] sm:text-6xl">
                {topSet.weight}
              </span>

              <span className="mb-1 font-mono text-sm text-muted-foreground">
                LB
              </span>

              <span className="mb-1 ml-2 font-mono text-2xl tracking-[-0.04em] sm:ml-4 sm:text-3xl">
                × {topSet.reps}
              </span>

              <Badge
                variant="secondary"
                className="mb-1 ml-auto"
              >
                RPE {topSet.rpe}
              </Badge>
            </div>
          </div>

          <Button className="mt-6 w-full sm:w-auto">
            Continue Workout
          </Button>
        </div>

        <div className="border-t">
          <div className="px-5 py-3 sm:px-6">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
              Backdowns
            </p>
          </div>

          <div className="border-t">
            {backdowns.map((set, index) => (
              <SetRow
                key={set.id}
                index={index + 1}
                {...set}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
function SetRow({
  index,
  weight,
  reps,
  rpe,
  completed,
}: {
  index: number
  weight: number
  reps: number
  rpe: number
  completed?: boolean
}) {
  return (
    <div
      className="
        grid min-h-12 grid-cols-[2rem_1fr_auto_auto] items-center
        gap-3 border-b px-5 text-sm last:border-b-0
        sm:px-6
      "
    >
      <span className="font-mono text-xs text-muted-foreground">
        {index}
      </span>

      <span className="font-mono">
        {weight} lb
        <span className="mx-2 text-muted-foreground">
          ×
        </span>
        {reps}
      </span>

      <span className="font-mono text-xs text-muted-foreground">
        RPE {rpe}
      </span>

      <div className="flex size-5 items-center justify-center">
        {completed && (
          <Check className="size-4 text-success" />
        )}
      </div>
    </div>
  )
}
