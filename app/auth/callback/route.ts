import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { data } = await supabase.auth.exchangeCodeForSession(code)
    
    // Check user's onboarding status
    if (data?.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_completed, onboarded')
        .eq('id', data.user.id)
        .single()
      
      // New user flow: onboarding questions -> welcome -> dashboard
      if (!profile?.onboarding_completed) {
        return NextResponse.redirect(`${requestUrl.origin}/onboarding`)
      }
      if (!profile?.onboarded) {
        return NextResponse.redirect(`${requestUrl.origin}/welcome`)
      }
    }
  }

  return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
}
