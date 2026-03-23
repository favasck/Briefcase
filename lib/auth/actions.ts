'use server'

import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { z } from 'zod'

export type AuthState = { error?: string; fieldErrors?: Record<string, string> }

export async function loginAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get('email') || '')
  const password = String(formData.get('password') || '')

  const parsed = z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(1, 'Required'),
  }).safeParse({ email, password })

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    parsed.error.errors.forEach((e) => { if (e.path[0]) fieldErrors[String(e.path[0])] = e.message })
    return { fieldErrors }
  }

  const supabase = createServerClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: 'Invalid email or password.' }
  redirect('/dashboard')
}

export async function signupAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const firstName = String(formData.get('firstName') || '')
  const lastName = String(formData.get('lastName') || '')
  const fullName = `${firstName} ${lastName}`.trim()
  const email = String(formData.get('email') || '')
  const password = String(formData.get('password') || '')
  const role = String(formData.get('role') || 'investor')
  const orgName = String(formData.get('orgName') || '')

  const parsed = z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(8, 'Min 8 characters'),
    fullName: z.string().min(2, 'Name required'),
    role: z.enum(['investor', 'company_admin']),
  }).safeParse({ email, password, fullName, role })

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    parsed.error.errors.forEach((e) => { if (e.path[0]) fieldErrors[String(e.path[0])] = e.message })
    return { fieldErrors }
  }

  const supabase = createServerClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName, role, org_name: orgName } },
  })

  if (error) {
    if (error.message.toLowerCase().includes('already')) return { error: 'Account already exists.' }
    return { error: error.message }
  }

  if (data.user) {
    await supabase.from('users').upsert(
      { id: data.user.id, email, full_name: fullName, role },
      { onConflict: 'id', ignoreDuplicates: true }
    )
  }

  redirect('/dashboard')
}

export async function logoutAction() {
  const supabase = createServerClient()
  await supabase.auth.signOut()
  redirect('/login')
}
