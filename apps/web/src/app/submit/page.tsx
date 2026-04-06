import { getSanityServerClient, safeSanityFetch } from '@/lib/sanity.client'
import { siteSettingsQuery } from '@/lib/queries'
import { DiamondDivider } from '@/components/DiamondDivider'

export const metadata = {
  title: 'Submit',
  description: 'Submit your creative work to Pulse Literary & Arts Magazine.',
}

type SiteSettings = {
  submissionWindowOpen?: string
  submissionWindowClose?: string
}

// Replace with your actual Google Form URL when ready
const GOOGLE_FORM_URL = '#'

export default async function SubmitPage() {
  const client = await getSanityServerClient()
  const settings = await safeSanityFetch<SiteSettings | null>(client, siteSettingsQuery, {}, null)

  const windowOpen = settings?.submissionWindowOpen ?? 'October 1st'
  const windowClose = settings?.submissionWindowClose ?? 'January 31st'

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      {/* Heading */}
      <div className="mb-10 text-center">
        <h1 className="font-display text-4xl tracking-tight text-ink sm:text-5xl">Submit</h1>
        <DiamondDivider className="mt-3" />
      </div>

      {/* Intro text */}
      <div className="space-y-4 text-sm leading-7 text-gray-600 sm:text-base sm:leading-8">
        <p>
          We&rsquo;re actively seeking works from creators enrolled at Point Park University. You must have a
          valid email address in the submission form.
        </p>
        <p>
          In the future, there may be opportunities for students and creators outside of the
          university to submit. Follow us for potential updates to our submission process!
        </p>
        <p>
          Pulse Literary &amp; Arts Magazine is proud to accept multimedia submissions through Google
          Forms from current Point Park University students.
        </p>
        <p>
          We publish visual art &amp; photography, dance videos, music (video or audio), poetry (text,
          video, or audio), and short stories &amp; scripts. In our selection process, we value
          submissions that draw meaning from our world and the intricacies of our human experience.
          We love to see creators use the boundaries of their art form to bring their passions,
          interpretations, experiences, and messages to life. We seek to uplift voices that have been
          systematically ignored in our society, and we do not discriminate against race, sex, gender
          identification, sexual orientation, national origin, native language, religion, age,
          disability, marital status, pregnancy, citizenship, etc.
        </p>
      </div>

      <hr className="my-10 border-black/10" />

      {/* Submission window */}
      <div className="flex justify-center">
        <div className="relative overflow-hidden rounded-xl border border-black/10 bg-white/80 px-12 py-9 text-center shadow-[0_8px_32px_-12px_rgba(158,114,114,0.25)]">
          {/* Decorative corner accents */}
          <span className="absolute left-3 top-3 text-[0.5rem] text-[var(--color-nav)] opacity-40">◆</span>
          <span className="absolute right-3 top-3 text-[0.5rem] text-[var(--color-nav)] opacity-40">◆</span>
          <span className="absolute bottom-3 left-3 text-[0.5rem] text-[var(--color-nav)] opacity-40">◆</span>
          <span className="absolute bottom-3 right-3 text-[0.5rem] text-[var(--color-nav)] opacity-40">◆</span>

          <p className="text-[0.6rem] uppercase tracking-[0.3em] text-[var(--color-nav)]">Open Annually</p>
          <p className="mt-2 font-display text-2xl leading-snug text-ink sm:text-3xl">
            Yearly Open<br />Submission Windows
          </p>
          <div className="mx-auto my-4 flex items-center justify-center gap-2 text-[var(--color-nav)] opacity-50">
            <span className="text-[0.4rem]">◆</span>
            <span className="text-[0.5rem]">◆</span>
            <span className="text-[0.4rem]">◆</span>
          </div>
          <p className="font-display text-lg text-gray-600 sm:text-xl">
            {windowOpen} &ndash; {windowClose}
          </p>
        </div>
      </div>

      <hr className="my-10 border-black/10" />

      {/* Instruction dropdowns */}
      <div className="space-y-4">
        {/* Art & Photography */}
        <details className="group rounded border border-black/10 bg-white/70">
          <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-sm font-medium text-ink transition-colors hover:bg-black/[0.02]">
            <span>Art &amp; Photography</span>
            <span className="text-[var(--color-nav)] transition-transform duration-200 group-open:rotate-180">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </span>
          </summary>
          <div className="border-t border-black/10 px-5 py-4">
            <p className="text-sm leading-7 text-gray-600">
              We accept visual art &amp; photography in JPG or PNG format. Please ensure your piece has a quality of at least 300 ppi, and please name your file the title of your piece. You may submit up to 5 pieces of art per cycle.
            </p>
            <p className="mt-3 text-xs text-gray-500">We only consider work submitted through our Google Form.</p>
          </div>
        </details>

        {/* Short Stories & Scripts */}
        <details className="group rounded border border-black/10 bg-white/70">
          <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-sm font-medium text-ink transition-colors hover:bg-black/[0.02]">
            <span>Short Stories &amp; Scripts</span>
            <span className="text-[var(--color-nav)] transition-transform duration-200 group-open:rotate-180">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </span>
          </summary>
          <div className="border-t border-black/10 px-5 py-4">
            <p className="text-sm leading-7 text-gray-600">
              We will consider up to three story or script submissions per creator per submission period. Each piece should not exceed 5,000 words. Please only submit PDFs to the form. If an editor would like to collaborate for developmental editing, we will reach out privately for a link to a Google Doc.
            </p>
          </div>
        </details>

        {/* Hybrid Submissions */}
        <details className="group rounded border border-black/10 bg-white/70">
          <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-sm font-medium text-ink transition-colors hover:bg-black/[0.02]">
            <span>Hybrid Submissions</span>
            <span className="text-[var(--color-nav)] transition-transform duration-200 group-open:rotate-180">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </span>
          </summary>
          <div className="border-t border-black/10 px-5 py-4">
            <p className="text-sm leading-7 text-gray-600">
              Music submissions can be video or audio format, and we encourage video submissions, if possible. Please do not let your content exceed five minutes. Videos should be 1080p with adequate lighting &amp; satisfactory audio quality. We consider all genres of music.
            </p>
            <p className="mt-3 text-sm leading-7 text-gray-600">
              Dance video submissions must not exceed five minutes in length, but your submission can be an excerpt from a larger piece. The submission can be a dancer or choreographer. Videos should be 1080p with adequate lighting &amp; satisfactory audio quality. These videos can be dance films or recorded stage work. We also consider all genres of dance.
            </p>
          </div>
        </details>

        {/* Disclosure Statement - Permanent and Prominent */}
        <div className="rounded border-2 border-[var(--color-nav)]/30 bg-[var(--color-nav)]/5">
          <div className="flex items-center gap-2 border-b border-[var(--color-nav)]/20 bg-[var(--color-nav)]/10 px-5 py-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-nav)]"><path d="M12 9v4"/><path d="M12 17h.01"/><circle cx="12" cy="12" r="10"/></svg>
            <span className="text-sm font-semibold text-ink">Disclosure Statement</span>
            <span className="ml-auto text-[0.6rem] uppercase tracking-wider text-[var(--color-nav)]">Required</span>
          </div>
          <div className="px-5 py-4">
            <p className="text-sm leading-7 text-gray-700">
              We reserve the right to edit short stories for grammar, mechanics, and clarity. We also reserve the right to edit video submissions for consistency with the magazine&apos;s style. Creators will not be compensated upon their acceptance. We do not consider previously published material. Works accepted in Pulse will be credited to their work in a byline and on our website. We claim First Serial Rights to the work, so the creator regains rights to resell their work after we have run the issue it is published in. Certain art forms hold exceptions to this form. Email pulsepulp@pointpark.edu with any questions regarding exceptions for your art form. We hold those accepted in Pulse as we do not consider if their piece will be self-published or published elsewhere in the future, after their piece in Pulse has run. <strong className="text-ink">By submitting your work, you agree that you have read and agree to this statement.</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
