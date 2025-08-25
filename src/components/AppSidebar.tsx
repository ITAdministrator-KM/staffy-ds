import { useState } from "react"
import { 
  Users, 
  FileText, 
  Calendar, 
  Settings, 
  Home,
  UserPlus,
  Shield,
  Building2,
  ClipboardList,
  UserCheck,
  FolderOpen
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"

// Mock user role - in real app this would come from auth context
const userRole = "admin" // "staff", "division_cc", "division_head", "admin"

const staffItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "My Profile", url: "/profile", icon: Users },
  { title: "Apply Leave", url: "/leave", icon: Calendar },
  { title: "Documents", url: "/documents", icon: FolderOpen },
  { title: "Account Settings", url: "/settings", icon: Settings },
]

const divisionCCItems = [
  ...staffItems,
  { title: "Staff Directory", url: "/staff-directory", icon: Users },
  { title: "Leave Recommendations", url: "/leave-recommendations", icon: UserCheck },
]

const divisionHeadItems = [
  ...divisionCCItems,
  { title: "Leave Approvals", url: "/leave-approvals", icon: ClipboardList },
]

const adminItems = [
  ...divisionHeadItems,
  { title: "Admin Panel", url: "/admin", icon: Shield },
  { title: "Manage Divisions", url: "/divisions", icon: Building2 },
]

const getMenuItems = (role: string) => {
  switch (role) {
    case "admin":
      return adminItems
    case "division_head":
      return divisionHeadItems
    case "division_cc":
      return divisionCCItems
    default:
      return staffItems
  }
}

export function AppSidebar() {
  const { state } = useSidebar()
  const collapsed = state === "collapsed"
  const location = useLocation()
  const currentPath = location.pathname
  const menuItems = getMenuItems(userRole)

  const isActive = (path: string) => currentPath === path
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-sidebar-accent text-sidebar-primary font-medium border-l-2 border-sidebar-primary" 
      : "hover:bg-sidebar-accent/50 text-sidebar-foreground"

  return (
    <Sidebar
      className={collapsed ? "w-16" : "w-64"}
      collapsible="icon"
    >
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-3 p-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="text-lg font-bold text-sidebar-foreground">DStaff</h2>
              <p className="text-xs text-sidebar-foreground/70 capitalize">{userRole.replace('_', ' ')}</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="w-5 h-5" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <SidebarTrigger className="self-center" />
      </SidebarFooter>
    </Sidebar>
  )
}