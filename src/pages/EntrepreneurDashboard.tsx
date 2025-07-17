import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { useProjectStore } from '@/store/projectStore'
import { extractProjectData, type AIExtractedData } from '@/services/aiService'
import { 
  Upload, 
  FileText, 
  Building2, 
  Mail, 
  Calendar, 
  Globe, 
  DollarSign,
  TrendingUp,
  Users,
  Shield,
  CheckCircle,
  Edit,
  ArrowLeft
} from 'lucide-react'

const SECTOR_OPTIONS = [
  'Agriculture', 'Air', 'Biodiversity & ecosystems', 'Climate', 'Diversity & inclusion',
  'Education', 'Employment / Livelihoods creation', 'Energy', 'Financial services',
  'Health', 'Infrastructure', 'Land', 'Oceans & coastal zones', 'Sustainable cities',
  'Sustainable consumption & production', 'Sustainable tourism', 'Water Treatment', 'Other'
]

const COUNTRY_OPTIONS = [
  'United States', 'United Kingdom', 'Germany', 'France', 'Canada', 'Australia',
  'Netherlands', 'Switzerland', 'Sweden', 'Denmark', 'Norway', 'Singapore',
  'Japan', 'South Korea', 'Brazil', 'Mexico', 'India', 'China', 'South Africa',
  'Kenya', 'Nigeria', 'Ghana', 'Other'
]

const MATURITY_STAGES = ['Ideation', 'Validation', 'Pilot', 'Growth', 'Scale', 'Mature']

const INSTRUMENT_OPTIONS = ['Convertible note', 'Equity', 'Debt', 'Other']

const SDG_OPTIONS = [
  'No poverty (SDG 1)', 'Zero hunger (SDG 2)', 'Good health and well-being (SDG 3)',
  'Quality education (SDG 4)', 'Gender equality (SDG 5)', 'Clean water and sanitation (SDG 6)',
  'Affordable and clean energy (SDG 7)', 'Decent work and economic growth (SDG 8)',
  'Industry, innovation and infrastructure (SDG 9)', 'Reduced inequalities (SDG 10)',
  'Sustainable cities and communities (SDG 11)', 'Responsible consumption and production (SDG 12)',
  'Climate action (SDG 13)', 'Life below water (SDG 14)', 'Life on land (SDG 15)',
  'Peace, justice, and strong institutions (SDG 16)', 'Partnerships for the goals (SDG 17)'
]

type FormStage = 'input' | 'review' | 'done'
type Mode = 'submit' | 'edit'

interface ProjectData {
  projectName: string
  incorporationDate: string
  sector: string
  country: string
  email: string
  businessModel: string
  maturityStage: string
  region: string
  mainCountry: string
  instrument: string
  coreTeam: string
  impactArea: string
  keyRisks: string
  barriers: string
  revenues: number
  breakeven: number
  marketSize: number
  expectedIRR: number
  financingNeed: number
  useOfProceeds: string
  sdgs: string[]
  problem: string
  solution: string
}

