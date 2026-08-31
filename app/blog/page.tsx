import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { StubPage } from "@/components/stub-page";
import { BLOG_POSTS } from "@/lib/blog-posts";

export const metadata: Metadata = {
  title: "Blog",
  description: "Stories about the circular economy, used cooking oil, and compliance.",
};

const DATE_FORMAT = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export default function BlogPage() {
  const posts = [...BLOG_POSTS].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <StubPage eyebrow="Journal" title="The NavUrja Blog" breadcrumbs={[{ label: "Blog" }]} wide>
      <p className="max-w-2xl">
        Stories about the circular economy, used cooking oil, and how
        NavUrja is building a cleaner loop for India&apos;s food
        businesses.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex flex-col rounded-2xl border border-black/5 bg-white p-6 transition-shadow hover:shadow-[0_20px_40px_-24px_rgba(0,0,0,0.2)]"
          >
            <span className="w-fit rounded-full bg-nav-light-green px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-nav-primary">
              {post.category}
            </span>
            <h2 className="mt-4 text-lg font-bold leading-snug text-nav-dark-text">
              {post.title}
            </h2>
            <p className="mt-2 line-clamp-3 flex-1 text-sm text-nav-muted">{post.excerpt}</p>
            <div className="mt-5 flex items-center justify-between text-xs text-nav-muted">
              <span>
                {DATE_FORMAT.format(new Date(post.date))} · {post.readTimeMinutes} min read
              </span>
              <span className="flex items-center gap-1 font-medium text-nav-green opacity-0 transition-opacity group-hover:opacity-100">
                Read <ArrowRight className="size-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </StubPage>
  );
}
