import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { Card, CardContent } from '@/components/ui/card'

const data = [
  { date: 'May 6', volume: 9200 },
  { date: 'May 9', volume: 10100 },
  { date: 'May 13', volume: 9800 },
  { date: 'May 17', volume: 11200 },
  { date: 'May 21', volume: 10850 },
  { date: 'May 25', volume: 12100 },
  { date: 'May 29', volume: 11800 },
  { date: 'Jun 3', volume: 12840 },
]

export function VolumeChartCard() {
  return (
    <Card className="shadow-none">
      <CardContent className="p-5 sm:p-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Volume over time
          </p>

          <h2 className="mt-2 text-base font-medium tracking-tight">
            Last 30 days
          </h2>
        </div>

        <div className="mt-6 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 8,
                right: 8,
                bottom: 0,
                left: -16,
              }}
            >
              <CartesianGrid
                vertical={false}
                stroke="var(--border)"
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: 'var(--muted-foreground)',
                  fontSize: 11,
                }}
                tickMargin={10}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: 'var(--muted-foreground)',
                  fontSize: 11,
                }}
                tickFormatter={(value: number) =>
                  `${Math.round(value / 1000)}k`
                }
              />

              <Tooltip content={<VolumeTooltip />} />

              <Line
                type="monotone"
                dataKey="volume"
                stroke="var(--brand)"
                strokeWidth={2}
                dot={false}
                activeDot={{
                  r: 4,
                  fill: 'var(--brand)',
                  stroke: 'var(--background)',
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

function VolumeTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{
    value?: number | string
  }>
  label?: string
}) {
  if (!active || !payload?.length) {
    return null
  }

  const value = Number(payload[0].value ?? 0)

  return (
    <div className="rounded-lg border bg-popover px-3 py-2 shadow-sm">
      <p className="text-xs text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 font-mono text-sm font-medium text-popover-foreground">
        {value.toLocaleString()} LB
      </p>
    </div>
  )
}
