import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const VARIANTS = ['A', 'B', 'C'] as const
type Variant = (typeof VARIANTS)[number]

function randomVariant(): Variant {
  return VARIANTS[Math.floor(Math.random() * VARIANTS.length)]
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only assign the variant cookie on the landing page and assessment page
  if (pathname !== '/' && pathname !== '/assessment') {
    return NextResponse.next()
  }

  const existing = request.cookies.get('hero_variant')?.value
  const valid = existing && (VARIANTS as readonly string[]).includes(existing)

  if (valid) {
    // Already assigned — pass through unchanged
    return NextResponse.next()
  }

  // First visit: assign a random variant and persist it for 1 year
  const assigned: Variant = randomVariant()
  const response = NextResponse.next()
  response.cookies.set('hero_variant', assigned, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
    httpOnly: false,             // readable client-side so analytics can access it
    sameSite: 'lax',
  })
  return response
}

export const config = {
  matcher: ['/', '/assessment'],
}
