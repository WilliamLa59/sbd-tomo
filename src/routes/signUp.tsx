import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

import { authClient } from '@/lib/auth-client'

export const Route = createFileRoute('/signUp')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setError(null)
    setIsLoading(true)

    const { error } = await authClient.signUp.email({
      name,
      email,
      password,
    })

    setIsLoading(false)

    if (error) {
      setError(error.message ?? 'Unable to create account')
      return
    }

    navigate({
      to: '/',
    })
  }

  return (
    <main>
      <h1>Create account</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={8}
            required
          />
        </div>

        {error && <p>{error}</p>}

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating account...' : 'Sign up'}
        </button>
      </form>
    </main>
  )
}
