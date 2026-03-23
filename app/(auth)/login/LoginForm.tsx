'use client'
import { useFormState, useFormStatus } from 'react-dom'
import Link from 'next/link'
import { loginAction } from '@/lib/auth/actions'
import { BriefcaseIcon } from '@/components/ui/BriefcaseIcon'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending}
      className="w-full h-10 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors">
      {pending ? 'Signing in…' : 'Sign in'}
    </button>
  )
}

export default function LoginForm() {
  const [state, action] = useFormState(loginAction, {})
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2.5 mb-8">
          <BriefcaseIcon />
          <span className="font-serif text-xl text-gray-900">Briefcase</span>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
          <h1 className="font-serif text-2xl text-gray-900 mb-1">Welcome back</h1>
          <p className="text-sm text-gray-500 mb-6 font-light">Access your portfolio reports</p>
          {state.error && (
            <div className="mb-4 px-3 py-2.5 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">{state.error}</div>
          )}
          <form action={action} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 tracking-wide mb-1.5">Work email</label>
              <input name="email" type="email" autoComplete="email" placeholder="jane@sequoia.com"
                className="w-full h-10 px-3 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:bg-white transition-colors" />
              {state.fieldErrors?.email && <p className="mt-1 text-xs text-red-500">{state.fieldErrors.email}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 tracking-wide mb-1.5">Password</label>
              <input name="password" type="password" autoComplete="current-password" placeholder="••••••••••"
                className="w-full h-10 px-3 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:bg-white transition-colors" />
              {state.fieldErrors?.password && <p className="mt-1 text-xs text-red-500">{state.fieldErrors.password}</p>}
            </div>
            <div className="text-right -mt-1">
              <Link href="/forgot-password" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Forgot password?</Link>
            </div>
            <SubmitButton />
          </form>
        </div>
        <p className="text-center text-sm text-gray-400 mt-5">
          No account?{' '}<Link href="/signup" className="text-gray-900 font-medium hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  )
}
