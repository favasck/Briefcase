'use client'
import { useState } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import Link from 'next/link'
import { signupAction } from '@/lib/auth/actions'
import { BriefcaseIcon } from '@/components/ui/BriefcaseIcon'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending}
      className="w-full h-10 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors">
      {pending ? 'Creating account…' : 'Create account'}
    </button>
  )
}

export default function SignupForm() {
  const [state, action] = useFormState(signupAction, {})
  const [role, setRole] = useState<'investor' | 'company_admin'>('investor')
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2.5 mb-8">
          <BriefcaseIcon />
          <span className="font-serif text-xl text-gray-900">Briefcase</span>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
          <h1 className="font-serif text-2xl text-gray-900 mb-1">Create your account</h1>
          <p className="text-sm text-gray-500 mb-6 font-light">Join as a company or investor</p>
          {state.error && (
            <div className="mb-4 px-3 py-2.5 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">{state.error}</div>
          )}
          <form action={action} className="space-y-4">
            <div>
              <p className="text-xs font-medium text-gray-500 tracking-wide mb-2">I am a</p>
              <div className="grid grid-cols-2 gap-2">
                {([{ value: 'investor', label: 'Investor', desc: 'VC / PE firm member' }, { value: 'company_admin', label: 'Company', desc: 'Portfolio company team' }] as const).map((opt) => (
                  <button key={opt.value} type="button" onClick={() => setRole(opt.value)}
                    className={`text-left px-3 py-2.5 rounded-lg border transition-all ${role === opt.value ? 'border-gray-400 bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className="text-sm font-medium text-gray-900">{opt.label}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{opt.desc}</div>
                  </button>
                ))}
              </div>
              <input type="hidden" name="role" value={role} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 tracking-wide mb-1.5">First name</label>
                <input name="firstName" type="text" autoComplete="given-name" placeholder="Jane"
                  className="w-full h-10 px-3 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:bg-white transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 tracking-wide mb-1.5">Last name</label>
                <input name="lastName" type="text" autoComplete="family-name" placeholder="Smith"
                  className="w-full h-10 px-3 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:bg-white transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 tracking-wide mb-1.5">Work email</label>
              <input name="email" type="email" autoComplete="email" placeholder="jane@sequoia.com"
                className="w-full h-10 px-3 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:bg-white transition-colors" />
              {state.fieldErrors?.email && <p className="mt-1 text-xs text-red-500">{state.fieldErrors.email}</p>}
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-medium text-gray-500 tracking-wide">{role === 'investor' ? 'Firm name' : 'Company name'}</label>
                <span className="text-xs text-gray-400">optional</span>
              </div>
              <input name="orgName" type="text" placeholder={role === 'investor' ? 'Sequoia Capital' : 'Acme Inc'}
                className="w-full h-10 px-3 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:bg-white transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 tracking-wide mb-1.5">Password</label>
              <input name="password" type="password" autoComplete="new-password" placeholder="Min. 8 characters"
                className="w-full h-10 px-3 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:bg-white transition-colors" />
              {state.fieldErrors?.password && <p className="mt-1 text-xs text-red-500">{state.fieldErrors.password}</p>}
            </div>
            <p className="text-xs text-gray-400 text-center">
              By signing up you agree to our <Link href="/terms" className="text-gray-500 hover:underline">Terms</Link> and <Link href="/privacy" className="text-gray-500 hover:underline">Privacy Policy</Link>
            </p>
            <SubmitButton />
          </form>
        </div>
        <p className="text-center text-sm text-gray-400 mt-5">
          Already have an account?{' '}<Link href="/login" className="text-gray-900 font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
