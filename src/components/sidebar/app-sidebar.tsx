"use client"

import * as React from "react"
import {
  Users,
  Box,
  ShoppingCart,
  Settings,
  Camera,
  LayoutDashboard,
} from "lucide-react"

import { NavMain } from "@/components/sidebar/nav-main"
import { NavUser } from "@/components/sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    { name: "Dashboard", icon: LayoutDashboard, url: "/dashboard/"},
    { name: "Users", icon: Users, url: "/dashboard/users/"},
    { name: "Orders", icon: ShoppingCart, url: "/dashboard/orders/"},
    { name: "Products", icon: Box, url: "/dashboard/products/"},
    { name: "Media", icon: Camera, url: "/dashboard/media/"},
    { name: "Settings", icon: Settings, url: "/dashboard/settings/"},
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <Link href="/">
                <span className="text-base font-semibold">E-Commerce</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}