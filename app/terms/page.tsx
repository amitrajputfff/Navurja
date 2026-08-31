import type { Metadata } from "next";
import { StubPage } from "@/components/stub-page";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern use of NavUrja's services.",
};

export default function TermsPage() {
  return (
    <StubPage
      eyebrow="Legal · Draft"
      title="Terms of Service"
      breadcrumbs={[{ label: "Terms of Service" }]}
    >
      <p className="mb-4 rounded-lg border border-nav-oil-gold/40 bg-nav-mint px-4 py-3 text-sm text-nav-dark-text">
        This is placeholder text and has not been reviewed by legal counsel.
        Replace it with NavUrja&apos;s finalized terms before launch.
      </p>
      <p className="mb-8 text-sm">Last updated: 31 August 2026</p>

      <div className="space-y-8">
        <div>
          <h2 className="text-base font-semibold text-nav-dark-text">
            1. Acceptance of Terms
          </h2>
          <p className="mt-2">
            By using NavUrja&apos;s website or requesting a used cooking oil
            pickup, you agree to these terms. If you do not agree, please
            do not use our services.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-nav-dark-text">
            2. Eligibility &amp; Accurate Information
          </h2>
          <p className="mt-2">
            By requesting a pickup through NavUrja, you confirm the
            information you provide is accurate and that you are authorized
            to arrange collection on behalf of your business.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-nav-dark-text">
            3. Pickup Scheduling &amp; Cancellation
          </h2>
          <p className="mt-2">
            Pickup requests are confirmed subject to service availability
            in your area. NavUrja will contact you to confirm the final
            pickup date and time, and may reschedule where operationally
            necessary. You may cancel or reschedule a pending request by
            contacting us before the confirmed pickup window.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-nav-dark-text">
            4. Pricing &amp; Payment
          </h2>
          <p className="mt-2">
            Rates paid for collected used cooking oil are quoted per
            kilogram and may vary by location, business type, and oil
            quality, as reflected in the rate applicable to your account at
            the time of collection. Payment is made through the method
            agreed at onboarding.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-nav-dark-text">
            5. Responsible Disposal &amp; Compliance Documentation
          </h2>
          <p className="mt-2">
            Used cooking oil collected by NavUrja is handled through a
            responsible recycling process. NavUrja may issue documentation
            confirming collection for your business&apos;s compliance
            records, including in connection with applicable used cooking
            oil disposal regulations.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-nav-dark-text">
            6. Your Responsibilities
          </h2>
          <p className="mt-2">
            You agree to store used cooking oil safely between pickups,
            provide reasonable access for collection, and not misrepresent
            the volume, source, or condition of oil presented for
            collection.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-nav-dark-text">
            7. Limitation of Liability
          </h2>
          <p className="mt-2">
            NavUrja&apos;s services are provided on an &ldquo;as
            available&rdquo; basis. To the extent permitted by law, NavUrja
            is not liable for indirect or consequential losses arising from
            use of our services, including delays in scheduled pickups.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-nav-dark-text">
            8. Changes to These Terms
          </h2>
          <p className="mt-2">
            We may update these terms from time to time. Continued use of
            our services after changes take effect constitutes acceptance
            of the updated terms.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-nav-dark-text">
            9. Contact
          </h2>
          <p className="mt-2">
            Questions about these terms can be sent to{" "}
            <a href="mailto:hello@navurja.com" className="text-nav-primary underline">
              hello@navurja.com
            </a>
            .
          </p>
        </div>
      </div>
    </StubPage>
  );
}
