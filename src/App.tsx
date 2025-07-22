import { useState } from 'react'
import { Toaster } from '@/components/ui/toaster'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Building2, Users, FileText, BarChart3, Shield, Upload } from 'lucide-react'
import EntrepreneurDashboard from '@/pages/EntrepreneurDashboard'
import AdminDashboard from '@/pages/AdminDashboard'
import PortfolioDashboard from '@/pages/PortfolioDashboard'
import LandingPage from '@/pages/LandingPage'
import AccessCodeModal from '@/components/AccessCodeModal'

type UserRole = 'entrepreneur' | 'admin' | 'ncge' | 'ncgd' | null
type AppView = 'kickimpact-landing' | 'project-room' | 'dashboard'

function App() {
  const [currentView, setCurrentView] = useState<AppView>('kickimpact-landing')
  const [userRole, setUserRole] = useState<UserRole>(null)
  const [showAccessModal, setShowAccessModal] = useState(false)

  // Show KickImpact landing page first
  if (currentView === 'kickimpact-landing') {
    return <LandingPage onNavigateToProjectRoom={() => setCurrentView('project-room')} />
  }

  // Show role-specific dashboards
  if (currentView === 'dashboard') {
    const navigateToHome = () => setCurrentView('kickimpact-landing')
    
    if (userRole === 'admin') {
      return <AdminDashboard onNavigateToHome={navigateToHome} />
    }

    if (userRole === 'ncge' || userRole === 'ncgd') {
      return <PortfolioDashboard role={userRole} onNavigateToHome={navigateToHome} />
    }

    if (userRole === 'entrepreneur') {
      return <EntrepreneurDashboard onNavigateToHome={navigateToHome} />
    }
  }

  // Project Room landing page with role selection
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-[#D97A45] rounded-2xl flex items-center justify-center">
              <Building2 className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-[#243D66] mb-4">
            Impact Project Room
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            A comprehensive platform for entrepreneurs to submit confidential project documents, 
            with AI-powered data extraction and portfolio management capabilities.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-[#D97A45]/10 rounded-lg flex items-center justify-center mb-4">
                <Upload className="w-6 h-6 text-[#D97A45]" />
              </div>
              <CardTitle className="text-[#243D66]">Secure Submission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Upload confidential documents with NDA protection and secure processing.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-[#D97A45]/10 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-[#D97A45]" />
              </div>
              <CardTitle className="text-[#243D66]">AI-Powered Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                GPT-4 extracts structured data from your documents automatically.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-[#D97A45]/10 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-[#D97A45]" />
              </div>
              <CardTitle className="text-[#243D66]">Portfolio Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Advanced analytics and portfolio tracking for investment decisions.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Role Selection */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-[#243D66] text-center mb-8">
            Choose Your Access Level
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Entrepreneur Access */}
            <Card className="border-2 border-transparent hover:border-[#D97A45] transition-colors cursor-pointer"
                  onClick={() => {
                    setUserRole('entrepreneur')
                    setCurrentView('dashboard')
                  }}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#D97A45] rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-[#243D66]">Entrepreneur</CardTitle>
                      <CardDescription>Submit and manage your projects</CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary">Public</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>• Submit new project proposals</li>
                  <li>• Edit existing submissions</li>
                  <li>• Track review status</li>
                  <li>• Secure document upload</li>
                </ul>
                <Button className="w-full mt-4 bg-[#D97A45] hover:bg-[#D97A45]/90">
                  Access Entrepreneur Portal
                </Button>
              </CardContent>
            </Card>

            {/* Admin/Portfolio Access */}
            <Card className="border-2 border-transparent hover:border-[#D97A45] transition-colors cursor-pointer"
                  onClick={() => setShowAccessModal(true)}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#243D66] rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-[#243D66]">Admin & Portfolio</CardTitle>
                      <CardDescription>Restricted access with access code</CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline">Restricted</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>• Admin Dashboard (full management)</li>
                  <li>• NCGE Portfolio (equity investments)</li>
                  <li>• NCGD Portfolio (debt investments)</li>
                  <li>• Advanced analytics & filtering</li>
                </ul>
                <Button className="w-full mt-4 bg-[#243D66] hover:bg-[#243D66]/90">
                  Enter Access Code
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Back to KickImpact */}
        <div className="text-center mt-16 pt-8 border-t border-slate-200">
          <button
            onClick={() => setCurrentView('kickimpact-landing')}
            className="text-[#D97A45] hover:text-[#D97A45]/80 transition-colors mb-4"
          >
            ← Back to KickImpact Home
          </button>
          <p className="text-slate-500">
            Powered by AI • Secure by Design • Built for Impact
          </p>
        </div>
      </div>
      
      <AccessCodeModal
        isOpen={showAccessModal}
        onClose={() => setShowAccessModal(false)}
        onSuccess={(role) => {
          setUserRole(role)
          setCurrentView('dashboard')
        }}
      />
      
      <Toaster />
    </div>
  )
}

export default App