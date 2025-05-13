import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function AuthForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSignup, setIsSignup] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAuth = async () => {
    setLoading(true)
    setError(null)

    const { error } = isSignup
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password })

    if (error) setError(error.message)

    setLoading(false)
  }

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 border rounded-lg space-y-4 bg-background shadow-lg">
      <h2 className="text-xl font-semibold text-center">
        {isSignup ? 'Create Account' : 'Login'}
      </h2>
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Button onClick={handleAuth} disabled={loading} className="w-full">
        {loading ? 'Loading...' : isSignup ? 'Sign Up' : 'Login'}
      </Button>
      <p
        className="text-center text-sm underline cursor-pointer"
        onClick={() => setIsSignup(!isSignup)}
      >
        {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
      </p>
    </div>
  )
}
