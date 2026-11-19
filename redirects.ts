import type { NextConfig } from 'next'

export const redirects: NextConfig['redirects'] = async () => {
  const internetExplorerRedirect = {
    destination: '/ie-incompatible.html',
    has: [
      {
        type: 'header' as const,
        key: 'user-agent',
        value: '(.*Trident.*)', // all ie browsers
      },
    ],
    permanent: false,
    source: '/:path((?!ie-incompatible.html$).*)', // all pages except the incompatibility page
  }

  // Passwordless auth: the first sign-in creates the account and there is no
  // password to reset, so the legacy routes forward to the sign-in page.
  const legacyAuthRedirects = ['/create-account', '/forgot-password', '/reset-password'].map(
    (source) => ({ destination: '/login', permanent: true, source }),
  )

  return [internetExplorerRedirect, ...legacyAuthRedirects]
}
