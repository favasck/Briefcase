import { createServerClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function InvestorsPage() {
  const supabase = await createServerClient()
  const { data: firms } = await supabase
    .from('investment_firms')
    .select('id, name, website, description, created_at')
    .order('name')

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-gray-900 mb-1">Investors</h1>
        <p className="text-sm text-gray-500">Investment firms and their portfolios.</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {firms && firms.length > 0 ? firms.map((firm) => (
          <Link key={firm.id} href={`/investors/${firm.id}`}
            className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-gray-200 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center text-base font-semibold text-white mb-4">
              {firm.name[0]}
            </div>
            <h3 className="font-medium text-gray-900 mb-1">{firm.name}</h3>
            {firm.website && <p className="text-xs text-gray-400 mb-2">{firm.website}</p>}
            {firm.description && <p className="text-xs text-gray-500 line-clamp-2">{firm.description}</p>}
          </Link>
        )) : (
          <div className="col-span-3 bg-white border border-gray-100 rounded-xl p-16 text-center shadow-sm">
            <p className="text-sm text-gray-400">No investment firms yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
