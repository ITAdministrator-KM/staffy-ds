import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { 
  User, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  Building, 
  Camera,
  Plus,
  Trash2,
  Monitor,
  Printer,
  Wifi,
  Battery
} from "lucide-react"

interface WorkingHistoryEntry {
  id: string
  place: string
  role: string
}

interface Inventory {
  pcLaptop: boolean
  lgnAccount: boolean
  printer: string
  router: boolean
  ups: boolean
}

const StaffProfile = () => {
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    nic: "123456789V",
    designation: "Software Engineer",
    dateOfBirth: "1990-01-15",
    mobileNumber: "+94771234567",
    appointmentDate: "2020-03-15",
    email: "john.doe@company.com",
    profileImageUrl: ""
  })

  const [workingHistory, setWorkingHistory] = useState<WorkingHistoryEntry[]>([
    { id: "1", place: "Tech Solutions Ltd", role: "Junior Developer" },
    { id: "2", place: "Digital Innovations", role: "Developer" }
  ])

  const [inventory, setInventory] = useState<Inventory>({
    pcLaptop: true,
    lgnAccount: true,
    printer: "HP LaserJet Pro",
    router: true,
    ups: true
  })

  const [isEditing, setIsEditing] = useState(false)

  const addWorkingHistory = () => {
    const newEntry: WorkingHistoryEntry = {
      id: Date.now().toString(),
      place: "",
      role: ""
    }
    setWorkingHistory([...workingHistory, newEntry])
  }

  const removeWorkingHistory = (id: string) => {
    setWorkingHistory(workingHistory.filter(entry => entry.id !== id))
  }

  const updateWorkingHistory = (id: string, field: string, value: string) => {
    setWorkingHistory(workingHistory.map(entry => 
      entry.id === id ? { ...entry, [field]: value } : entry
    ))
  }

  const handleSave = () => {
    // In real app, this would save to backend
    setIsEditing(false)
    console.log("Saving profile data:", { profileData, workingHistory, inventory })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Staff Profile</h1>
            <p className="text-muted-foreground">Manage your personal information and work details</p>
          </div>
          <Button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="bg-gradient-to-r from-primary to-secondary"
          >
            {isEditing ? "Save Changes" : "Edit Profile"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Image & Basic Info */}
          <Card className="lg:col-span-1 bg-card/50 backdrop-blur border-0 shadow-card">
            <CardHeader className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                {profileData.profileImageUrl ? (
                  <img 
                    src={profileData.profileImageUrl} 
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 text-white" />
                )}
              </div>
              {isEditing && (
                <Button variant="outline" size="sm" className="mx-auto">
                  <Camera className="w-4 h-4 mr-2" />
                  Upload Photo
                </Button>
              )}
              <CardTitle className="text-xl">{profileData.name}</CardTitle>
              <CardDescription className="text-sm">{profileData.designation}</CardDescription>
              <Badge variant="secondary" className="mx-auto">
                Employee ID: EMP{profileData.nic.slice(0, 6)}
              </Badge>
            </CardHeader>
          </Card>

          {/* Personal Information */}
          <Card className="lg:col-span-2 bg-card/50 backdrop-blur border-0 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    disabled={!isEditing}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nic">NIC Number</Label>
                  <Input
                    id="nic"
                    value={profileData.nic}
                    disabled={!isEditing}
                    onChange={(e) => setProfileData({...profileData, nic: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="designation">Designation</Label>
                  <Input
                    id="designation"
                    value={profileData.designation}
                    disabled={!isEditing}
                    onChange={(e) => setProfileData({...profileData, designation: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={profileData.dateOfBirth}
                    disabled={!isEditing}
                    onChange={(e) => setProfileData({...profileData, dateOfBirth: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <Input
                    id="mobile"
                    value={profileData.mobileNumber}
                    disabled={!isEditing}
                    onChange={(e) => setProfileData({...profileData, mobileNumber: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="appointment">Appointment Date</Label>
                  <Input
                    id="appointment"
                    type="date"
                    value={profileData.appointmentDate}
                    disabled={!isEditing}
                    onChange={(e) => setProfileData({...profileData, appointmentDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    disabled={!isEditing}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Working History */}
        <Card className="bg-card/50 backdrop-blur border-0 shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5 text-primary" />
                Working History
              </CardTitle>
              {isEditing && (
                <Button onClick={addWorkingHistory} size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Entry
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {workingHistory.map((entry, index) => (
              <div key={entry.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Company/Place</Label>
                    <Input
                      value={entry.place}
                      disabled={!isEditing}
                      onChange={(e) => updateWorkingHistory(entry.id, 'place', e.target.value)}
                      placeholder="Company or organization name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Role/Position</Label>
                    <Input
                      value={entry.role}
                      disabled={!isEditing}
                      onChange={(e) => updateWorkingHistory(entry.id, 'role', e.target.value)}
                      placeholder="Job title or role"
                    />
                  </div>
                </div>
                {isEditing && (
                  <Button
                    onClick={() => removeWorkingHistory(entry.id)}
                    size="sm"
                    variant="outline"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            {workingHistory.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No working history entries yet.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Inventory Checklist */}
        <Card className="bg-card/50 backdrop-blur border-0 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="w-5 h-5 text-primary" />
              Inventory Checklist
            </CardTitle>
            <CardDescription>Equipment and resources assigned to you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Monitor className="w-5 h-5 text-primary" />
                  <Label htmlFor="pc-laptop" className="font-medium">PC/Laptop</Label>
                </div>
                <Switch
                  id="pc-laptop"
                  checked={inventory.pcLaptop}
                  disabled={!isEditing}
                  onCheckedChange={(checked) => setInventory({...inventory, pcLaptop: checked})}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-primary" />
                  <Label htmlFor="lgn-account" className="font-medium">LGN Account</Label>
                </div>
                <Switch
                  id="lgn-account"
                  checked={inventory.lgnAccount}
                  disabled={!isEditing}
                  onCheckedChange={(checked) => setInventory({...inventory, lgnAccount: checked})}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Wifi className="w-5 h-5 text-primary" />
                  <Label htmlFor="router" className="font-medium">Router</Label>
                </div>
                <Switch
                  id="router"
                  checked={inventory.router}
                  disabled={!isEditing}
                  onCheckedChange={(checked) => setInventory({...inventory, router: checked})}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Battery className="w-5 h-5 text-primary" />
                  <Label htmlFor="ups" className="font-medium">UPS</Label>
                </div>
                <Switch
                  id="ups"
                  checked={inventory.ups}
                  disabled={!isEditing}
                  onCheckedChange={(checked) => setInventory({...inventory, ups: checked})}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="printer">Printer Details</Label>
              <div className="flex items-center gap-3">
                <Printer className="w-5 h-5 text-primary" />
                <Input
                  id="printer"
                  value={inventory.printer}
                  disabled={!isEditing}
                  onChange={(e) => setInventory({...inventory, printer: e.target.value})}
                  placeholder="Enter printer model/name"
                  className="flex-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default StaffProfile