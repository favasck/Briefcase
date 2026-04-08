import { createServerClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function CompaniesPage() {
  const supabase = await createServerClient()
  const { data: companies } = await supabase
    .from('portfolio_companies')
    .select('id, name, industry, website, description, created_at')
    .order('name')

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-gray-900 mb-1">Companies</h1>
        <p className="text-sm text-gray-500">Portfolio companies in your network.</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {companies && companies.length > 0 ? companies.map((co) => (
          <Link key={co.id} href={`/companies/${co.id}`}
            className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-gray-200 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-base font-semibold text-gray-600 mb-4">
              {co.name[0]}
            </div>
            <h3 className="font-medium text-gray-900 mb-1 group-hover:text-gray-700">{co.name}</h3>
            <p className="text-xs text-gray-400 mb-2">{co.industry || 'Technology'}</p>
            {co.description && <p className="text-xs text-gray-500 line-clamp-2">{co.description}</p>}
          </Link>
        )) : (
          <div className="col-span-3 bg-white border border-gray-100 rounded-xl p-16 text-center shadow-sm">
            <p className="text-sm text-gray-400">No companies yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
