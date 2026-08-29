import type { Metadata } from "next";
import { StubPage } from "@/components/stub-page";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern use of NavUrja's services.",
};

export default function TermsPage() {
  return (
    <StubPage eyebrow="Legal · Draft" title="Terms of Service">
      <p className="mb-4 rounded-lg border border-nav-oil-gold/40 bg-nav-mint px-4 py-3 text-sm text-nav-dark-text">
        This is placeholder text and has not been reviewed by legal counsel.
        Replace it with NavUrja&apos;s finalized terms before launch.
      </p>
      <div className="space-y-6">
        <div>
          <h2 className="text-base font-semibold text-nav-dark-text">
            1. Using Our Service
          </h2>
          <p className="mt-2">
            By requesting a used cooking oil pickup through NavUrja, you
            confirm the information you provide is accurate and that you are
            authorized to arrange collection on behalf of your business.
          </p>
        </div>
        <div>
          <h2 className="text-base font-semibold text-nav-dark-text">
            2. Pickup Scheduling
          </h2>
          <p className="mt-2">
            Pickup requests are confirmed subject to service availability in
            your area. NavUrja will contact you to confirm the final pickup
            date and time.
          </p>
        </div>
        <div>
          <h2 className="text-base font-semibold text-nav-dark-text">
            3. Responsible Disposal
          </h2>
          <p className="mt-2">
            Used cooking oil collected by NavUrja is handled through a
            responsible recycling process. NavUrja may issue documentation
            confirming collection for your business&apos;s compliance
            records.
          </p>
        </div>
        <div>
          <h2 className="text-base font-semibold text-nav-dark-text">
            4. Changes to These Terms
          </h2>
          <p className="mt-2">
            We may update these terms from time to time. Continued use of our
            services after changes take effect constitutes acceptance of the
            updated terms.
          </p>
        </div>
      </div>
    </StubPage>
  );
}
