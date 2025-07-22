import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ProjectRecord {
  id: string
  projectName: string
  incorporationDate: string
  sector: string
  country: string
  email: string
  
  // AI-extracted fields
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
  
  // System fields
  status: string
  lastUpdate: string
  entrepreneurPending: boolean
  portfolio: string[] // ['NCGE', 'NCGD']
  rejected: string[] // ['NCGE', 'NCGD']
  
  // Credentials for editing
  pin?: string
}

interface ProjectStore {
  projects: ProjectRecord[]
  addProject: (project: Omit<ProjectRecord, 'id' | 'lastUpdate' | 'entrepreneurPending' | 'portfolio' | 'rejected'>) => string
  updateProject: (id: string, updates: Partial<ProjectRecord>) => void
  getProject: (id: string) => ProjectRecord | undefined
  getProjectByCredentials: (id: string, pin: string) => ProjectRecord | undefined
  updateProjectStatus: (id: string, status: string) => void
  deleteProject: (id: string) => void
  setPortfolioMembership: (id: string, role: 'NCGE' | 'NCGD', action: 'add' | 'reject' | 'reconsider') => void
  getProjectsForRole: (role: 'admin' | 'NCGE' | 'NCGD') => ProjectRecord[]
}

// Start with empty projects - no mock data
const generateMockProjects = (): ProjectRecord[] => {
  return []
}

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      projects: generateMockProjects(),
      
      addProject: (projectData) => {
        const id = `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        const pin = Math.floor(1000 + Math.random() * 9000).toString()
        
        const newProject: ProjectRecord = {
          ...projectData,
          id,
          pin,
          status: 'Identified',
          lastUpdate: new Date().toISOString(),
          entrepreneurPending: false,
          portfolio: [],
          rejected: []
        }
        
        set((state) => ({
          projects: [...state.projects, newProject]
        }))
        
        return id
      },
      
      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map(project =>
            project.id === id
              ? { 
                  ...project, 
                  ...updates, 
                  lastUpdate: new Date().toISOString(),
                  entrepreneurPending: updates.entrepreneurPending ?? true
                }
              : project
          )
        }))
      },
      
      getProject: (id) => {
        return get().projects.find(project => project.id === id)
      },
      
      getProjectByCredentials: (id, pin) => {
        const project = get().projects.find(project => project.id === id)
        return project && project.pin === pin ? project : undefined
      },
      
      updateProjectStatus: (id, status) => {
        set((state) => ({
          projects: state.projects.map(project =>
            project.id === id
              ? { ...project, status, lastUpdate: new Date().toISOString() }
              : project
          )
        }))
      },
      
      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter(project => project.id !== id)
        }))
      },
      
      setPortfolioMembership: (id, role, action) => {
        set((state) => ({
          projects: state.projects.map(project => {
            if (project.id !== id) return project
            
            let newPortfolio = [...project.portfolio]
            let newRejected = [...project.rejected]
            
            if (action === 'add') {
              if (!newPortfolio.includes(role)) {
                newPortfolio.push(role)
              }
              newRejected = newRejected.filter(r => r !== role)
            } else if (action === 'reject') {
              if (!newRejected.includes(role)) {
                newRejected.push(role)
              }
              newPortfolio = newPortfolio.filter(p => p !== role)
            } else if (action === 'reconsider') {
              newRejected = newRejected.filter(r => r !== role)
            }
            
            return {
              ...project,
              portfolio: newPortfolio,
              rejected: newRejected,
              lastUpdate: new Date().toISOString()
            }
          })
        }))
      },
      
      getProjectsForRole: (role) => {
        const projects = get().projects
        
        if (role === 'admin') {
          return projects
        }
        
        // For portfolio roles, return all projects for classification
        return projects
      }
    }),
    {
      name: 'impact-project-store',
      version: 1
    }
  )
)