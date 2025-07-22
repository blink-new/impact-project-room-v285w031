import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { useToast } from '@/hooks/use-toast'
import { useProjectStore, type ProjectRecord } from '@/store/projectStore'
import ProjectDetailsView from '@/components/ProjectDetailsView'
import { 
  Building2, 
  Plus, 
  X, 
  RotateCcw,
  ChevronDown, 
  ChevronRight,
  TrendingUp,
  DollarSign,
  Globe,
  Users,
  BarChart3,
  PieChart
} from 'lucide-react'



interface PortfolioDashboardProps {
  role: 'ncge' | 'ncgd'
}

export default function PortfolioDashboard({ role }: PortfolioDashboardProps) {
  const { projects, setPortfolioMembership } = useProjectStore()
  const [expandedProject, setExpandedProject] = useState<string | null>(null)
  const { toast } = useToast()

  const roleTitle = role === 'ncge' ? 'Nature Catalyst Growth Equity' : 'Nature Catalyst Growth Debt'
  const roleTag = role === 'ncge' ? 'NCGE' : 'NCGD'

  // Categorize projects based on portfolio membership
  const unclassified = useMemo(() => 
    projects.filter(p => !p.portfolio.includes(roleTag) && !p.rejected.includes(roleTag)),
    [projects, roleTag]
  )

  const portfolio = useMemo(() => 
    projects.filter(p => p.portfolio.includes(roleTag)),
    [projects, roleTag]
  )

  const rejected = useMemo(() => 
    projects.filter(p => p.rejected.includes(roleTag)),
    [projects, roleTag]
  )

  const addToPortfolio = (project: ProjectRecord) => {
    setPortfolioMembership(project.id, roleTag, 'add')
    
    toast({
      title: "Added to Portfolio",
      description: `${project.projectName} has been added to your portfolio.`
    })
  }

  const rejectProject = (project: ProjectRecord) => {
    setPortfolioMembership(project.id, roleTag, 'reject')
    
    toast({
      title: "Project Rejected",
      description: `${project.projectName} has been moved to rejected.`,
      variant: "destructive"
    })
  }

  const reconsiderProject = (project: ProjectRecord) => {
    setPortfolioMembership(project.id, roleTag, 'reconsider')
    
    toast({
      title: "Project Reconsidered",
      description: `${project.projectName} has been moved back to unclassified.`
    })
  }

  const ProjectCard = ({ project, actions }: { project: ProjectRecord, actions: React.ReactNode }) => (
    <Collapsible
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
              <h3 className="font-medium text-[#243D66]">{project.projectName}</h3>
              <p className="text-sm text-slate-600">
                {project.sector} • {project.country} • {project.region}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline">{project.status}</Badge>
            <div className="text-right text-sm">
              <div className="font-medium">${(project.revenues / 1000).toFixed(0)}K</div>
              <div className="text-slate-500">{project.expectedIRR.toFixed(1)}% IRR</div>
            </div>
          </div>
        </div>
      </CollapsibleTrigger>
      
      <CollapsibleContent>
        <div className="border-t bg-slate-50 p-6">
          {/* Actions */}
          <div className="flex justify-end mb-6 pb-4 border-b">
            {actions}
          </div>

          {/* Comprehensive Project Details */}
          <ProjectDetailsView project={project} />
        </div>
      </CollapsibleContent>
    </Collapsible>
  )

  // Calculate portfolio metrics
  const totalPortfolioValue = portfolio.reduce((sum, p) => sum + p.financingNeed, 0)
  const avgIRR = portfolio.reduce((sum, p) => sum + p.expectedIRR, 0) / portfolio.length || 0
  const totalRevenue = portfolio.reduce((sum, p) => sum + p.revenues, 0)
  const uniqueSectors = new Set(portfolio.map(p => p.sector)).size

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
              <h1 className="text-2xl font-bold text-[#243D66]">{roleTitle}</h1>
              <p className="text-slate-600">Portfolio Dashboard</p>
            </div>
          </div>
          
          <Badge variant="secondary" className="bg-[#D97A45]/10 text-[#D97A45] border-[#D97A45]/20">
            {roleTag}
          </Badge>
        </div>

        <Tabs defaultValue="unclassified" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="unclassified" className="relative">
              🆕 Unclassified
              {unclassified.length > 0 && (
                <Badge className="ml-2 bg-[#D97A45] text-white text-xs">
                  {unclassified.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="relative">
              📂 Portfolio
              {portfolio.length > 0 && (
                <Badge className="ml-2 bg-green-600 text-white text-xs">
                  {portfolio.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="rejected" className="relative">
              🚫 Rejected
              {rejected.length > 0 && (
                <Badge className="ml-2 bg-red-600 text-white text-xs">
                  {rejected.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Unclassified Tab */}
          <TabsContent value="unclassified" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#243D66]">
                  Unclassified Projects ({unclassified.length})
                </CardTitle>
                <CardDescription>
                  Review and classify projects for your portfolio. Add promising projects or reject those that don't fit.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {unclassified.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-600 mb-2">All projects classified</h3>
                    <p className="text-slate-500">Great job! All projects have been reviewed and classified.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {unclassified.map((project) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        actions={
                          <div className="flex space-x-2">
                            <Button
                              onClick={() => addToPortfolio(project)}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Add to Portfolio
                            </Button>
                            <Button
                              onClick={() => rejectProject(project)}
                              variant="destructive"
                              size="sm"
                            >
                              <X className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        }
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="space-y-6">
            {/* Portfolio Metrics */}
            {portfolio.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Portfolio</CardTitle>
                    <BarChart3 className="h-4 w-4 text-[#D97A45]" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-[#243D66]">{portfolio.length}</div>
                    <p className="text-xs text-slate-600">Active projects</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
                    <DollarSign className="h-4 w-4 text-[#D97A45]" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-[#243D66]">
                      ${(totalPortfolioValue / 1000000).toFixed(1)}M
                    </div>
                    <p className="text-xs text-slate-600">Total financing need</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg IRR</CardTitle>
                    <TrendingUp className="h-4 w-4 text-[#D97A45]" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-[#243D66]">{avgIRR.toFixed(1)}%</div>
                    <p className="text-xs text-slate-600">Expected returns</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Sectors</CardTitle>
                    <PieChart className="h-4 w-4 text-[#D97A45]" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-[#243D66]">{uniqueSectors}</div>
                    <p className="text-xs text-slate-600">Unique sectors</p>
                  </CardContent>
                </Card>
              </div>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-[#243D66]">
                  My Portfolio ({portfolio.length})
                </CardTitle>
                <CardDescription>
                  Projects you've added to your portfolio for investment consideration.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {portfolio.length === 0 ? (
                  <div className="text-center py-12">
                    <Building2 className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-600 mb-2">No projects in portfolio</h3>
                    <p className="text-slate-500">Start by reviewing unclassified projects and adding promising ones to your portfolio.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {portfolio.map((project) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        actions={
                          <Button
                            onClick={() => rejectProject(project)}
                            variant="destructive"
                            size="sm"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Remove from Portfolio
                          </Button>
                        }
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rejected Tab */}
          <TabsContent value="rejected" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#243D66]">
                  Rejected Projects ({rejected.length})
                </CardTitle>
                <CardDescription>
                  Projects that didn't meet your investment criteria. You can reconsider them later.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {rejected.length === 0 ? (
                  <div className="text-center py-12">
                    <Globe className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-600 mb-2">No rejected projects</h3>
                    <p className="text-slate-500">Projects you reject will appear here for future reconsideration.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {rejected.map((project) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        actions={
                          <Button
                            onClick={() => reconsiderProject(project)}
                            variant="outline"
                            size="sm"
                          >
                            <RotateCcw className="w-4 h-4 mr-1" />
                            Reconsider
                          </Button>
                        }
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}