import {IssueLabel} from '@/core/services/plan/issues'
import {Project} from '@/core/services/plan/project'

export interface Participant {
  id: number
  name: string
  email: string
}

export interface ProjectInfo {
  id: number
  name: string
}

export interface Issue {
  id: string
  title: string
  description?: string
  priority: 'low' | 'medium' | 'high'
  status: string
  assignee?: string
  reporter?: string
  createdAt: Date
  updatedAt: Date
  timeEstimate?: number
  timeSpent?: number
  projectInfo?: ProjectInfo | null
  participants?: Participant[]
  labels?: IssueLabel[]
}

export interface Column {
  id: string
  title: string
  issues?: Issue[]
}

export interface BoardState {
  columns: Column[]
  selectedProject: Project | null
}
