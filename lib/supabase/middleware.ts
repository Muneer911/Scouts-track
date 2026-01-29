import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/onboarding', '/welcome']
  const isProtectedRoute = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))

  // If accessing protected route without auth, redirect to login
  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If user is authenticated, check onboarding status
  if (user && (request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/welcome') || request.nextUrl.pathname.startsWith('/onboarding'))) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('onboarding_completed, onboarded')
      .eq('profile_uuid', user.id)
      .single()

    // If user is fully onboarded, redirect to dashboard from onboarding/welcome pages
    if (profile?.onboarded) {
      if (request.nextUrl.pathname.startsWith('/onboarding') || request.nextUrl.pathname.startsWith('/welcome')) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    } else {
      // User is not fully onboarded
      // If accessing dashboard but not fully onboarded, redirect appropriately
      if (request.nextUrl.pathname.startsWith('/dashboard')) {
        if (!profile?.onboarding_completed) {
          return NextResponse.redirect(new URL('/onboarding', request.url))
        }
        if (!profile?.onboarded) {
          return NextResponse.redirect(new URL('/welcome', request.url))
        }
      }
      
      // If accessing welcome but haven't completed onboarding questions, redirect to onboarding
      if (request.nextUrl.pathname.startsWith('/welcome') && !profile?.onboarding_completed) {
        return NextResponse.redirect(new URL('/onboarding', request.url))
      }
    }
  }

  return response
}
