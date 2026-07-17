import type { Metadata } from 'next'
import Link from 'next/link'
import LegalPage from '@/components/layout/LegalPage'
import { SITE } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description:
    'How Wilderness Films India uses cookies. We do not use advertising or cross-site tracking cookies.',
  alternates: { canonical: `${SITE}/cookies` },
  robots: { index: true, follow: true },
}

export default function Cookies() {
  return (
    <LegalPage title="Cookie Policy" updated="17 July 2026">
      <p>
        This site uses only what is necessary to function and to understand, in aggregate, how it is used.
        <strong> We do not use advertising or cross-site tracking cookies, and we do not sell your data.</strong>
      </p>

      <h2>Third-party content</h2>
      <p>
        Some pages link to or embed external services, which may set their own cookies under their own policies.
      </p>

      <h2>Controlling cookies</h2>
      <p>
        You can block or delete cookies at any time through your browser settings. For more on how we handle
        personal information, see our <Link href="/privacy">Privacy Policy</Link>, or email
        {' '}<a href="mailto:rupindang@gmail.com">rupindang@gmail.com</a>.
      </p>
    </LegalPage>
  )
}
