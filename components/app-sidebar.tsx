"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboardIcon,
  InboxIcon,
  Building2Icon,
  ReceiptIndianRupeeIcon,
  TruckIcon,
} from "lucide-react"

import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const NAV_ITEMS = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboardIcon },
  { title: "Leads", href: "/admin/leads", icon: InboxIcon },
  { title: "Organizations", href: "/admin/organizations", icon: Building2Icon },
  { title: "Rate Cards", href: "/admin/rate-cards", icon: ReceiptIndianRupeeIcon },
  { title: "Collections", href: "/admin/collections", icon: TruckIcon },
] as const

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: { name: string; email: string; role: string }
}) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<Link href="/admin" />}
            >
              <Image src="/logo-icon.png" alt="" width={20} height={20} className="size-5 object-contain" />
              <span className="text-base font-semibold">NavUrja Admin</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              {NAV_ITEMS.map((item) => {
                // Exact match for the dashboard root; prefix match for
                // everything else so a nested route (e.g. an organization
                // detail page) still highlights its section in the nav.
                const isActive =
                  item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href)
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={isActive}
                      render={<Link href={item.href} />}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
