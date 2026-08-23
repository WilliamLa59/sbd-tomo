import { createFileRoute, Link } from '@tanstack/react-router'

import { authClient } from '@/lib/auth-client'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return <main>Loading...</main>
  }

  return (
    <main>
      <h1>SBD Tomo</h1>

      {session ? (
        <>
          <p>Logged in</p>

          <p>Name: {session.user.name}</p>
          <p>Email: {session.user.email}</p>

          <button onClick={() => authClient.signOut()}>
            Log out
          </button>
        </>
      ) : (
        <>
          <p>Not logged in</p>

          <Link to="/login">Log in</Link>
          {' | '}
          <Link to="/signup">Sign up</Link>
        </>
      )}
    </main>
  )
}
