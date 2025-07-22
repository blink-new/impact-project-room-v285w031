import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Separator } from '@/components/ui/separator'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { useToast } from '@/hooks/use-toast'
import { useProjectStore, type ProjectRecord } from '@/store/projectStore'
import ProjectDetailsView from '@/components/ProjectDetailsView'
import { 
  Building2, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  ChevronDown, 
  ChevronRight,
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Globe,
  FileText,
  Calendar,
  AlertCircle,
  Trash2
} from 'lucide-react'

const REVIEW_STAGES = [
  'Identified', 'Intro call', 'NDA and Deck', 'Financials', '4-pager',
  'IC1', 'IC2', 'Local DD', 'Raised', 'Operating', 'Exited', 'Bankrupt'
]

const STATUS_COLORS = {
  'Identified': '#deebf7',
  'Intro call': '#c6dbef',
  'NDA and Deck': '#9ecae1',
  'Financials': '#6baed6',
  '4-pager': '#4292c6',
  'IC1': '#2171b5',
  'IC2': '#08519c',
  'Local DD': '#084594',
  'Raised': '#2171b5',
  'Operating': '#08519c',
  'Exited': '#041f4a',
  'Bankrupt': '#020f1f'
}

const SECTOR_OPTIONS = [
  'Agriculture', 'Air', 'Biodiversity & ecosystems', 'Climate', 'Diversity & inclusion',
  'Education', 'Employment / Livelihoods creation', 'Energy', 'Financial services',
  'Health', 'Infrastructure', 'Land', 'Oceans & coastal zones', 'Sustainable cities',
  'Sustainable consumption & production', 'Sustainable tourism', 'Water Treatment', 'Other'
]

const REGION_OPTIONS = ['Global', 'Western Economies', 'Africa', 'Asia', 'SEA', 'Latam']
const MATURITY_STAGES = ['Ideation', 'Validation', 'Pilot', 'Growth', 'Scale', 'Mature']

