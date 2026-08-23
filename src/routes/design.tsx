import { createFileRoute, Link } from '@tanstack/react-router'
import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { authClient } from '@/lib/auth-client'

export const Route = createFileRoute('/design')({
  component: HomePage,
})

function HomePage() {
  const { data: session, isPending } = authClient.useSession()
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'))
  }, [])

  function toggleTheme() {
    const next = !isDark

    document.documentElement.classList.toggle('dark', next)
    setIsDark(next)
  }

  if (isPending) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-6xl px-5 py-8 md:px-8 md:py-12">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
              Design System
            </p>

            <h1 className="mt-1 text-2xl font-medium tracking-tight md:text-3xl">
              SBD Tomo
            </h1>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun /> : <Moon />}
          </Button>
        </header>

        <Separator className="my-8 md:my-10" />

        <div className="space-y-12">
          <section>
            <SectionHeading
              eyebrow="Foundation"
              title="Typography"
              description="The basic hierarchy we'll use throughout the product."
            />

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <Card className="shadow-none">
                <CardContent className="space-y-8 p-6">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                      Today
                    </p>

                    <h2 className="mt-2 text-3xl font-medium tracking-tight">
                      Good afternoon
                    </h2>

                    <p className="mt-2 text-sm text-muted-foreground">
                      Week 3 · Day 2
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium">
                      Competition Squat
                    </p>

                    <div className="mt-3 flex items-end gap-3">
                      <span className="font-mono text-5xl font-medium tracking-[-0.05em]">
                        405
                      </span>

                      <span className="mb-1 font-mono text-sm text-muted-foreground">
                        LB
                      </span>

                      <span className="mb-1 ml-3 font-mono text-xl">
                        × 3
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">RPE 7</Badge>
                    <span className="text-sm text-muted-foreground">
                      Last set
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-none">
                <CardContent className="p-6">
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                    Estimated 1RM
                  </p>

                  <div className="mt-5 flex items-end gap-3">
                    <span className="font-mono text-5xl font-medium tracking-[-0.05em]">
                      447
                    </span>

                    <span className="mb-1 font-mono text-sm text-muted-foreground">
                      LB
                    </span>
                  </div>

                  <p className="mt-3 font-mono text-sm text-success">
                    +2.7%
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <SectionHeading
              eyebrow="Tokens"
              title="Color system"
              description="Semantic colors rather than colors tied directly to components."
            />

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
              <ColorToken
                label="Background"
                className="bg-background"
              />

              <ColorToken
                label="Card"
                className="bg-card"
              />

              <ColorToken
                label="Muted"
                className="bg-muted"
              />

              <ColorToken
                label="Brand"
                className="bg-brand"
              />

              <ColorToken
                label="Success"
                className="bg-success"
              />

              <ColorToken
                label="Warning"
                className="bg-warning"
              />

              <ColorToken
                label="PR"
                className="bg-pr"
              />
            </div>
          </section>

          <section>
            <SectionHeading
              eyebrow="Components"
              title="Buttons"
              description="Keep actions quiet unless they are genuinely important."
            />

            <div className="mt-6 flex flex-wrap gap-3">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
            </div>
          </section>

          <section>
            <SectionHeading
              eyebrow="Training"
              title="Metric cards"
              description="Large numeric information should be one of the strongest elements in the interface."
            />

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <MetricCard
                label="Estimated 1RM"
                value="447"
                unit="LB"
                detail="+2.7%"
              />

              <MetricCard
                label="Training Volume"
                value="12.8K"
                unit="LB"
                detail="+8.2%"
              />

              <MetricCard
                label="Session RPE"
                value="7.2"
                detail="Moderate"
              />
            </div>
          </section>

          <section>
            <SectionHeading
              eyebrow="Account"
              title="Auth status"
              description="Temporary while we're building out the authenticated application shell."
            />

            <Card className="mt-6 shadow-none">
              <CardContent className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
                {session ? (
                  <>
                    <div>
                      <p className="font-medium">{session.user.name}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {session.user.email}
                      </p>
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => authClient.signOut()}
                    >
                      Log out
                    </Button>
                  </>
                ) : (
                  <>
                    <div>
                      <p className="font-medium">Not logged in</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Authentication is ready for testing.
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" asChild>
                        <Link to="/login">Log in</Link>
                      </Button>

                      <Button asChild>
                        <Link to="/signup">Sign up</Link>
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </main>
  )
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
        {eyebrow}
      </p>

      <h2 className="mt-2 text-xl font-medium tracking-tight md:text-2xl">
        {title}
      </h2>

      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  )
}

function ColorToken({
  label,
  className,
}: {
  label: string
  className: string
}) {
  return (
    <div>
      <div
        className={`aspect-[4/3] rounded-lg border ${className}`}
      />

      <p className="mt-2 text-xs text-muted-foreground">
        {label}
      </p>
    </div>
  )
}

function MetricCard({
  label,
  value,
  unit,
  detail,
}: {
  label: string
  value: string
  unit?: string
  detail?: string
}) {
  return (
    <Card className="shadow-none">
      <CardHeader className="pb-0">
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
          {label}
        </p>
      </CardHeader>

      <CardContent className="pt-5">
        <div className="flex items-end gap-2">
          <span className="font-mono text-4xl font-medium tracking-[-0.05em]">
            {value}
          </span>

          {unit && (
            <span className="mb-1 font-mono text-xs text-muted-foreground">
              {unit}
            </span>
          )}
        </div>

        {detail && (
          <p className="mt-3 font-mono text-xs text-muted-foreground">
            {detail}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