export default function EntrepreneurDashboard() {
  const [mode, setMode] = useState<Mode>('submit')
  const [stage, setStage] = useState<FormStage>('input')
  const [ndaAccepted, setNdaAccepted] = useState(false)
  const [files, setFiles] = useState<FileList | null>(null)
  const [editId, setEditId] = useState('')
  const [editPin, setEditPin] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [submittedProjectId, setSubmittedProjectId] = useState('')
  const [submittedPin, setSubmittedPin] = useState('')
  const [extractedText, setExtractedText] = useState('')
  const [showDebugInfo, setShowDebugInfo] = useState(false)
  const { toast } = useToast()
  
  const { addProject, updateProject, getProjectByCredentials } = useProjectStore()

  const [projectData, setProjectData] = useState<ProjectData>({
    projectName: '',
    incorporationDate: '',
    sector: '',
    country: '',
    email: '',
    businessModel: '',
    maturityStage: '',
    region: '',
    mainCountry: '',
    instrument: '',
    coreTeam: '',
    impactArea: '',
    keyRisks: '',
    barriers: '',
    revenues: 0,
    breakeven: new Date().getFullYear(),
    marketSize: 0,
    expectedIRR: 0,
    financingNeed: 0,
    useOfProceeds: '',
    sdgs: [],
    problem: '',
    solution: ''
  })

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (!selectedFiles || selectedFiles.length === 0) return
    
    // Validate each file
    const validFiles: File[] = []
    const errors: string[] = []
    
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i]
      
      // Check if file exists and has content
      if (!file || file.size === 0) {
        errors.push(`${file?.name || 'Unknown file'} is empty`)
        continue
      }
      
      // Check file name validity
      if (!file.name || file.name.trim() === '') {
        errors.push(`File ${i + 1} has no name`)
        continue
      }
      
      // Check file size (10MB limit per file)
      const maxFileSize = 10 * 1024 * 1024 // 10MB in bytes
      if (file.size > maxFileSize) {
        errors.push(`${file.name} is too large (${(file.size / 1024 / 1024).toFixed(1)}MB > 10MB)`)
        continue
      }
      
      // Check file type
      const extension = file.name.toLowerCase().split('.').pop()
      const allowedExtensions = ['pdf', 'docx', 'pptx', 'xlsx', 'doc', 'ppt', 'xls', 'txt', 'csv', 'md', 'json', 'html', 'htm']
      if (!extension || !allowedExtensions.includes(extension)) {
        errors.push(`${file.name} has unsupported file type (${extension || 'unknown'})`)
        continue
      }
      
      // Enhanced file integrity check
      try {
        // Test if file can be read as ArrayBuffer
        const testBuffer = await file.slice(0, Math.min(100, file.size)).arrayBuffer()
        if (testBuffer.byteLength === 0 && file.size > 0) {
          errors.push(`${file.name} appears to be corrupted (cannot read file content)`)
          continue
        }
        
        // Basic file signature validation for common types
        if (testBuffer.byteLength >= 4) {
          const uint8Array = new Uint8Array(testBuffer)
          const signature = String.fromCharCode(...uint8Array.slice(0, 4))
          
          if (extension === 'pdf' && !signature.startsWith('%PDF')) {
            errors.push(`${file.name} may not be a valid PDF file`)
            continue
          }
        }
      } catch (readError) {
        errors.push(`${file.name} cannot be read (file may be corrupted)`)
        continue
      }
      
      validFiles.push(file)
    }
    
    // Show errors if any
    if (errors.length > 0) {
      toast({
        title: "File Validation Errors",
        description: errors.slice(0, 3).join('; ') + (errors.length > 3 ? '...' : ''),
        variant: "destructive"
      })
    }
    
    // Check if we have any valid files
    if (validFiles.length === 0) {
      toast({
        title: "No Valid Files",
        description: "Please select valid document files (PDF, DOCX, PPTX, XLSX, TXT, CSV, etc.)",
        variant: "destructive"
      })
      return
    }
    
    // Check total size (50MB limit for all valid files combined)
    const totalSize = validFiles.reduce((sum, file) => sum + file.size, 0)
    const maxTotalSize = 50 * 1024 * 1024 // 50MB
    
    if (totalSize > maxTotalSize) {
      toast({
        title: "Total Size Too Large",
        description: `Combined file size must be under 50MB (current: ${(totalSize / 1024 / 1024).toFixed(1)}MB). Please select fewer or smaller files.`,
        variant: "destructive"
      })
      return
    }
    
    // Create a new FileList-like object with only valid files
    const dataTransfer = new DataTransfer()
    validFiles.forEach(file => dataTransfer.items.add(file))
    
    setFiles(dataTransfer.files)
    
    if (validFiles.length !== selectedFiles.length) {
      toast({
        title: "Some Files Excluded",
        description: `${validFiles.length} of ${selectedFiles.length} files were accepted. Invalid files were excluded.`,
      })
    }
  }

  const handleGenerateAI = async () => {
    if (!projectData.projectName || !projectData.email || !ndaAccepted || !files) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields, upload files, and accept the NDA.",
        variant: "destructive"
      })
      return
    }

    if (files.length > 5) {
      toast({
        title: "Too Many Files",
        description: "Maximum 5 files allowed.",
        variant: "destructive"
      })
      return
    }

    // Enhanced validation for files before AI processing
    const fileArray = Array.from(files)
    
    // Check for empty or corrupted files
    const invalidFiles = fileArray.filter(file => !file || file.size === 0 || !file.name || file.name.trim() === '')
    if (invalidFiles.length > 0) {
      toast({
        title: "Invalid Files Detected",
        description: `${invalidFiles.length} file(s) appear to be empty, corrupted, or have invalid names. Please re-select your files.`,
        variant: "destructive"
      })
      return
    }
    
    // Additional file readability test
    try {
      for (const file of fileArray) {
        // Quick readability test
        const testSlice = file.slice(0, 10)
        await testSlice.arrayBuffer() // This will throw if file is corrupted
      }
    } catch (fileError) {
      toast({
        title: "File Corruption Detected",
        description: "One or more files cannot be read properly. Please re-select your files and try again.",
        variant: "destructive"
      })
      return
    }

    setIsGenerating(true)
    
    // Show progress toast
    toast({
      title: "Processing Documents",
      description: `Extracting text from ${files.length} file(s) and analyzing with AI...`,
    })
    
    try {
      // Use the AI service to extract data
      const extractedData = await extractProjectData(
        files,
        projectData.projectName,
        projectData.sector,
        projectData.country
      )
      
      // Store debug text for troubleshooting
      if (extractedData._debugText) {
        setExtractedText(extractedData._debugText)
      }
      
      // Update project data with AI-extracted information (excluding debug text)
      const { _debugText, ...cleanData } = extractedData
      setProjectData(prev => ({
        ...prev,
        ...cleanData
      }))
      
      setStage('review')
      
      // Show success with details about what was extracted
      const extractedFields = Object.entries(extractedData)
        .filter(([key, value]) => key !== '_debugText' && value && value !== 'Not specified' && value !== 0 && 
                 (Array.isArray(value) ? value.length > 0 : true))
        .length
      
      toast({
        title: "AI Analysis Complete",
        description: `Successfully extracted ${extractedFields} fields from your documents. Please review and edit as needed.`
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      
      console.error('AI Processing Error:', error)
      
      // Enhanced error handling with more specific messages
      if (errorMessage.includes('File validation failed after') && errorMessage.includes('attempts')) {
        toast({
          title: "File Processing Failed",
          description: "Unable to process your files after multiple attempts. This may be due to file corruption, unsupported format, or temporary service issues.",
          variant: "destructive"
        })
        
        toast({
          title: "Suggestions",
          description: "Try: 1) Re-uploading your files, 2) Converting to a different format (PDF recommended), 3) Using smaller files, or 4) Continue with manual entry.",
        })
        
        // Still allow manual entry
        setStage('review')
      } else if (errorMessage.includes('File is required') || errorMessage.includes('VALIDATION_ERROR')) {
        toast({
          title: "File Validation Error",
          description: "There was an issue with file validation. Please re-select your files and ensure they are not corrupted.",
          variant: "destructive"
        })
        
        toast({
          title: "Quick Fix",
          description: "Try re-selecting your files from the file picker and upload again.",
        })
      } else if (errorMessage.includes('too large') || errorMessage.includes('File too large')) {
        toast({
          title: "File Size Error",
          description: "One or more files are too large for processing.",
          variant: "destructive"
        })
        
        toast({
          title: "Solution",
          description: "Please use files under 10MB each, or try uploading fewer files at once.",
        })
      } else if (errorMessage.includes('readable text') || errorMessage.includes('Insufficient text')) {
        toast({
          title: "Text Extraction Issue",
          description: "Unable to extract sufficient text from your documents.",
          variant: "destructive"
        })
        
        toast({
          title: "Suggestion", 
          description: "Ensure your documents contain readable text. Image-only PDFs or scanned documents may not work well. Try using text-based documents.",
        })
        
        // Allow manual entry for this case
        setStage('review')
      } else if (errorMessage.includes('temporarily unavailable') || errorMessage.includes('service')) {
        toast({
          title: "Service Temporarily Unavailable",
          description: "The AI processing service is temporarily unavailable.",
          variant: "destructive"
        })
        
        toast({
          title: "Alternative",
          description: "You can still proceed by filling out the form manually in the next step.",
        })
        
        // Allow user to proceed with empty data for manual entry
        setStage('review')
      } else {
        // Generic error handling
        toast({
          title: "AI Processing Error",
          description: errorMessage,
          variant: "destructive"
        })
        
        // For any other error, still allow manual entry
        toast({
          title: "Manual Entry Available",
          description: "AI processing encountered an issue, but you can continue with manual data entry.",
        })
        setStage('review')
      }
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSubmit = () => {
    try {
      // Add project to store
      const projectId = addProject({
        projectName: projectData.projectName,
        incorporationDate: projectData.incorporationDate,
        sector: projectData.sector,
        country: projectData.country,
        email: projectData.email,
        businessModel: projectData.businessModel,
        maturityStage: projectData.maturityStage,
        region: projectData.region,
        mainCountry: projectData.mainCountry,
        instrument: projectData.instrument,
        coreTeam: projectData.coreTeam,
        impactArea: projectData.impactArea,
        keyRisks: projectData.keyRisks,
        barriers: projectData.barriers,
        revenues: projectData.revenues,
        breakeven: projectData.breakeven,
        marketSize: projectData.marketSize,
        expectedIRR: projectData.expectedIRR,
        financingNeed: projectData.financingNeed,
        useOfProceeds: projectData.useOfProceeds,
        sdgs: projectData.sdgs,
        problem: projectData.problem,
        solution: projectData.solution
      })
      
      // Get the project to access the PIN
      const project = useProjectStore.getState().getProject(projectId)
      
      setSubmittedProjectId(projectId)
      setSubmittedPin(project?.pin || '')
      setStage('done')
      
      toast({
        title: "Submission Complete",
        description: `Your project has been submitted successfully. Project ID: ${projectId}`
      })
    } catch (error) {
      toast({
        title: "Submission Error",
        description: "There was an error submitting your project. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleEditLoad = () => {
    if (!editId || !editPin) {
      toast({
        title: "Missing Credentials",
        description: "Please enter both Project ID and PIN.",
        variant: "destructive"
      })
      return
    }

    // Load existing submission from store
    const project = getProjectByCredentials(editId, editPin)
    
    if (!project) {
      toast({
        title: "Invalid Credentials",
        description: "Project ID or PIN is incorrect.",
        variant: "destructive"
      })
      return
    }

    // Load project data into form
    setProjectData({
      projectName: project.projectName,
      incorporationDate: project.incorporationDate,
      sector: project.sector,
      country: project.country,
      email: project.email,
      businessModel: project.businessModel,
      maturityStage: project.maturityStage,
      region: project.region,
      mainCountry: project.mainCountry,
      instrument: project.instrument,
      coreTeam: project.coreTeam,
      impactArea: project.impactArea,
      keyRisks: project.keyRisks,
      barriers: project.barriers,
      revenues: project.revenues,
      breakeven: project.breakeven,
      marketSize: project.marketSize,
      expectedIRR: project.expectedIRR,
      financingNeed: project.financingNeed,
      useOfProceeds: project.useOfProceeds,
      sdgs: project.sdgs,
      problem: project.problem,
      solution: project.solution
    })
    
    setStage('review')
    
    toast({
      title: "Submission Loaded",
      description: "Your existing submission has been loaded for editing."
    })
  }

  const resetForm = () => {
    setStage('input')
    setMode('submit')
    setNdaAccepted(false)
    setFiles(null)
    setEditId('')
    setEditPin('')
    setProjectData({
      projectName: '',
      incorporationDate: '',
      sector: '',
      country: '',
      email: '',
      businessModel: '',
      maturityStage: '',
      region: '',
      mainCountry: '',
      instrument: '',
      coreTeam: '',
      impactArea: '',
      keyRisks: '',
      barriers: '',
      revenues: 0,
      breakeven: new Date().getFullYear(),
      marketSize: 0,
      expectedIRR: 0,
      financingNeed: 0,
      useOfProceeds: '',
      sdgs: [],
      problem: '',
      solution: ''
    })
  }

  if (stage === 'done') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-[#243D66] mb-4">
              🎉 Submission Complete
            </h1>
            
            <p className="text-lg text-slate-600 mb-8">
              Thank you for your submission! Your project has been received and will be reviewed by our team.
            </p>

            <Card className="text-left mb-8">
              <CardHeader>
                <CardTitle className="text-[#243D66]">Your Submission Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="font-medium">Project ID</Label>
                    <p className="font-mono bg-slate-100 p-2 rounded">{submittedProjectId}</p>
                  </div>
                  <div>
                    <Label className="font-medium">PIN</Label>
                    <p className="font-mono bg-slate-100 p-2 rounded">{submittedPin}</p>
                  </div>
                </div>
                <div>
                  <Label className="font-medium">Project Name</Label>
                  <p>{projectData.projectName}</p>
                </div>
                <div>
                  <Label className="font-medium">Sector</Label>
                  <p>{projectData.sector}</p>
                </div>
                <div>
                  <Label className="font-medium">Expected IRR</Label>
                  <p>{projectData.expectedIRR}%</p>
                </div>
              </CardContent>
            </Card>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
              <p className="text-blue-800 text-sm">
                <strong>Important:</strong> Please save your Project ID and PIN to edit your submission later.
              </p>
            </div>

            <Button onClick={resetForm} className="bg-[#D97A45] hover:bg-[#D97A45]/90">
              Submit Another Project
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-[#D97A45] rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#243D66]">Impact Project Room</h1>
              <p className="text-slate-600">Entrepreneur Dashboard</p>
            </div>
          </div>
          
          {stage === 'review' && (
            <Button variant="outline" onClick={() => setStage('input')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Form
            </Button>
          )}
        </div>

        {stage === 'input' && (
          <div className="max-w-4xl mx-auto">
            <Tabs value={mode} onValueChange={(value) => setMode(value as Mode)} className="mb-8">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="submit">Submit New Project</TabsTrigger>
                <TabsTrigger value="edit">Edit Existing</TabsTrigger>
              </TabsList>

              <TabsContent value="submit" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-[#243D66]">Project Information</CardTitle>
                    <CardDescription>
                      Provide basic information about your impact project
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="projectName">Project Registered Name *</Label>
                        <Input
                          id="projectName"
                          value={projectData.projectName}
                          onChange={(e) => setProjectData(prev => ({ ...prev, projectName: e.target.value }))}
                          placeholder="Enter project name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="incorporationDate">Date of Incorporation *</Label>
                        <Input
                          id="incorporationDate"
                          type="date"
                          value={projectData.incorporationDate}
                          onChange={(e) => setProjectData(prev => ({ ...prev, incorporationDate: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="sector">Primary Sector / Theme *</Label>
                        <Select value={projectData.sector} onValueChange={(value) => setProjectData(prev => ({ ...prev, sector: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select sector" />
                          </SelectTrigger>
                          <SelectContent>
                            {SECTOR_OPTIONS.map(sector => (
                              <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="country">Headquarters Country *</Label>
                        <Select value={projectData.country} onValueChange={(value) => setProjectData(prev => ({ ...prev, country: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            {COUNTRY_OPTIONS.map(country => (
                              <SelectItem key={country} value={country}>{country}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Contact Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={projectData.email}
                        onChange={(e) => setProjectData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="contact@yourproject.com"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-[#243D66]">Document Upload</CardTitle>
                    <CardDescription>
                      Upload up to 5 files (PDF, DOCX, PPTX, XLSX supported)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-[#D97A45] transition-colors">
                      <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <Label htmlFor="files" className="cursor-pointer">
                        <span className="text-[#D97A45] font-medium">Click to upload</span> or drag and drop
                      </Label>
                      <Input
                        id="files"
                        type="file"
                        multiple
                        accept=".pdf,.docx,.pptx,.xlsx,.doc,.ppt,.xls,.txt,.csv"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <p className="text-sm text-slate-500 mt-2">
                        <strong>Up to 5 files:</strong> PDF, DOCX, PPTX, XLSX, TXT, CSV up to 10MB each
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Combined size limit: 50MB
                      </p>
                    </div>
                    
                    {files && files.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <Label>Selected Files:</Label>
                        {Array.from(files).map((file, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm">
                            <FileText className="w-4 h-4 text-[#D97A45]" />
                            <span>{file.name}</span>
                            <Badge variant="secondary">{(file.size / 1024 / 1024).toFixed(1)} MB</Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-[#243D66]">NDA Agreement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="nda"
                        checked={ndaAccepted}
                        onCheckedChange={(checked) => setNdaAccepted(checked as boolean)}
                      />
                      <div className="space-y-2">
                        <Label htmlFor="nda" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          I accept the Non-Disclosure Agreement *
                        </Label>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="link" className="h-auto p-0 text-[#D97A45]">
                              Read full NDA terms
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh]">
                            <DialogHeader>
                              <DialogTitle>Non-Disclosure Agreement</DialogTitle>
                              <DialogDescription>
                                Please read the complete NDA terms below
                              </DialogDescription>
                            </DialogHeader>
                            <ScrollArea className="h-[60vh] pr-4">
                              <div className="space-y-4 text-sm">
                                <h3 className="font-semibold">1. Confidential Information</h3>
                                <p>
                                  "Confidential Information" includes any and all information disclosed by the DISCLOSING PARTY 
                                  to the RECEIVING PARTY in any form (written, oral, electronic, visual), including without 
                                  limitation: business plans, strategies, models, designs, processes, trademarks, inventions, 
                                  financial data, forecasts, research, documentation, contacts, and any information related to 
                                  the DISCLOSING PARTY's activities.
                                </p>
                                
                                <h3 className="font-semibold">2. Obligations of the RECEIVING PARTY</h3>
                                <p>The RECEIVING PARTY shall:</p>
                                <ul className="list-disc pl-6 space-y-1">
                                  <li>Treat all Confidential Information with strict confidentiality</li>
                                  <li>Not use it for any purpose other than the agreed Purpose</li>
                                  <li>Not disclose it to third parties without prior written consent</li>
                                  <li>Take all reasonable measures to prevent unauthorized access or use</li>
                                </ul>

                                <h3 className="font-semibold">3. Duration and Survival</h3>
                                <p>
                                  The NDA shall remain effective for two (2) years. Obligations of confidentiality 
                                  survive indefinitely. Upon termination, all Confidential Information shall be 
                                  returned or securely destroyed.
                                </p>

                                <h3 className="font-semibold">4. Governing Law</h3>
                                <p>
                                  This NDA is governed by Swiss law. Any dispute shall be subject to the exclusive 
                                  jurisdiction of the courts of Geneva, Switzerland.
                                </p>
                              </div>
                            </ScrollArea>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-center">
                  <Button 
                    onClick={handleGenerateAI}
                    disabled={isGenerating}
                    className="bg-[#D97A45] hover:bg-[#D97A45]/90 px-8 py-3"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating AI Summary...
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4 mr-2" />
                        Generate AI Summary
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="edit" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-[#243D66]">Load Existing Submission</CardTitle>
                    <CardDescription>
                      Enter your Project ID and PIN to edit an existing submission
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="editId">Project ID</Label>
                      <Input
                        id="editId"
                        value={editId}
                        onChange={(e) => setEditId(e.target.value)}
                        placeholder="proj_1234567890"
                      />
                    </div>
                    <div>
                      <Label htmlFor="editPin">PIN</Label>
                      <Input
                        id="editPin"
                        type="password"
                        value={editPin}
                        onChange={(e) => setEditPin(e.target.value)}
                        placeholder="Enter 4-digit PIN"
                      />
                    </div>
                    <Button onClick={handleEditLoad} className="bg-[#D97A45] hover:bg-[#D97A45]/90">
                      <Edit className="w-4 h-4 mr-2" />
                      Load Submission
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {stage === 'review' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#243D66]">
                  Review & Edit AI-Generated Summary of "{projectData.projectName}"
                </CardTitle>
                <CardDescription>
                  Please review the AI-extracted information and make any necessary corrections
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Debug Panel */}
            {extractedText && (
              <Card className="border-blue-200 bg-blue-50/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm text-blue-800">Document Extraction Debug</CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setShowDebugInfo(!showDebugInfo)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {showDebugInfo ? 'Hide' : 'Show'} Extracted Text
                    </Button>
                  </div>
                </CardHeader>
                {showDebugInfo && (
                  <CardContent>
                    <div className="text-xs text-blue-700 mb-2">
                      This shows the first 2000 characters of text extracted from your documents:
                    </div>
                    <ScrollArea className="h-40 w-full border rounded p-3 bg-white text-sm font-mono">
                      {extractedText}
                    </ScrollArea>
                    <div className="text-xs text-blue-600 mt-2">
                      If this looks incomplete or incorrect, try uploading different document formats or check that your files contain readable text.
                    </div>
                  </CardContent>
                )}
              </Card>
            )}

            {/* Business Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Business Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Business Model</Label>
                    <Textarea
                      value={projectData.businessModel}
                      onChange={(e) => setProjectData(prev => ({ ...prev, businessModel: e.target.value }))}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>Maturity Stage</Label>
                    <Select value={projectData.maturityStage} onValueChange={(value) => setProjectData(prev => ({ ...prev, maturityStage: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {MATURITY_STAGES.map(stage => (
                          <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Region of Operation</Label>
                    <Input
                      value={projectData.region}
                      onChange={(e) => setProjectData(prev => ({ ...prev, region: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Main Country of Operations</Label>
                    <Select value={projectData.mainCountry} onValueChange={(value) => setProjectData(prev => ({ ...prev, mainCountry: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {COUNTRY_OPTIONS.map(country => (
                          <SelectItem key={country} value={country}>{country}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Impact Area</Label>
                    <Input
                      value={projectData.impactArea}
                      onChange={(e) => setProjectData(prev => ({ ...prev, impactArea: e.target.value }))}
                      placeholder="Specific impact area and focus"
                    />
                  </div>
                  <div>
                    <Label>Core Team</Label>
                    <Textarea
                      value={projectData.coreTeam}
                      onChange={(e) => setProjectData(prev => ({ ...prev, coreTeam: e.target.value }))}
                      rows={2}
                      placeholder="Leadership team and key personnel"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Key Risks</Label>
                    <Textarea
                      value={projectData.keyRisks}
                      onChange={(e) => setProjectData(prev => ({ ...prev, keyRisks: e.target.value }))}
                      rows={2}
                      placeholder="Main business and market risks"
                    />
                  </div>
                  <div>
                    <Label>Barriers to Entry</Label>
                    <Textarea
                      value={projectData.barriers}
                      onChange={(e) => setProjectData(prev => ({ ...prev, barriers: e.target.value }))}
                      rows={2}
                      placeholder="Competitive advantages and barriers"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-[#D97A45]" />
                  Financial Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Last 12 Months Revenue (USD)</Label>
                    <Input
                      type="number"
                      value={projectData.revenues}
                      onChange={(e) => setProjectData(prev => ({ ...prev, revenues: Number(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label>Breakeven Year</Label>
                    <Input
                      type="number"
                      value={projectData.breakeven}
                      onChange={(e) => setProjectData(prev => ({ ...prev, breakeven: Number(e.target.value) }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Market Size / SOM (USD)</Label>
                    <Input
                      type="number"
                      value={projectData.marketSize}
                      onChange={(e) => setProjectData(prev => ({ ...prev, marketSize: Number(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label>Expected IRR (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={projectData.expectedIRR}
                      onChange={(e) => setProjectData(prev => ({ ...prev, expectedIRR: Number(e.target.value) }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Financing Need (USD)</Label>
                    <Input
                      type="number"
                      value={projectData.financingNeed}
                      onChange={(e) => setProjectData(prev => ({ ...prev, financingNeed: Number(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label>Instrument</Label>
                    <Select value={projectData.instrument} onValueChange={(value) => setProjectData(prev => ({ ...prev, instrument: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {INSTRUMENT_OPTIONS.map(instrument => (
                          <SelectItem key={instrument} value={instrument}>{instrument}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Use of Proceeds</Label>
                  <Textarea
                    value={projectData.useOfProceeds}
                    onChange={(e) => setProjectData(prev => ({ ...prev, useOfProceeds: e.target.value }))}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Impact & Problem/Solution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-[#D97A45]" />
                  Impact & Solution
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Problem</Label>
                  <Textarea
                    value={projectData.problem}
                    onChange={(e) => setProjectData(prev => ({ ...prev, problem: e.target.value }))}
                    rows={4}
                  />
                </div>

                <div>
                  <Label>Solution</Label>
                  <Textarea
                    value={projectData.solution}
                    onChange={(e) => setProjectData(prev => ({ ...prev, solution: e.target.value }))}
                    rows={4}
                  />
                </div>

                <div>
                  <Label>Main SDGs Targeted (max 3)</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 max-h-40 overflow-y-auto">
                    {SDG_OPTIONS.map(sdg => (
                      <div key={sdg} className="flex items-center space-x-2">
                        <Checkbox
                          id={sdg}
                          checked={projectData.sdgs.includes(sdg)}
                          onCheckedChange={(checked) => {
                            if (checked && projectData.sdgs.length < 3) {
                              setProjectData(prev => ({ ...prev, sdgs: [...prev.sdgs, sdg] }))
                            } else if (!checked) {
                              setProjectData(prev => ({ ...prev, sdgs: prev.sdgs.filter(s => s !== sdg) }))
                            }
                          }}
                          disabled={!projectData.sdgs.includes(sdg) && projectData.sdgs.length >= 3}
                        />
                        <Label htmlFor={sdg} className="text-sm">{sdg}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center space-x-4">
              <Button variant="outline" onClick={() => setStage('input')}>
                Back to Edit
              </Button>
              <Button onClick={handleSubmit} className="bg-[#D97A45] hover:bg-[#D97A45]/90 px-8">
                <CheckCircle className="w-4 h-4 mr-2" />
                Confirm & Submit
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
