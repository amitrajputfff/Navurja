import type { Metadata } from "next";
import { StubPage } from "@/components/stub-page";

export const metadata: Metadata = {
  title: "FAQs",
  description: "Frequently asked questions about NavUrja's used cooking oil collection.",
};

export default function FaqsPage() {
  return (
    <StubPage eyebrow="Support" title="Frequently Asked Questions">
      <p>
        We&apos;re putting together answers to the questions we hear most
        often from restaurants, hotels, and cloud kitchens. This page is
        coming soon &mdash; in the meantime, reach out directly and we&apos;ll
        help right away.
      </p>
    </StubPage>
  );
}
