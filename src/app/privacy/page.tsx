import type { Metadata } from 'next'
import LegalPage from '@/components/layout/LegalPage'
import { SITE } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How Wilderness Films India collects, uses and protects your information.',
  alternates: { canonical: `${SITE}/privacy` },
  robots: { index: true, follow: true },
}

export default function Privacy() {
  return (
    <LegalPage title="Privacy Policy" updated="17 July 2026">
      <p>
        <strong>Wilderness Films India Ltd.</strong> respects your privacy. We collect only what we need, and we
        never sell your personal information.
      </p>

      <h2>Information we collect</h2>
      <p>
        When you contact us or submit an enquiry, we collect the details you provide — your name, email address
        and message — so we can respond. We also collect aggregated, non-identifying data about how the site is
        used, which helps us improve it.
      </p>

      <h2>How we use it</h2>
      <p>
        We use your information solely to respond to your enquiries, provide the services you ask about, and
        keep the site secure and working well. We do not use it for advertising.
      </p>

      <h2>Sharing</h2>
      <p>
        We do not sell or rent your information. Some pages link to external websites, which operate under their
        own privacy policies.
      </p>

      <h2>Your rights</h2>
      <p>
        You may ask us to access, correct or delete the personal information you have shared with us. Email
        {' '}<a href="mailto:rupindang@gmail.com">rupindang@gmail.com</a> and we will respond.
      </p>

      <h2>Contact</h2>
      <p>
        Wilderness Films India Ltd., 1 Factory Road, Ring Road South, New Delhi 110029, India —
        {' '}<a href="mailto:rupindang@gmail.com">rupindang@gmail.com</a>.
      </p>
    </LegalPage>
  )
}
