import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { type ProjectRecord } from '@/store/projectStore'
import { 
  Building2, 
  Mail, 
  Calendar, 
  Globe, 
  DollarSign,
  TrendingUp,
  Users,
  Shield,
  Target,
  AlertTriangle,
  Lightbulb,
  FileText
} from 'lucide-react'

interface ProjectDetailsViewProps {
  project: ProjectRecord
}

export default function ProjectDetailsView({ project }: ProjectDetailsViewProps) {
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`
    }
    return `$${amount.toLocaleString()}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-[#243D66]">
            <Building2 className="w-5 h-5 mr-2" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Project Name</Label>
              <p className="text-sm font-medium mt-1">{project.projectName}</p>
            </div>
            <div>
              <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Incorporation Date</Label>
              <p className="text-sm mt-1">{formatDate(project.incorporationDate)}</p>
            </div>
            <div>
              <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Contact Email</Label>
              <p className="text-sm mt-1 flex items-center">
                <Mail className="w-3 h-3 mr-1 text-slate-400" />
                {project.email}
              </p>
            </div>
            <div>
              <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Primary Sector</Label>
              <p className="text-sm mt-1">{project.sector}</p>
            </div>
            <div>
              <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Headquarters Country</Label>
              <p className="text-sm mt-1">{project.country}</p>
            </div>
            <div>
              <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Last Updated</Label>
              <p className="text-sm mt-1 flex items-center">
                <Calendar className="w-3 h-3 mr-1 text-slate-400" />
                {formatDate(project.lastUpdate)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Model & Operations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-[#243D66]">
            <Target className="w-5 h-5 mr-2" />
            Business Model & Operations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Business Model</Label>
            <p className="text-sm mt-1 leading-relaxed">{project.businessModel || 'Not specified'}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Maturity Stage</Label>
              <Badge variant="outline" className="mt-1">
                {project.maturityStage}
              </Badge>
            </div>
            <div>
              <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Region of Operation</Label>
              <p className="text-sm mt-1 flex items-center">
                <Globe className="w-3 h-3 mr-1 text-slate-400" />
                {project.region}
              </p>
            </div>
            <div>
              <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Main Country of Operations</Label>
              <p className="text-sm mt-1">{project.mainCountry}</p>
            </div>
          </div>

          <div>
            <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Impact Area</Label>
            <p className="text-sm mt-1">{project.impactArea || 'Not specified'}</p>
          </div>
        </CardContent>
      </Card>

      {/* Team & Risks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-[#243D66]">
            <Users className="w-5 h-5 mr-2" />
            Team & Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Core Team</Label>
            <p className="text-sm mt-1 leading-relaxed">{project.coreTeam || 'Not specified'}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide flex items-center">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Key Risks
              </Label>
              <p className="text-sm mt-1 leading-relaxed">{project.keyRisks || 'Not specified'}</p>
            </div>
            <div>
              <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide flex items-center">
                <Shield className="w-3 h-3 mr-1" />
                Barriers to Entry
              </Label>
              <p className="text-sm mt-1 leading-relaxed">{project.barriers || 'Not specified'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-[#243D66]">
            <DollarSign className="w-5 h-5 mr-2" />
            Financial Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-3 rounded-lg">
              <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Last 12M Revenue</Label>
              <p className="text-lg font-semibold text-[#243D66] mt-1">{formatCurrency(project.revenues)}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg">
              <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Market Size (SOM)</Label>
              <p className="text-lg font-semibold text-[#243D66] mt-1">{formatCurrency(project.marketSize)}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg">
              <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Financing Need</Label>
              <p className="text-lg font-semibold text-[#243D66] mt-1">{formatCurrency(project.financingNeed)}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg">
              <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                Expected IRR
              </Label>
              <p className="text-lg font-semibold text-[#243D66] mt-1">{project.expectedIRR.toFixed(1)}%</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Breakeven Year</Label>
              <p className="text-sm mt-1">{project.breakeven}</p>
            </div>
            <div>
              <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Instrument</Label>
              <Badge variant="secondary" className="mt-1">
                {project.instrument}
              </Badge>
            </div>
          </div>

          <div className="mt-4">
            <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Use of Proceeds</Label>
            <p className="text-sm mt-1 leading-relaxed">{project.useOfProceeds || 'Not specified'}</p>
          </div>
        </CardContent>
      </Card>

      {/* Problem & Solution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-[#243D66]">
            <Lightbulb className="w-5 h-5 mr-2" />
            Problem & Solution
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Problem Statement</Label>
            <p className="text-sm mt-1 leading-relaxed">{project.problem || 'Not specified'}</p>
          </div>
          
          <Separator />
          
          <div>
            <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Solution Approach</Label>
            <p className="text-sm mt-1 leading-relaxed">{project.solution || 'Not specified'}</p>
          </div>
        </CardContent>
      </Card>

      {/* Impact & SDGs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-[#243D66]">
            <Globe className="w-5 h-5 mr-2" />
            Impact & SDGs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Targeted SDGs</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {project.sdgs.length > 0 ? (
                project.sdgs.map((sdg, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {sdg}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-slate-500">No SDGs specified</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Status */}
      {(project.portfolio.length > 0 || project.rejected.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-[#243D66]">
              <FileText className="w-5 h-5 mr-2" />
              Portfolio Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">In Portfolio</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {project.portfolio.length > 0 ? (
                    project.portfolio.map((role) => (
                      <Badge key={role} className="bg-green-100 text-green-800">
                        {role}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">None</p>
                  )}
                </div>
              </div>
              <div>
                <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Rejected By</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {project.rejected.length > 0 ? (
                    project.rejected.map((role) => (
                      <Badge key={role} variant="destructive">
                        {role}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">None</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}