"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

const SEGMENT_LABELS: Record<string, string> = {
  admin: "Dashboard",
  leads: "Leads",
  organizations: "Organizations",
  "rate-cards": "Rate Cards",
  collections: "Collections",
  convert: "Convert to organization",
  login: "Sign in",
  signup: "Sign up",
}

const UUID_LIKE = /^[0-9a-f]{8}-[0-9a-f]{4}-/i

function labelFor(segment: string) {
  if (SEGMENT_LABELS[segment]) return SEGMENT_LABELS[segment]
  if (UUID_LIKE.test(segment)) return "Details"
  return segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}

export function AdminSiteHeader() {
  const pathname = usePathname()
  const segments = pathname.replace(/^\/admin\/?/, "").split("/").filter(Boolean)

  const crumbs = [
    { label: "Dashboard", href: "/admin" },
    ...segments.map((segment, index) => ({
      label: labelFor(segment),
      href: `/admin/${segments.slice(0, index + 1).join("/")}`,
    })),
  ]

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 h-4 data-vertical:self-auto" />
        <Breadcrumb>
          <BreadcrumbList>
            {crumbs.map((crumb, index) => {
              const isLast = index === crumbs.length - 1
              return (
                <span key={crumb.href} className="flex items-center gap-1.5">
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink render={<Link href={crumb.href} />}>
                        {crumb.label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator />}
                </span>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  )
}
