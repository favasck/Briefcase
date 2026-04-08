import { createServerClient } from '@/lib/supabase/server'
import { format } from 'date-fns'
import Link from 'next/link'

export default async function ReportsPage() {
  const supabase = await createServerClient()
  const { data: reports } = await supabase
    .from('reports')
    .select('id, title, type, status, created_at, portfolio_companies(name)')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-gray-900 mb-1">Reports</h1>
          <p className="text-sm text-gray-500">All investment reports across your portfolio.</p>
        </div>
        <Link href="/reports/new"
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New report
        </Link>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-gray-100 bg-gray-50">
          <div className="col-span-5 text-xs font-medium text-gray-400 uppercase tracking-wide">Report</div>
          <div className="col-span-2 text-xs font-medium text-gray-400 uppercase tracking-wide">Company</div>
          <div className="col-span-2 text-xs font-medium text-gray-400 uppercase tracking-wide">Type</div>
          <div className="col-span-2 text-xs font-medium text-gray-400 uppercase tracking-wide">Date</div>
          <div className="col-span-1 text-xs font-medium text-gray-400 uppercase tracking-wide">Status</div>
        </div>
        <div className="divide-y divide-gray-50">
          {reports && reports.length > 0 ? reports.map((report) => (
            <Link key={report.id} href={`/reports/${report.id}`}
              className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors items-center group">
              <div className="col-span-5">
                <p className="text-sm font-medium text-gray-900 group-hover:text-gray-700 truncate">{report.title}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500 truncate">{(report.portfolio_companies as any)?.name || '—'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500 capitalize">{report.type?.replace('_', ' ') || '—'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500">{format(new Date(report.created_at), 'MMM d, yyyy')}</p>
              </div>
              <div className="col-span-1">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  report.status === 'published' ? 'bg-green-50 text-green-600' :
                  report.status === 'draft' ? 'bg-gray-100 text-gray-500' : 'bg-amber-50 text-amber-600'
                }`}>{report.status}</span>
              </div>
            </Link>
          )) : (
            <div className="px-6 py-16 text-center">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-sm text-gray-500 mb-3">No reports yet</p>
              <Link href="/reports/new" className="text-sm font-medium text-gray-900 hover:underline">Create your first report →</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
