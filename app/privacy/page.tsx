import type { Metadata } from "next";
import { StubPage } from "@/components/stub-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How NavUrja collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <StubPage eyebrow="Legal · Draft" title="Privacy Policy">
      <p className="mb-4 rounded-lg border border-nav-oil-gold/40 bg-nav-mint px-4 py-3 text-sm text-nav-dark-text">
        This is placeholder text and has not been reviewed by legal counsel.
        Replace it with NavUrja&apos;s finalized privacy policy before launch.
      </p>
      <div className="space-y-6">
        <div>
          <h2 className="text-base font-semibold text-nav-dark-text">
            1. Information We Collect
          </h2>
          <p className="mt-2">
            When you request a pickup, subscribe to our newsletter, or
            otherwise contact us, we may collect information such as your
            name, business name, phone number, email address, and pickup
            location.
          </p>
        </div>
        <div>
          <h2 className="text-base font-semibold text-nav-dark-text">
            2. How We Use Information
          </h2>
          <p className="mt-2">
            Information you provide is used to schedule and fulfill used
            cooking oil pickups, communicate with you about your account or
            request, and improve our services.
          </p>
        </div>
        <div>
          <h2 className="text-base font-semibold text-nav-dark-text">
            3. Data Sharing
          </h2>
          <p className="mt-2">
            We do not sell your personal information. Data may be shared with
            service providers who help us operate our pickup and logistics
            network, subject to confidentiality obligations.
          </p>
        </div>
        <div>
          <h2 className="text-base font-semibold text-nav-dark-text">
            4. Contact
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
