import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Calendar, 
  FileCheck, 
  Building2, 
  Plus, 
  Eye, 
  Clock,
  CheckCircle,
  User,
  FileText,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { FirestoreService } from '@/services/firestoreService';
import { useNavigate } from 'react-router-dom';

interface DashboardStats {
  totalStaff?: number;
  activeLeaves?: number;
  pendingApprovals?: number;
  totalDivisions?: number;
  myLeaves?: number;
  pendingLeaves?: number;
  documents?: number;
  profileComplete?: number;
  pendingRecommendations?: number;
}

interface Activity {
  type: string;
  message: string;
  user: string;
  time: string;
}

const Dashboard = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({});
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const userRole = userProfile?.role || 'staff';

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // Load stats based on user role
        if (userRole === 'admin' || userRole === 'hod') {
          const systemStats = await FirestoreService.getStats();
          setStats(systemStats);
        } else {
          // Load user-specific stats
          const userStats: DashboardStats = {
            myLeaves: 0, // Will be implemented with real data
            pendingLeaves: 0,
            documents: 0,
            profileComplete: 85
          };
          setStats(userStats);
        }

        // Load recent activities (mock for now, can be enhanced with real data)
        const mockActivities: Activity[] = [
          { type: 'leave', message: 'Leave status updated', user: 'System', time: '2 hours ago' },
          { type: 'profile', message: 'Profile updated', user: 'You', time: '1 day ago' }
        ];
        setActivities(mockActivities);
        
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();

    // Set up real-time listeners for live updates
    const unsubscribeStats = FirestoreService.subscribeToLeaveRequests(() => {
      // Refresh stats when leave requests change
      loadDashboardData();
    });

    return () => {
      unsubscribeStats();
    };
  }, [userRole]);

  const getStatValue = (key: string) => {
    return stats[key as keyof DashboardStats] || 0;
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'add-staff':
        navigate('/profile');
        break;
      case 'apply-leave':
        navigate('/leave');
        break;
      case 'review-leaves':
        navigate('/leave-approvals');
        break;
      case 'staff-directory':
        navigate('/staff-directory');
        break;
      case 'update-profile':
        navigate('/profile');
        break;
      case 'view-documents':
        navigate('/documents');
        break;
      default:
        break;
    }
  };

  const getQuickActions = () => {
    switch (userRole) {
      case 'admin':
      case 'hod':
        return [
          { icon: Plus, label: 'Add New Staff', action: 'add-staff' },
          { icon: Eye, label: 'Review Leaves', action: 'review-leaves' },
          { icon: Users, label: 'Staff Directory', action: 'staff-directory' }
        ];
      case 'division_cc':
      case 'division_head':
        return [
          { icon: FileCheck, label: 'Review Recommendations', action: 'review-recommendations' },
          { icon: Users, label: 'Division Staff', action: 'division-staff' },
          { icon: Calendar, label: 'Apply Leave', action: 'apply-leave' }
        ];
      default:
        return [
          { icon: Calendar, label: 'Apply Leave', action: 'apply-leave' },
          { icon: User, label: 'Update Profile', action: 'update-profile' },
          { icon: FileText, label: 'View Documents', action: 'view-documents' }
        ];
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const actions = getQuickActions();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto p-6 space-y-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {userProfile?.displayName || 'User'}!
          </h1>
          <p className="text-primary-foreground/80 text-lg">
            {userRole === 'admin' || userRole === 'hod'
              ? "Manage your organization efficiently" 
              : "Your personal staff management dashboard"
            }
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {userRole === 'admin' || userRole === 'hod' ? (
            <>
              <Card className="bg-card/50 backdrop-blur border-0 shadow-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
                  <Users className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{getStatValue('totalStaff')}</div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingUp className="w-3 h-3 inline mr-1" />
                    Active employees
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur border-0 shadow-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Leaves</CardTitle>
                  <Calendar className="h-4 w-4 text-warning" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-warning">{getStatValue('activeLeaves')}</div>
                  <p className="text-xs text-muted-foreground">
                    Currently on leave
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur border-0 shadow-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                  <AlertCircle className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">{getStatValue('pendingApprovals')}</div>
                  <p className="text-xs text-muted-foreground">
                    Needs attention
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur border-0 shadow-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Divisions</CardTitle>
                  <Building2 className="h-4 w-4 text-success" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-success">{getStatValue('totalDivisions')}</div>
                  <p className="text-xs text-muted-foreground">
                    Total divisions
                  </p>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Card className="bg-card/50 backdrop-blur border-0 shadow-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">My Leaves</CardTitle>
                  <Calendar className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{getStatValue('myLeaves')}</div>
                  <p className="text-xs text-muted-foreground">
                    Total applications
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur border-0 shadow-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending</CardTitle>
                  <Clock className="h-4 w-4 text-warning" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-warning">{getStatValue('pendingLeaves')}</div>
                  <p className="text-xs text-muted-foreground">
                    Awaiting approval
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur border-0 shadow-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Documents</CardTitle>
                  <FileText className="h-4 w-4 text-success" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-success">{getStatValue('documents')}</div>
                  <p className="text-xs text-muted-foreground">
                    Stored files
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur border-0 shadow-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Profile Complete</CardTitle>
                  <CheckCircle className="h-4 w-4 text-info" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-info">{getStatValue('profileComplete')}%</div>
                  <p className="text-xs text-muted-foreground">
                    Profile completion
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card className="lg:col-span-1 bg-card/50 backdrop-blur border-0 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Quick Actions
              </CardTitle>
              <p className="text-sm text-muted-foreground">Common tasks and shortcuts</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start gap-3 h-12"
                  onClick={() => handleQuickAction(action.action)}
                >
                  <action.icon className="w-5 h-5" />
                  {action.label}
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
              <p className="text-sm text-muted-foreground">Latest updates and actions</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.length > 0 ? activities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'leave' ? 'bg-warning' : 
                        activity.type === 'profile' ? 'bg-info' : 'bg-success'
                      }`} />
                      <div>
                        <p className="font-medium text-sm">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">{activity.user}</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                )) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No recent activities
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;