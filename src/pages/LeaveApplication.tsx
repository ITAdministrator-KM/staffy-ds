import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Calendar, 
  Clock, 
  Users, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Send
} from "lucide-react"

interface LeaveRequest {
  id: string
  leaveType: string
  startDate: string
  endDate: string
  numberOfDays: number
  reason: string
  actingOfficer: string
  recommendOfficer: string
  approveOfficer: string
  status: "pending" | "recommended" | "approved" | "rejected"
  submittedDate: string
}

const LeaveApplication = () => {
  const [formData, setFormData] = useState({
    name: "John Doe",
    designation: "Software Engineer",
    leaveType: "",
    numberOfDays: 0,
    startDate: "",
    endDate: "",
    reason: "",
    actingOfficer: "",
    recommendOfficer: "",
    approveOfficer: ""
  })

  const [existingLeaves, setExistingLeaves] = useState<LeaveRequest[]>([
    {
      id: "1",
      leaveType: "Annual Leave",
      startDate: "2024-01-15",
      endDate: "2024-01-19",
      numberOfDays: 5,
      reason: "Family vacation",
      actingOfficer: "Sarah Johnson",
      recommendOfficer: "Division CC",
      approveOfficer: "Division Head",
      status: "approved",
      submittedDate: "2024-01-10"
    },
    {
      id: "2",
      leaveType: "Sick Leave",
      startDate: "2024-02-20",
      endDate: "2024-02-21",
      numberOfDays: 2,
      reason: "Medical appointment",
      actingOfficer: "Mike Chen",
      recommendOfficer: "Division CC",
      approveOfficer: "Division Head",
      status: "pending",
      submittedDate: "2024-02-18"
    }
  ])

  const leaveTypes = [
    "Annual Leave",
    "Sick Leave",
    "Casual Leave",
    "Maternity Leave",
    "Paternity Leave",
    "Emergency Leave"
  ]

  const actingOfficers = [
    "Sarah Johnson",
    "Mike Chen",
    "Emma Wilson",
    "David Brown",
    "Lisa Anderson"
  ]

  const recommendOfficers = [
    "Division CC",
    "Division Head"
  ]

  const approveOfficers = [
    "Division Head",
    "HOD"
  ]

  const calculateDays = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate)
      const end = new Date(formData.endDate)
      const diffTime = Math.abs(end.getTime() - start.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
      setFormData({...formData, numberOfDays: diffDays})
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newLeave: LeaveRequest = {
      id: Date.now().toString(),
      leaveType: formData.leaveType,
      startDate: formData.startDate,
      endDate: formData.endDate,
      numberOfDays: formData.numberOfDays,
      reason: formData.reason,
      actingOfficer: formData.actingOfficer,
      recommendOfficer: formData.recommendOfficer,
      approveOfficer: formData.approveOfficer,
      status: "pending",
      submittedDate: new Date().toISOString().split('T')[0]
    }

    setExistingLeaves([newLeave, ...existingLeaves])
    
    // Reset form
    setFormData({
      ...formData,
      leaveType: "",
      numberOfDays: 0,
      startDate: "",
      endDate: "",
      reason: "",
      actingOfficer: "",
      recommendOfficer: "",
      approveOfficer: ""
    })

    console.log("Leave application submitted:", newLeave)
  }

  const getStatusBadge = (status: LeaveRequest['status']) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-success text-white"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>
      case "rejected":
        return <Badge className="bg-destructive text-white"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>
      case "recommended":
        return <Badge className="bg-info text-white"><AlertCircle className="w-3 h-3 mr-1" />Recommended</Badge>
      default:
        return <Badge className="bg-warning text-white"><Clock className="w-3 h-3 mr-1" />Pending</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Leave Management</h1>
          <p className="text-primary-foreground/80 text-lg">
            Apply for leave and track your requests
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Leave Application Form */}
          <Card className="lg:col-span-3 bg-card/50 backdrop-blur border-0 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                New Leave Application
              </CardTitle>
              <CardDescription>Fill out the form to submit a new leave request</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="designation">Designation</Label>
                    <Input
                      id="designation"
                      value={formData.designation}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="leave-type">Leave Type</Label>
                    <Select value={formData.leaveType} onValueChange={(value) => setFormData({...formData, leaveType: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select leave type" />
                      </SelectTrigger>
                      <SelectContent>
                        {leaveTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="days">Number of Days</Label>
                    <Input
                      id="days"
                      type="number"
                      value={formData.numberOfDays}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-date">Leave Start Date</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => {
                        setFormData({...formData, startDate: e.target.value})
                        setTimeout(calculateDays, 100)
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-date">Leave Resume Date</Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => {
                        setFormData({...formData, endDate: e.target.value})
                        setTimeout(calculateDays, 100)
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Leave</Label>
                  <Textarea
                    id="reason"
                    value={formData.reason}
                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                    placeholder="Please provide the reason for your leave request"
                    rows={3}
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="acting-officer">Acting Officer</Label>
                    <Select value={formData.actingOfficer} onValueChange={(value) => setFormData({...formData, actingOfficer: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select acting officer" />
                      </SelectTrigger>
                      <SelectContent>
                        {actingOfficers.map((officer) => (
                          <SelectItem key={officer} value={officer}>{officer}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recommend-officer">Recommend Officer</Label>
                    <Select value={formData.recommendOfficer} onValueChange={(value) => setFormData({...formData, recommendOfficer: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select recommend officer" />
                      </SelectTrigger>
                      <SelectContent>
                        {recommendOfficers.map((officer) => (
                          <SelectItem key={officer} value={officer}>{officer}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="approve-officer">Approve Officer</Label>
                    <Select value={formData.approveOfficer} onValueChange={(value) => setFormData({...formData, approveOfficer: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select approve officer" />
                      </SelectTrigger>
                      <SelectContent>
                        {approveOfficers.map((officer) => (
                          <SelectItem key={officer} value={officer}>{officer}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-primary to-secondary"
                  disabled={!formData.leaveType || !formData.startDate || !formData.endDate || !formData.reason}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit Leave Application
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Leave History */}
          <Card className="lg:col-span-2 bg-card/50 backdrop-blur border-0 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Leave History
              </CardTitle>
              <CardDescription>Your previous and current leave requests</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {existingLeaves.map((leave) => (
                <div key={leave.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{leave.leaveType}</h4>
                    {getStatusBadge(leave.status)}
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      {leave.startDate} to {leave.endDate}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      {leave.numberOfDays} days
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3 h-3" />
                      Acting: {leave.actingOfficer}
                    </div>
                  </div>
                  <p className="text-sm">{leave.reason}</p>
                  <div className="text-xs text-muted-foreground">
                    Submitted: {leave.submittedDate}
                  </div>
                </div>
              ))}
              {existingLeaves.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No leave requests yet.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default LeaveApplication