import type { Metadata } from "next";
import { StubPage } from "@/components/stub-page";

export const metadata: Metadata = {
  title: "Blog",
  description: "Stories and updates from NavUrja.",
};

export default function BlogPage() {
  return (
    <StubPage eyebrow="Journal" title="Blog">
      <p>
        Our blog is on its way &mdash; stories about the circular economy,
        used cooking oil, and how NavUrja is building a cleaner loop for
        India&apos;s food businesses. Check back soon.
      </p>
    </StubPage>
  );
}
