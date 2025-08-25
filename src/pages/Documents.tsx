import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  FileText, 
  Upload, 
  Download, 
  Trash2, 
  Eye, 
  Search,
  Calendar,
  FileImage,
  FileSpreadsheet,
  File,
  FolderOpen,
  Cloud,
  Plus
} from "lucide-react"

interface Document {
  id: string
  name: string
  type: string
  size: string
  uploadDate: string
  driveFileId: string
  driveLink: string
  category: "personal" | "official" | "certificate" | "report"
}

const mockDocuments: Document[] = [
  {
    id: "1",
    name: "Employee Contract.pdf",
    type: "pdf",
    size: "2.4 MB",
    uploadDate: "2024-01-15",
    driveFileId: "1abc123def456",
    driveLink: "https://drive.google.com/file/d/1abc123def456/view",
    category: "official"
  },
  {
    id: "2",
    name: "Resume.pdf",
    type: "pdf",
    size: "1.2 MB",
    uploadDate: "2024-01-10",
    driveFileId: "2def456ghi789",
    driveLink: "https://drive.google.com/file/d/2def456ghi789/view",
    category: "personal"
  },
  {
    id: "3",
    name: "Training Certificate.png",
    type: "image",
    size: "3.5 MB",
    uploadDate: "2024-02-01",
    driveFileId: "3ghi789jkl012",
    driveLink: "https://drive.google.com/file/d/3ghi789jkl012/view",
    category: "certificate"
  },
  {
    id: "4",
    name: "Monthly Report.xlsx",
    type: "spreadsheet",
    size: "890 KB",
    uploadDate: "2024-02-10",
    driveFileId: "4jkl012mno345",
    driveLink: "https://drive.google.com/file/d/4jkl012mno345/view",
    category: "report"
  }
]

const Documents = () => {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || doc.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="w-8 h-8 text-red-500" />
      case "image":
        return <FileImage className="w-8 h-8 text-blue-500" />
      case "spreadsheet":
        return <FileSpreadsheet className="w-8 h-8 text-green-500" />
      default:
        return <File className="w-8 h-8 text-gray-500" />
    }
  }

  const getCategoryBadge = (category: Document['category']) => {
    const variants = {
      personal: "bg-blue-500 text-white",
      official: "bg-purple-500 text-white", 
      certificate: "bg-green-500 text-white",
      report: "bg-orange-500 text-white"
    }
    
    return (
      <Badge className={variants[category]}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </Badge>
    )
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          
          // Add new document to the list
          const newDoc: Document = {
            id: Date.now().toString(),
            name: file.name,
            type: file.type.includes('pdf') ? 'pdf' : 
                  file.type.includes('image') ? 'image' :
                  file.type.includes('spreadsheet') ? 'spreadsheet' : 'other',
            size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
            uploadDate: new Date().toISOString().split('T')[0],
            driveFileId: `drive_${Date.now()}`,
            driveLink: `https://drive.google.com/file/d/drive_${Date.now()}/view`,
            category: "personal"
          }
          
          setDocuments(prev => [newDoc, ...prev])
          return 0
        }
        return prev + 10
      })
    }, 200)
  }

  const handleDelete = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id))
  }

  const handleDownload = (doc: Document) => {
    // In real app, this would download from Google Drive
    console.log("Downloading:", doc.name)
    window.open(doc.driveLink, '_blank')
  }

  const categories = [
    { value: "", label: "All Categories" },
    { value: "personal", label: "Personal" },
    { value: "official", label: "Official" },
    { value: "certificate", label: "Certificates" },
    { value: "report", label: "Reports" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Document Management</h1>
              <p className="text-primary-foreground/80 text-lg flex items-center gap-2">
                <Cloud className="w-5 h-5" />
                Securely stored in your personal Google Drive
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{documents.length}</div>
              <div className="text-primary-foreground/80">Total Documents</div>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <Card className="bg-card/50 backdrop-blur border-0 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary" />
              Upload Documents
            </CardTitle>
            <CardDescription>
              Upload files to your personal Google Drive. Supported formats: PDF, Images, Documents, Spreadsheets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Choose files to upload</h3>
                  <p className="text-muted-foreground">Drag and drop files here or click to browse</p>
                </div>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  multiple
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                />
                <label htmlFor="file-upload">
                  <Button className="mt-4 bg-gradient-to-r from-primary to-secondary" asChild>
                    <span>
                      <Plus className="w-4 h-4 mr-2" />
                      Select Files
                    </span>
                  </Button>
                </label>
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Uploading to Google Drive...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Search and Filter */}
        <Card className="bg-card/50 backdrop-blur border-0 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5 text-primary" />
              Search Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.value}
                    variant={selectedCategory === category.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.value)}
                    className="flex-1 text-xs"
                  >
                    {category.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc) => (
            <Card key={doc.id} className="bg-card/50 backdrop-blur border-0 shadow-card hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  {getFileIcon(doc.type)}
                  {getCategoryBadge(doc.category)}
                </div>
                <CardTitle className="text-lg leading-tight">{doc.name}</CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{doc.size}</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(doc.uploadDate).toLocaleDateString()}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(doc.driveLink, '_blank')}
                    className="flex-1"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(doc)}
                    className="flex-1"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(doc.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDocuments.length === 0 && (
          <Card className="bg-card/50 backdrop-blur border-0 shadow-card">
            <CardContent className="text-center py-12">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No documents found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || selectedCategory 
                  ? "Try adjusting your search criteria"
                  : "Start by uploading your first document"
                }
              </p>
              {!searchTerm && !selectedCategory && (
                <label htmlFor="file-upload">
                  <Button className="bg-gradient-to-r from-primary to-secondary">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Document
                  </Button>
                </label>
              )}
            </CardContent>
          </Card>
        )}

        {/* Storage Info */}
        <Card className="bg-card/50 backdrop-blur border-0 shadow-card">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex items-center gap-3">
              <Cloud className="w-6 h-6 text-primary" />
              <div>
                <div className="font-semibold">Google Drive Integration</div>
                <div className="text-sm text-muted-foreground">Files are stored securely in your personal Drive</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-primary">{documents.length} files</div>
              <div className="text-xs text-muted-foreground">
                Total size: {documents.reduce((acc, doc) => acc + parseFloat(doc.size), 0).toFixed(1)} MB
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Documents