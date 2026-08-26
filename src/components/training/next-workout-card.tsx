import {
  ArrowRight,
  CalendarDays,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

type ExercisePrescription = {
  weight: number
  reps: number
  sets?: number
  rating: number
}

type ExercisePreview = {
  name: string
  weightUnit?: 'lb' | 'kg'
  ratingUnit?: 'RPE' | 'RIR'
  topSet?: ExercisePrescription
  backdowns?: ExercisePrescription
}

export function NextWorkoutCard({
  title,
  block,
  day,
  exercises,
}: NextWorkoutCardProps) {
  return (
    <Card className="h-full shadow-none">
      <CardContent className="flex h-full flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
              Next workout
            </p>

            <h2 className="mt-2 text-lg font-medium tracking-tight">
              {title}
            </h2>
          </div>

          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <CalendarDays className="size-4" />
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
          <span>{block}</span>
          <span>·</span>
          <span>{day}</span>
        </div>

        <div className="mt-6 space-y-4">
          {exercises.map((exercise, index) => (
            <div
              key={exercise.name}
              className="flex gap-3"
            >
              <div className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" />

              <div className="min-w-0">
                <p className="text-sm font-medium">
                  {exercise.name}
                </p>

                {index === 0 && (exercise.topSet || exercise.backdowns) && (
                  <div className="mt-1.5 space-y-1 font-mono text-xs text-muted-foreground">
                    {exercise.topSet && (
                      <Prescription
                        prescription={exercise.topSet}
                        weightUnit={exercise.weightUnit}
                        ratingUnit={exercise.ratingUnit}
                      />
                    )}

                    {exercise.backdowns && (
                      <Prescription
                        prescription={exercise.backdowns}
                        weightUnit={exercise.weightUnit}
                        ratingUnit={exercise.ratingUnit}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <Button
          variant="outline"
          className="mt-auto w-full justify-between"
        >
          View workout
          <ArrowRight className="size-4" />
        </Button>
      </CardContent>
    </Card>
  )
}

function Prescription({
  prescription,
  weightUnit = 'lb',
  ratingUnit = 'RPE',
}: {
  prescription: ExercisePrescription
  weightUnit?: 'lb' | 'kg'
  ratingUnit?: 'RPE' | 'RIR'
}) {
  return (
    <p>
      {prescription.weight}{' '}
      <span className="text-muted-foreground">
        {weightUnit}
      </span>
      {' × '}
      {prescription.reps}

      {prescription.sets && (
        <> × {prescription.sets}</>
      )}

      {' · '}
      {ratingUnit} {prescription.rating}
    </p>
  )
}
