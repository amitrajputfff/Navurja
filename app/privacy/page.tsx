import type { Metadata } from "next";
import { StubPage } from "@/components/stub-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How NavUrja collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <StubPage
      eyebrow="Legal · Draft"
      title="Privacy Policy"
      breadcrumbs={[{ label: "Privacy Policy" }]}
    >
      <p className="mb-4 rounded-lg border border-nav-oil-gold/40 bg-nav-mint px-4 py-3 text-sm text-nav-dark-text">
        This is placeholder text and has not been reviewed by legal counsel.
        Replace it with NavUrja&apos;s finalized privacy policy before launch.
      </p>
      <p className="mb-8 text-sm">Last updated: 31 August 2026</p>

      <div className="space-y-8">
        <div>
          <h2 className="text-base font-semibold text-nav-dark-text">
            1. Information We Collect
          </h2>
          <p className="mt-2">
            When you request a pickup, subscribe to our newsletter, create an
            account, or otherwise contact us, we may collect information
            such as your name, business name, business type, phone number,
            email address, pickup address, and details about the used
            cooking oil you generate. If you interact with our website, we
            may also automatically collect limited technical information
            such as your browser type, device information, and pages
            visited.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-nav-dark-text">
            2. How We Use Information
          </h2>
          <p className="mt-2">Information you provide is used to:</p>
          <ul className="mt-2 list-disc space-y-1.5 pl-5">
            <li>Schedule, route, and fulfill used cooking oil pickups</li>
            <li>Calculate and process payments for collected oil</li>
            <li>Issue disposal and compliance documentation on request</li>
            <li>
              Communicate with you about your account, a specific pickup, or
              service updates
            </li>
            <li>Improve our services, website, and operations</li>
            <li>Meet legal, regulatory, and safety obligations</li>
          </ul>
        </div>

        <div>
          <h2 className="text-base font-semibold text-nav-dark-text">
            3. Data Sharing
          </h2>
          <p className="mt-2">
            We do not sell your personal information. Data may be shared
            with service providers who help us operate our pickup and
            logistics network (for example, collection and routing
            partners, payment processors, and communication providers),
            subject to confidentiality obligations, and with regulators or
            authorities where required by law.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-nav-dark-text">
            4. Data Retention
          </h2>
          <p className="mt-2">
            We retain pickup, payment, and compliance records for as long
            as necessary to provide our services and to meet applicable
            regulatory and record-keeping requirements, including those
            connected to used cooking oil disposal compliance.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-nav-dark-text">
            5. Your Rights
          </h2>
          <p className="mt-2">
            You may ask us to access, correct, or delete the personal
            information we hold about you, subject to our legal and
            operational obligations (for example, records we&apos;re
            required to retain for compliance purposes). To make a request,
            contact us using the details below.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-nav-dark-text">
            6. Cookies &amp; Analytics
          </h2>
          <p className="mt-2">
            Our website may use cookies or similar technologies to remember
            preferences and understand how the site is used, so we can
            improve it. You can control cookies through your browser
            settings.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-nav-dark-text">
            7. Changes to This Policy
          </h2>
          <p className="mt-2">
            We may update this policy from time to time. Material changes
            will be reflected by an updated &ldquo;last updated&rdquo; date
            above.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-nav-dark-text">
            8. Contact
          </h2>
          <p className="mt-2">
            Questions about this policy can be sent to{" "}
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
