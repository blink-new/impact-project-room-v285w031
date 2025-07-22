import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Shield, Lock } from 'lucide-react'

interface AccessCodeModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (role: 'admin' | 'ncge' | 'ncgd') => void
}

const ACCESS_CODES = {
  'ADMIN2024': 'admin',
  'NCGE2024': 'ncge', 
  'NCGD2024': 'ncgd'
} as const

export default function AccessCodeModal({ isOpen, onClose, onSuccess }: AccessCodeModalProps) {
  const [accessCode, setAccessCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate validation delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    const role = ACCESS_CODES[accessCode.toUpperCase() as keyof typeof ACCESS_CODES]
    
    if (role) {
      onSuccess(role)
      onClose()
      setAccessCode('')
      toast({
        title: "Access Granted",
        description: `Welcome to the ${role === 'admin' ? 'Admin' : role.toUpperCase()} dashboard.`
      })
    } else {
      toast({
        title: "Invalid Access Code",
        description: "Please check your access code and try again.",
        variant: "destructive"
      })
    }
    
    setIsLoading(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-[#243D66] rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <DialogTitle className="text-center text-[#243D66]">
            Restricted Access
          </DialogTitle>
          <DialogDescription className="text-center">
            Enter your access code to continue to the admin or portfolio dashboard.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="accessCode">Access Code</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                id="accessCode"
                type="password"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                placeholder="Enter access code"
                className="pl-10"
                required
              />
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[#D97A45] hover:bg-[#D97A45]/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Verifying...
                </>
              ) : (
                'Access Dashboard'
              )}
            </Button>
          </div>
        </form>
        
        <div className="mt-6 p-4 bg-slate-50 rounded-lg">
          <h4 className="text-sm font-medium text-slate-700 mb-2">Access Levels:</h4>
          <ul className="text-xs text-slate-600 space-y-1">
            <li>• <strong>Admin:</strong> Full project management and analytics</li>
            <li>• <strong>NCGE:</strong> Nature Catalyst Growth Equity portfolio</li>
            <li>• <strong>NCGD:</strong> Nature Catalyst Growth Debt portfolio</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  )
}