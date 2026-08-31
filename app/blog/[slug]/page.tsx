import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { StubPage } from "@/components/stub-page";
import { BLOG_POSTS, getBlogPost } from "@/lib/blog-posts";

const DATE_FORMAT = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const related = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <StubPage
      eyebrow={post.category}
      title={post.title}
      breadcrumbs={[{ label: "Blog", href: "/blog" }, { label: post.title }]}
    >
      <p className="text-sm text-nav-muted">
        {DATE_FORMAT.format(new Date(post.date))} · {post.readTimeMinutes} min read
      </p>

      <div className="prose-navurja mt-8 space-y-5">
        {post.body.map((block, index) => {
          if (block.type === "h2") {
            return (
              <h2 key={index} className="!mt-10 text-lg font-bold text-nav-dark-text">
                {block.text}
              </h2>
            );
          }
          if (block.type === "list") {
            return (
              <ul key={index} className="list-disc space-y-1.5 pl-5">
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex}>{item}</li>
                ))}
              </ul>
            );
          }
          return <p key={index}>{block.text}</p>;
        })}
      </div>

      <div className="mt-12 rounded-2xl border border-nav-light-green bg-nav-mint p-6 text-center">
        <p className="font-medium text-nav-dark-text">Ready to schedule your first pickup?</p>
        <Link
          href="/#pickup"
          className="mt-3 inline-flex items-center justify-center rounded-full bg-nav-primary px-5 py-2.5 text-sm font-medium text-white! no-underline! transition-colors hover:bg-nav-primary/90"
        >
          Request a Pickup
        </Link>
      </div>

      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-nav-green">
            Keep reading
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/blog/${r.slug}`}
                className="group flex flex-col rounded-2xl border border-black/5 bg-white p-5 no-underline!"
              >
                <p className="font-semibold text-nav-dark-text">{r.title}</p>
                <p className="mt-1.5 line-clamp-2 text-sm text-nav-muted">{r.excerpt}</p>
                <span className="mt-3 flex items-center gap-1 text-xs font-medium text-nav-green opacity-0 transition-opacity group-hover:opacity-100">
                  Read <ArrowRight className="size-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </StubPage>
  );
}