export default function AdminDashboard() {
  const { projects, updateProjectStatus, deleteProject } = useProjectStore()
  const [expandedProject, setExpandedProject] = useState<string | null>(null)
  const [filterLogic, setFilterLogic] = useState<'AND' | 'OR'>('AND')
  const [filters, setFilters] = useState({
    sector: '',
    region: '',
    status: '',
    maturityStage: '',
    country: '',
    mainCountry: '',
    instrument: '',
    impactArea: '',
    businessModel: '',
    minRevenue: '',
    maxRevenue: '',
    minIRR: '',
    maxIRR: '',
    minFinancing: '',
    maxFinancing: '',
    minMarketSize: '',
    maxMarketSize: '',
    minBreakeven: '',
    maxBreakeven: '',
    portfolio: '',
    rejected: '',
    sdgs: '',
    email: '',
    projectName: ''
  })
  const { toast } = useToast()

  // Filter projects based on current filters
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const conditions: boolean[] = []

      // Text filters
      if (filters.projectName) {
        conditions.push(project.projectName.toLowerCase().includes(filters.projectName.toLowerCase()))
      }
      if (filters.email) {
        conditions.push(project.email.toLowerCase().includes(filters.email.toLowerCase()))
      }
      if (filters.businessModel) {
        conditions.push(project.businessModel.toLowerCase().includes(filters.businessModel.toLowerCase()))
      }
      if (filters.impactArea) {
        conditions.push(project.impactArea.toLowerCase().includes(filters.impactArea.toLowerCase()))
      }

      // Dropdown filters
      if (filters.sector) {
        conditions.push(project.sector === filters.sector)
      }
      if (filters.region) {
        conditions.push(project.region === filters.region)
      }
      if (filters.status) {
        conditions.push(project.status === filters.status)
      }
      if (filters.maturityStage) {
        conditions.push(project.maturityStage === filters.maturityStage)
      }
      if (filters.country) {
        conditions.push(project.country === filters.country)
      }
      if (filters.mainCountry) {
        conditions.push(project.mainCountry === filters.mainCountry)
      }
      if (filters.instrument) {
        conditions.push(project.instrument === filters.instrument)
      }

      // Portfolio filters
      if (filters.portfolio) {
        conditions.push(project.portfolio.includes(filters.portfolio))
      }
      if (filters.rejected) {
        conditions.push(project.rejected.includes(filters.rejected))
      }

      // SDG filter
      if (filters.sdgs) {
        conditions.push(project.sdgs.some(sdg => sdg.toLowerCase().includes(filters.sdgs.toLowerCase())))
      }

      // Numeric range filters
      if (filters.minRevenue) {
        conditions.push(project.revenues >= Number(filters.minRevenue))
      }
      if (filters.maxRevenue) {
        conditions.push(project.revenues <= Number(filters.maxRevenue))
      }
      if (filters.minIRR) {
        conditions.push(project.expectedIRR >= Number(filters.minIRR))
      }
      if (filters.maxIRR) {
        conditions.push(project.expectedIRR <= Number(filters.maxIRR))
      }
      if (filters.minFinancing) {
        conditions.push(project.financingNeed >= Number(filters.minFinancing))
      }
      if (filters.maxFinancing) {
        conditions.push(project.financingNeed <= Number(filters.maxFinancing))
      }
      if (filters.minMarketSize) {
        conditions.push(project.marketSize >= Number(filters.minMarketSize))
      }
      if (filters.maxMarketSize) {
        conditions.push(project.marketSize <= Number(filters.maxMarketSize))
      }
      if (filters.minBreakeven) {
        conditions.push(project.breakeven >= Number(filters.minBreakeven))
      }
      if (filters.maxBreakeven) {
        conditions.push(project.breakeven <= Number(filters.maxBreakeven))
      }

      // Apply filter logic
      if (conditions.length === 0) return true
      return filterLogic === 'AND' ? conditions.every(Boolean) : conditions.some(Boolean)
    })
  }, [projects, filters, filterLogic])

  const clearFilters = () => {
    setFilters({
      sector: '',
      region: '',
      status: '',
      maturityStage: '',
      country: '',
      mainCountry: '',
      instrument: '',
      impactArea: '',
      businessModel: '',
      minRevenue: '',
      maxRevenue: '',
      minIRR: '',
      maxIRR: '',
      minFinancing: '',
      maxFinancing: '',
      minMarketSize: '',
      maxMarketSize: '',
      minBreakeven: '',
      maxBreakeven: '',
      portfolio: '',
      rejected: '',
      sdgs: '',
      email: '',
      projectName: ''
    })
  }

  const handleStatusUpdate = (projectId: string, newStatus: string) => {
    updateProjectStatus(projectId, newStatus)
    toast({
      title: "Status Updated",
      description: `Project status changed to ${newStatus}`
    })
  }

  const handleDeleteProject = (projectId: string, projectName: string) => {
    deleteProject(projectId)
    setExpandedProject(null)
    toast({
      title: "Project Deleted",
      description: `"${projectName}" has been permanently deleted from the system.`,
      variant: "destructive"
    })
  }

  const exportToCSV = () => {
    if (filteredProjects.length === 0) {
      toast({
        title: "No Data to Export",
        description: "Please ensure there are projects to export",
        variant: "destructive"
      })
      return
    }

    const headers = [
      'Project Name', 'Incorporation Date', 'Sector', 'Country', 'Region', 'Main Country',
      'Status', 'Maturity Stage', 'Business Model', 'Impact Area', 'Core Team',
      'Revenue (USD)', 'IRR (%)', 'Financing Need (USD)', 'Market Size (USD)', 'Breakeven Year',
      'Instrument', 'Use of Proceeds', 'Key Risks', 'Barriers', 'Problem', 'Solution',
      'SDGs', 'Email', 'Last Update', 'Portfolio', 'Rejected'
    ]

    const csvRows = [
      headers.join(','),
      ...filteredProjects.map(p => [
        `"${(p.projectName || '').replace(/"/g, '""')}"`,
        p.incorporationDate || '',
        p.sector || '',
        p.country || '',
        p.region || '',
        p.mainCountry || '',
        p.status || '',
        p.maturityStage || '',
        `"${(p.businessModel || '').replace(/"/g, '""')}"`,
        `"${(p.impactArea || '').replace(/"/g, '""')}"`,
        `"${(p.coreTeam || '').replace(/"/g, '""')}"`,
        p.revenues || 0,
        (p.expectedIRR || 0).toFixed(1),
        p.financingNeed || 0,
        p.marketSize || 0,
        p.breakeven || '',
        p.instrument || '',
        `"${(p.useOfProceeds || '').replace(/"/g, '""')}"`,
        `"${(p.keyRisks || '').replace(/"/g, '""')}"`,
        `"${(p.barriers || '').replace(/"/g, '""')}"`,
        `"${(p.problem || '').replace(/"/g, '""')}"`,
        `"${(p.solution || '').replace(/"/g, '""')}"`,
        `"${(p.sdgs || []).join('; ')}"`,
        p.email || '',
        new Date(p.lastUpdate).toLocaleDateString(),
        `"${(p.portfolio || []).join('; ')}"`,
        `"${(p.rejected || []).join('; ')}"`,
      ].join(','))
    ]

    const csvContent = csvRows.join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `impact_projects_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    toast({
      title: "Export Complete",
      description: `Successfully exported ${filteredProjects.length} projects to CSV`
    })
  }

  // Calculate metrics
  const totalProjects = filteredProjects.length
  const avgRevenue = filteredProjects.reduce((sum, p) => sum + p.revenues, 0) / totalProjects || 0
  const medianIRR = filteredProjects.sort((a, b) => a.expectedIRR - b.expectedIRR)[Math.floor(totalProjects / 2)]?.expectedIRR || 0
  const pendingEdits = filteredProjects.filter(p => p.entrepreneurPending).length
  const uniqueSectors = new Set(filteredProjects.map(p => p.sector)).size
  const totalFinancingNeed = filteredProjects.reduce((sum, p) => sum + p.financingNeed, 0)

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
              <h1 className="text-2xl font-bold text-[#243D66]">Admin Dashboard</h1>
              <p className="text-slate-600">Impact Project Room Management</p>
            </div>
          </div>
          
          <Button onClick={exportToCSV} className="bg-[#D97A45] hover:bg-[#D97A45]/90">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <Users className="h-4 w-4 text-[#D97A45]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#243D66]">{totalProjects}</div>
              <p className="text-xs text-slate-600">
                {pendingEdits > 0 && (
                  <span className="text-amber-600">
                    <AlertCircle className="w-3 h-3 inline mr-1" />
                    {pendingEdits} pending edits
                  </span>
                )}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-[#D97A45]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#243D66]">
                ${(avgRevenue / 1000).toFixed(0)}K
              </div>
              <p className="text-xs text-slate-600">Last 12 months</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Median IRR</CardTitle>
              <TrendingUp className="h-4 w-4 text-[#D97A45]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#243D66]">{medianIRR.toFixed(1)}%</div>
              <p className="text-xs text-slate-600">Expected returns</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unique Sectors</CardTitle>
              <Globe className="h-4 w-4 text-[#D97A45]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#243D66]">{uniqueSectors}</div>
              <p className="text-xs text-slate-600">Impact areas</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center text-[#243D66]">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Filter Logic</Label>
                <Select value={filterLogic} onValueChange={(value: 'AND' | 'OR') => setFilterLogic(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AND">AND</SelectItem>
                    <SelectItem value="OR">OR</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div>
                <Label>Sector</Label>
                <Select value={filters.sector || 'all'} onValueChange={(value) => setFilters(prev => ({ ...prev, sector: value === 'all' ? '' : value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="All sectors" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All sectors</SelectItem>
                    {SECTOR_OPTIONS.map(sector => (
                      <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Region</Label>
                <Select value={filters.region || 'all'} onValueChange={(value) => setFilters(prev => ({ ...prev, region: value === 'all' ? '' : value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="All regions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All regions</SelectItem>
                    {REGION_OPTIONS.map(region => (
                      <SelectItem key={region} value={region}>{region}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Status</Label>
                <Select value={filters.status || 'all'} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value === 'all' ? '' : value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    {REVIEW_STAGES.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Maturity Stage</Label>
                <Select value={filters.maturityStage || 'all'} onValueChange={(value) => setFilters(prev => ({ ...prev, maturityStage: value === 'all' ? '' : value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="All stages" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All stages</SelectItem>
                    {MATURITY_STAGES.map(stage => (
                      <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div>
                <Label>Project Name</Label>
                <Input
                  placeholder="Search project name..."
                  value={filters.projectName}
                  onChange={(e) => setFilters(prev => ({ ...prev, projectName: e.target.value }))}
                />
              </div>

              <div>
                <Label>Email</Label>
                <Input
                  placeholder="Search email..."
                  value={filters.email}
                  onChange={(e) => setFilters(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <div>
                <Label>Impact Area</Label>
                <Input
                  placeholder="Search impact area..."
                  value={filters.impactArea}
                  onChange={(e) => setFilters(prev => ({ ...prev, impactArea: e.target.value }))}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Revenue Range (USD)</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Min"
                    type="number"
                    value={filters.minRevenue}
                    onChange={(e) => setFilters(prev => ({ ...prev, minRevenue: e.target.value }))}
                  />
                  <Input
                    placeholder="Max"
                    type="number"
                    value={filters.maxRevenue}
                    onChange={(e) => setFilters(prev => ({ ...prev, maxRevenue: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>IRR Range (%)</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Min"
                    type="number"
                    value={filters.minIRR}
                    onChange={(e) => setFilters(prev => ({ ...prev, minIRR: e.target.value }))}
                  />
                  <Input
                    placeholder="Max"
                    type="number"
                    value={filters.maxIRR}
                    onChange={(e) => setFilters(prev => ({ ...prev, maxIRR: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Financing Need Range (USD)</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Min"
                    type="number"
                    value={filters.minFinancing}
                    onChange={(e) => setFilters(prev => ({ ...prev, minFinancing: e.target.value }))}
                  />
                  <Input
                    placeholder="Max"
                    type="number"
                    value={filters.maxFinancing}
                    onChange={(e) => setFilters(prev => ({ ...prev, maxFinancing: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Market Size Range (USD)</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Min"
                    type="number"
                    value={filters.minMarketSize}
                    onChange={(e) => setFilters(prev => ({ ...prev, minMarketSize: e.target.value }))}
                  />
                  <Input
                    placeholder="Max"
                    type="number"
                    value={filters.maxMarketSize}
                    onChange={(e) => setFilters(prev => ({ ...prev, maxMarketSize: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Breakeven Year Range</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Min"
                    type="number"
                    value={filters.minBreakeven}
                    onChange={(e) => setFilters(prev => ({ ...prev, minBreakeven: e.target.value }))}
                  />
                  <Input
                    placeholder="Max"
                    type="number"
                    value={filters.maxBreakeven}
                    onChange={(e) => setFilters(prev => ({ ...prev, maxBreakeven: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <Button onClick={clearFilters} variant="outline" size="sm" className="w-full">
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Projects Table */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="text-[#243D66]">Projects ({filteredProjects.length})</CardTitle>
              <CardDescription>
                Manage and review submitted impact projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredProjects.map((project) => (
                  <Collapsible
                    key={project.id}
                    open={expandedProject === project.id}
                    onOpenChange={(open) => setExpandedProject(open ? project.id : null)}
                  >
                    <CollapsibleTrigger asChild>
                      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 cursor-pointer">
                        <div className="flex items-center space-x-4">
                          {expandedProject === project.id ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-medium text-[#243D66]">{project.projectName}</h3>
                              {project.entrepreneurPending && (
                                <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                                  <AlertCircle className="w-3 h-3 mr-1" />
                                  Pending
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-slate-600">
                              {project.sector} • {project.country} • {project.region}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge 
                            style={{ 
                              backgroundColor: STATUS_COLORS[project.status] || '#f1f5f9',
                              color: '#1e293b'
                            }}
                          >
                            {project.status}
                          </Badge>
                          <div className="text-right text-sm">
                            <div className="font-medium">${(project.revenues / 1000).toFixed(0)}K</div>
                            <div className="text-slate-500">{project.expectedIRR.toFixed(1)}% IRR</div>
                          </div>
                        </div>
                      </div>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent>
                      <div className="border-t bg-slate-50 p-6">
                        {/* Status Update Controls */}
                        <div className="flex items-center justify-between mb-6 pb-4 border-b">
                          <div className="flex items-center space-x-2">
                            <Label className="text-sm font-medium">Update Status:</Label>
                            <Select 
                              value={project.status} 
                              onValueChange={(value) => handleStatusUpdate(project.id, value)}
                            >
                              <SelectTrigger className="w-40">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {REVIEW_STAGES.map(stage => (
                                  <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4 mr-1" />
                              Edit Project
                            </Button>
                            <Button variant="outline" size="sm">
                              <FileText className="w-4 h-4 mr-1" />
                              Documents
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                  <Trash2 className="w-4 h-4 mr-1" />
                                  Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Project</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to permanently delete "{project.projectName}"? 
                                    This action cannot be undone and will remove all project data from the system.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDeleteProject(project.id, project.projectName)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete Project
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>

                        {/* Comprehensive Project Details */}
                        <ProjectDetailsView project={project} />
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}

                {filteredProjects.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-600 mb-2">No projects found</h3>
                    <p className="text-slate-500">Try adjusting your filters or check back later for new submissions.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}