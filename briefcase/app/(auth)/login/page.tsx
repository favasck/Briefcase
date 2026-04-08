import { Metadata } from 'next'
import LoginForm from './LoginForm'
export const metadata: Metadata = { title: 'Sign in — Briefcase' }
export default function LoginPage() { return <LoginForm /> }
