import type { Metadata } from 'next'
import Link from 'next/link'
import LegalPage from '@/components/layout/LegalPage'
import { SITE } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Terms of Use',
  description:
    'The terms governing use of the Wilderness Films India website, its content, and equipment listings.',
  alternates: { canonical: `${SITE}/terms` },
  robots: { index: true, follow: true },
}

export default function Terms() {
  return (
    <LegalPage title="Terms of Use" updated="17 July 2026">
      <p>
        These terms govern your use of this website, operated by <strong>Wilderness Films India Ltd.</strong> By
        using the site, you agree to them.
      </p>

      <h2>Equipment &amp; enquiries</h2>
      <p>
        Items on our <Link href="/equipment">Equipment</Link> pages are listed for information. Availability,
        condition, specifications and any prices are indicative, may change without notice, and do not constitute
        a binding offer. Please enquire to confirm current details.
      </p>

      <h2>Intellectual property</h2>
      <p>
        All footage, images and other content on this site are owned by or licensed to Wilderness Films India
        Ltd. and are protected by copyright. Our material may not be reproduced or used without a written licence
        from us.
      </p>

      <h2>External links &amp; availability</h2>
      <p>
        The site may link to external websites, for which we are not responsible. The site is provided
        &ldquo;as is&rdquo;; while we work to keep it accurate, we make no warranty that it is complete or
        error-free, and our liability is limited to the extent permitted by law.
      </p>

      <h2>Governing law</h2>
      <p>
        These terms are governed by the laws of India, and the courts of New Delhi have exclusive jurisdiction.
        Questions? Email <a href="mailto:rupindang@gmail.com">rupindang@gmail.com</a>.
      </p>
    </LegalPage>
  )
}
