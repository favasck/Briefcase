import { createServerClient } from '@/lib/supabase/server'
import { format } from 'date-fns'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase.from('users').select('full_name, role').eq('id', user!.id).single()
  const { data: reports } = await supabase.from('reports').select('id, title, type, status, created_at, portfolio_companies(name)').order('created_at', { ascending: false }).limit(5)
  const { data: companies } = await supabase.from('portfolio_companies').select('id, name, industry').limit(6)

  const greeting = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 17 ? 'Good afternoon' : 'Good evening'
  const firstName = profile?.full_name?.split(' ')[0] || 'there'

  return (
    <div className="p-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-gray-900 mb-1">{greeting}, {firstName}</h1>
        <p className="text-gray-500 text-sm">Here&apos;s what&apos;s happening across your portfolio.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total reports', value: reports?.length ?? 0, sub: 'across all companies' },
          { label: 'Portfolio companies', value: companies?.length ?? 0, sub: 'active investments' },
          { label: 'Pending review', value: reports?.filter(r => r.status === 'draft').length ?? 0, sub: 'awaiting publication' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
            <p className="text-xs font-medium text-gray-400 tracking-wide uppercase mb-2">{stat.label}</p>
            <p className="font-serif text-3xl text-gray-900 mb-1">{stat.value}</p>
            <p className="text-xs text-gray-400">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Recent Reports */}
        <div className="col-span-2 bg-white border border-gray-100 rounded-xl shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-medium text-gray-900 text-sm">Recent reports</h2>
            <Link href="/reports" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">View all →</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {reports && reports.length > 0 ? reports.map((report) => (
              <Link key={report.id} href={`/reports/${report.id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors group">
                <div>
                  <p className="text-sm font-medium text-gray-900 group-hover:text-gray-700">{report.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {(report.portfolio_companies as any)?.name} · {format(new Date(report.created_at), 'MMM d, yyyy')}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  report.status === 'published' ? 'bg-green-50 text-green-600' :
                  report.status === 'draft' ? 'bg-gray-100 text-gray-500' : 'bg-amber-50 text-amber-600'
                }`}>
                  {report.status}
                </span>
              </Link>
            )) : (
              <div className="px-6 py-10 text-center">
                <p className="text-sm text-gray-400">No reports yet.</p>
                <Link href="/reports/new" className="text-sm text-gray-900 font-medium hover:underline mt-1 inline-block">Create your first report →</Link>
              </div>
            )}
          </div>
        </div>

        {/* Companies */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-medium text-gray-900 text-sm">Companies</h2>
            <Link href="/companies" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">View all →</Link>
          </div>
          <div className="p-3 space-y-1">
            {companies && companies.length > 0 ? companies.map((co) => (
              <Link key={co.id} href={`/companies/${co.id}`}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors group">
                <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-600 flex-shrink-0">
                  {co.name[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{co.name}</p>
                  <p className="text-xs text-gray-400">{co.industry || 'Technology'}</p>
                </div>
              </Link>
            )) : (
              <div className="px-3 py-8 text-center">
                <p className="text-sm text-gray-400">No companies yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
