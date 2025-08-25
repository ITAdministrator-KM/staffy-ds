import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  Calendar, 
  FileText, 
  TrendingUp,
  UserPlus,
  ClipboardList,
  CheckCircle,
  Clock
} from "lucide-react"

// Mock data - in real app this would come from API
const userRole = "admin" // This would come from auth context
const userName = "John Doe"

const statsData = {
  staff: {
    totalStaff: 156,
    activeLeaves: 8,
    pendingDocuments: 3,
    upcomingBirthdays: 5
  },
  admin: {
    totalStaff: 450,
    activeLeaves: 23,
    pendingApprovals: 12,
    totalDivisions: 8
  }
}

const recentActivities = [
  { id: 1, action: "Leave approved", user: "Sarah Johnson", time: "2 hours ago", type: "success" },
  { id: 2, action: "New staff registered", user: "Mike Chen", time: "4 hours ago", type: "info" },
  { id: 3, action: "Document uploaded", user: "Emma Wilson", time: "6 hours ago", type: "info" },
  { id: 4, action: "Leave pending approval", user: "David Brown", time: "1 day ago", type: "warning" },
]

const quickActions = {
  staff: [
    { title: "Apply for Leave", icon: Calendar, href: "/leave", variant: "default" as const },
    { title: "Update Profile", icon: Users, href: "/profile", variant: "outline" as const },
    { title: "Upload Documents", icon: FileText, href: "/documents", variant: "outline" as const },
  ],
  admin: [
    { title: "Add New Staff", icon: UserPlus, href: "/admin/add-staff", variant: "default" as const },
    { title: "Review Leaves", icon: ClipboardList, href: "/leave-approvals", variant: "outline" as const },
    { title: "Staff Directory", icon: Users, href: "/staff-directory", variant: "outline" as const },
  ]
}

const Dashboard = () => {
  const isAdmin = userRole === "admin" || userRole === "division_head"
  const stats = isAdmin ? statsData.admin : statsData.staff
  const actions = isAdmin ? quickActions.admin : quickActions.staff

  const getStatValue = (key: string) => {
    if (isAdmin) {
      return key === 'pendingApprovals' ? statsData.admin.pendingApprovals :
             key === 'totalDivisions' ? statsData.admin.totalDivisions :
             (statsData.admin as any)[key]
    } else {
      return key === 'pendingDocuments' ? statsData.staff.pendingDocuments :
             key === 'upcomingBirthdays' ? statsData.staff.upcomingBirthdays :
             (statsData.staff as any)[key]
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {userName}!</h1>
          <p className="text-primary-foreground/80 text-lg">
            {isAdmin 
              ? "Manage your organization efficiently" 
              : "Your personal staff management dashboard"
            }
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-card/50 backdrop-blur border-0 shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.totalStaff}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="w-3 h-3 inline mr-1" />
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-0 shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Leaves</CardTitle>
              <Calendar className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{stats.activeLeaves}</div>
              <p className="text-xs text-muted-foreground">
                Currently on leave
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-0 shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {isAdmin ? "Pending Approvals" : "Documents"}
              </CardTitle>
              <ClipboardList className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {getStatValue(isAdmin ? 'pendingApprovals' : 'pendingDocuments')}
              </div>
              <p className="text-xs text-muted-foreground">
                Needs attention
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-0 shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {isAdmin ? "Divisions" : "Birthdays"}
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                {getStatValue(isAdmin ? 'totalDivisions' : 'upcomingBirthdays')}
              </div>
              <p className="text-xs text-muted-foreground">
                {isAdmin ? "Total divisions" : "This week"}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card className="lg:col-span-1 bg-card/50 backdrop-blur border-0 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Quick Actions
              </CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant}
                  className="w-full justify-start gap-3 h-12"
                  onClick={() => window.location.href = action.href}
                >
                  <action.icon className="w-5 h-5" />
                  {action.title}
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="lg:col-span-2 bg-card/50 backdrop-blur border-0 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Recent Activities
              </CardTitle>
              <CardDescription>Latest updates and actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'success' ? 'bg-success' : 
                        activity.type === 'warning' ? 'bg-warning' : 'bg-info'
                      }`} />
                      <div>
                        <p className="font-medium text-sm">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.user}</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Dashboard