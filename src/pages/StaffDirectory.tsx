import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Users, 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  Calendar, 
  Building2,
  MapPin,
  User,
  Printer,
  Eye
} from "lucide-react"

interface StaffMember {
  id: string
  name: string
  email: string
  phone: string
  designation: string
  division: string
  dateOfBirth: string
  appointmentDate: string
  profileImage?: string
  status: "active" | "on_leave" | "inactive"
}

const mockStaffData: StaffMember[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@company.com",
    phone: "+94771234567",
    designation: "Software Engineer",
    division: "IT Department",
    dateOfBirth: "1990-01-15",
    appointmentDate: "2020-03-15",
    status: "active"
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    phone: "+94771234568",
    designation: "Senior Developer",
    division: "IT Department",
    dateOfBirth: "1988-05-22",
    appointmentDate: "2018-07-10",
    status: "active"
  },
  {
    id: "3",
    name: "Mike Chen",
    email: "mike.chen@company.com",
    phone: "+94771234569",
    designation: "UI/UX Designer",
    division: "Design Department",
    dateOfBirth: "1992-11-08",
    appointmentDate: "2021-01-20",
    status: "on_leave"
  },
  {
    id: "4",
    name: "Emma Wilson",
    email: "emma.wilson@company.com",
    phone: "+94771234570",
    designation: "HR Manager",
    division: "Human Resources",
    dateOfBirth: "1985-03-12",
    appointmentDate: "2017-09-05",
    status: "active"
  }
]

const StaffDirectory = () => {
  const [staffData, setStaffData] = useState<StaffMember[]>(mockStaffData)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDivision, setSelectedDivision] = useState<string>("")
  const [selectedStatus, setSelectedStatus] = useState<string>("")
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null)

  const divisions = [...new Set(mockStaffData.map(staff => staff.division))]

  const filteredStaff = staffData.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.designation.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesDivision = !selectedDivision || staff.division === selectedDivision
    const matchesStatus = !selectedStatus || staff.status === selectedStatus
    
    return matchesSearch && matchesDivision && matchesStatus
  })

  const getStatusBadge = (status: StaffMember['status']) => {
    switch (status) {
      case "active":
        return <Badge className="bg-success text-white">Active</Badge>
      case "on_leave":
        return <Badge className="bg-warning text-white">On Leave</Badge>
      case "inactive":
        return <Badge className="bg-destructive text-white">Inactive</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Staff Directory</h1>
              <p className="text-primary-foreground/80 text-lg">
                Browse and manage staff information
              </p>
            </div>
            <Button onClick={handlePrint} variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
              <Printer className="w-4 h-4 mr-2" />
              Print Directory
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-card/50 backdrop-blur border-0 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-primary" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search staff..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedDivision} onValueChange={setSelectedDivision}>
                <SelectTrigger>
                  <SelectValue placeholder="All Divisions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Divisions</SelectItem>
                  {divisions.map((division) => (
                    <SelectItem key={division} value={division}>{division}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="on_leave">On Leave</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                onClick={() => {
                  setSearchTerm("")
                  setSelectedDivision("")
                  setSelectedStatus("")
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Staff Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredStaff.map((staff) => (
            <Card key={staff.id} className="bg-card/50 backdrop-blur border-0 shadow-card hover:shadow-lg transition-shadow">
              <CardHeader className="text-center pb-2">
                <Avatar className="w-20 h-20 mx-auto mb-3">
                  <AvatarImage src={staff.profileImage} alt={staff.name} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-lg">
                    {getInitials(staff.name)}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-lg">{staff.name}</CardTitle>
                <CardDescription className="text-sm">{staff.designation}</CardDescription>
                {getStatusBadge(staff.status)}
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <span className="truncate">{staff.division}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="truncate">{staff.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{staff.phone}</span>
                </div>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-3"
                      onClick={() => setSelectedStaff(staff)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    {selectedStaff && (
                      <>
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-3">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={selectedStaff.profileImage} alt={selectedStaff.name} />
                              <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
                                {getInitials(selectedStaff.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="text-lg font-bold">{selectedStaff.name}</div>
                              <div className="text-sm text-muted-foreground">{selectedStaff.designation}</div>
                            </div>
                          </DialogTitle>
                        </DialogHeader>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold mb-2">Contact Information</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                  <Mail className="w-4 h-4 text-muted-foreground" />
                                  <span>{selectedStaff.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Phone className="w-4 h-4 text-muted-foreground" />
                                  <span>{selectedStaff.phone}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Building2 className="w-4 h-4 text-muted-foreground" />
                                  <span>{selectedStaff.division}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold mb-2">Employment Details</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-muted-foreground" />
                                  <span>Born: {new Date(selectedStaff.dateOfBirth).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-muted-foreground" />
                                  <span>Joined: {new Date(selectedStaff.appointmentDate).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <User className="w-4 h-4 text-muted-foreground" />
                                  <span>Status: </span>
                                  {getStatusBadge(selectedStaff.status)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredStaff.length === 0 && (
          <Card className="bg-card/50 backdrop-blur border-0 shadow-card">
            <CardContent className="text-center py-8">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No staff found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria</p>
            </CardContent>
          </Card>
        )}

        {/* Summary */}
        <Card className="bg-card/50 backdrop-blur border-0 shadow-card">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <span className="font-medium">Total Staff: {filteredStaff.length}</span>
            </div>
            <div className="flex gap-4 text-sm">
              <span className="text-success">
                Active: {filteredStaff.filter(s => s.status === 'active').length}
              </span>
              <span className="text-warning">
                On Leave: {filteredStaff.filter(s => s.status === 'on_leave').length}
              </span>
              <span className="text-destructive">
                Inactive: {filteredStaff.filter(s => s.status === 'inactive').length}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default StaffDirectory