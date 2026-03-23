'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { BriefcaseIcon } from '@/components/ui/BriefcaseIcon'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
    })
    setLoading(false)
    if (error) setError(error.message)
    else setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2.5 mb-8">
          <BriefcaseIcon />
          <span className="font-serif text-xl text-gray-900">Briefcase</span>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
          {submitted ? (
            <div className="text-center">
              <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="font-serif text-xl text-gray-900 mb-2">Check your email</h2>
              <p className="text-sm text-gray-500">We sent a reset link to <strong className="font-medium text-gray-700">{email}</strong></p>
            </div>
          ) : (
            <>
              <h1 className="font-serif text-2xl text-gray-900 mb-1">Reset password</h1>
              <p className="text-sm text-gray-500 mb-6 font-light">We&apos;ll send a reset link to your email</p>
              {error && <div className="mb-4 px-3 py-2.5 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">{error}</div>}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 tracking-wide mb-1.5">Work email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="jane@sequoia.com"
                    className="w-full h-10 px-3 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:bg-white transition-colors" />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full h-10 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors">
                  {loading ? 'Sending…' : 'Send reset link'}
                </button>
              </form>
            </>
          )}
        </div>
        <p className="text-center text-sm text-gray-400 mt-5">
          <Link href="/login" className="text-gray-900 font-medium hover:underline">Back to sign in</Link>
        </p>
      </div>
    </div>
  )
}
