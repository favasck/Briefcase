import { createServerClient } from '@/lib/supabase/server'

export default async function SettingsPage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('users').select('*').eq('id', user!.id).single()

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-gray-900 mb-1">Settings</h1>
        <p className="text-sm text-gray-500">Manage your account and preferences.</p>
      </div>
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm divide-y divide-gray-100">
        <div className="p-6">
          <h2 className="text-sm font-medium text-gray-900 mb-4">Profile</h2>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-xl font-semibold text-gray-600">
              {profile?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-gray-900">{profile?.full_name || 'No name set'}</p>
              <p className="text-sm text-gray-500">{profile?.email}</p>
              <p className="text-xs text-gray-400 capitalize mt-0.5">{profile?.role?.replace('_', ' ')}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Full name</label>
              <input defaultValue={profile?.full_name || ''} className="w-full h-10 px-3 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Email</label>
              <input defaultValue={profile?.email || ''} disabled className="w-full h-10 px-3 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-400 cursor-not-allowed" />
            </div>
          </div>
          <button className="mt-4 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
            Save changes
          </button>
        </div>
      </div>
    </div>
  )
}
