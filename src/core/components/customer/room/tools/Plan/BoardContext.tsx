/* eslint-disable @typescript-eslint/no-explicit-any */
//eslint-disable @typescript-eslint/no-explicit-any

import {Project, projectService} from '@/core/services/plan/project'
import {Issue as BoardIssue, BoardState} from '@/core/types/board'
import {IssueStatus} from '@src/core/enums/issue-status.enum'
import {Issue as ApiIssue, issueService} from '@src/core/services/plan/issues'
import React, {createContext, useCallback, useContext, useEffect, useReducer, useState} from 'react'
import {toast} from 'sonner'

type BoardAction =
  | {type: 'SET_ISSUES'; payload: ApiIssue[]}
  | {type: 'UPDATE_ISSUE'; payload: ApiIssue}
  | {type: 'DELETE_ISSUE'; payload: string}
  | {type: 'MOVE_ISSUE'; payload: {issueId: string; newStatus: string}}
  | {type: 'ADD_ISSUE'; payload: ApiIssue}
  | {type: 'SET_SELECTED_PROJECT'; payload: Project | null}

const initialState: BoardState = {
  columns: [
    {id: IssueStatus.OPEN, title: 'To Do', issues: []},
    {id: IssueStatus.IN_PROGRESS, title: 'In Progress', issues: []},
    {id: IssueStatus.RESOLVED, title: 'Resolved', issues: []},
    {id: IssueStatus.CLOSED, title: 'Closed', issues: []},
  ],
  selectedProject: null,
}

// Simple mapper for API issues to board issues with type safety
const mapApiIssueToBoardIssue = (apiIssue: any): BoardIssue | null => {
  // Skip invalid issues
  if (!apiIssue || !apiIssue.id) {
    return null
  }

  // NOTE: We are NOT filtering out deleted issues for testing
  // if (apiIssue.deletedAt) {
  //   return null;
  // }

  // Create a properly typed board issue
  return {
    id: String(apiIssue.id),
    title: apiIssue.title || 'Untitled Issue',
    description: apiIssue.description || '',
    priority: 'medium' as const,
    status: apiIssue.status || IssueStatus.OPEN,
    assignee: apiIssue.assignee?.firstName
      ? `${apiIssue.assignee.firstName} ${apiIssue.assignee.lastName || ''}`.trim()
      : undefined,
    reporter: apiIssue.reporter?.firstName
      ? `${apiIssue.reporter.firstName} ${apiIssue.reporter.lastName || ''}`.trim()
      : undefined,
    createdAt: apiIssue.createdAt ? new Date(apiIssue.createdAt) : new Date(),
    updatedAt: apiIssue.updatedAt ? new Date(apiIssue.updatedAt) : new Date(),
    timeEstimate: apiIssue.timeEstimate || 0,
    timeSpent: apiIssue.timeSpent || 0,
    projectInfo: apiIssue.project
      ? {
          id: apiIssue.project.id,
          name: apiIssue.project.name,
        }
      : null,
    participants: Array.isArray(apiIssue.participants)
      ? apiIssue.participants.map((p: any) => ({
          id: p.id,
          name: `${p.firstName || ''} ${p.lastName || ''}`.trim(),
          email: p.email,
        }))
      : [],
    labels: apiIssue.labels || [],
  }
}

const boardReducer = (state: BoardState, action: BoardAction): BoardState => {
  switch (action.type) {
    case 'SET_SELECTED_PROJECT':
      return {
        ...state,
        selectedProject: action.payload,
      }

    case 'SET_ISSUES':
      const apiIssues = action.payload
      console.log('Setting issues to state (raw):', apiIssues)

      if (apiIssues && apiIssues.length > 0) {
        console.log('First issue object keys:', Object.keys(apiIssues[0]))
        console.log('First issue deleted status:', apiIssues[0].deletedAt)
        console.log('First issue status:', apiIssues[0].status)
      }

      // Map API issues to board issues, filtering out null values
      const validIssues = apiIssues
        .map((apiIssue: any) => mapApiIssueToBoardIssue(apiIssue))
        .filter((issue): issue is BoardIssue => issue !== null)

      console.log('Valid mapped issues:', validIssues)

      // Group issues by status
      const issuesByStatus: Record<string, BoardIssue[]> = {}

      // Initialize empty arrays for all column IDs
      state.columns.forEach(column => {
        issuesByStatus[column.id] = []
      })

      // Populate with actual issues
      validIssues.forEach(issue => {
        const status = issue.status
        if (issuesByStatus[status]) {
          issuesByStatus[status].push(issue)
        } else {
          // If status doesn't match any column, put in first column
          issuesByStatus[state.columns[0].id].push(issue)
        }
      })

      console.log('Issues by status:', issuesByStatus)

      // Create new columns with issues
      const updatedColumns = state.columns.map(column => ({
        ...column,
        issues: issuesByStatus[column.id] || [],
      }))

      return {
        ...state,
        columns: updatedColumns,
      }

    case 'UPDATE_ISSUE':
      return {
        ...state,
        columns: state.columns.map(column => ({
          ...column,
          issues:
            column.issues
              ?.map(issue =>
                issue.id === String(action.payload.id)
                  ? mapApiIssueToBoardIssue(action.payload)
                  : issue,
              )
              .filter((issue): issue is BoardIssue => issue !== null) || [],
        })),
      }

    case 'DELETE_ISSUE':
      return {
        ...state,
        columns: state.columns.map(column => ({
          ...column,
          issues: (column.issues || []).filter(issue => issue.id !== action.payload),
        })),
      }

    case 'MOVE_ISSUE':
      const {issueId, newStatus} = action.payload

      const oldColumn = state.columns.find(col =>
        (col.issues || []).some(issue => issue.id === issueId),
      )

      if (!oldColumn) {
        console.error(`Could not find column containing issue ${issueId}`)
        return state
      }

      const issue = oldColumn.issues?.find(i => i.id === issueId)

      if (!issue) {
        console.error(`Could not find issue ${issueId} in column ${oldColumn.id}`)
        return state
      }
      // Create updated issue with new status
      const updatedIssue = {
        ...issue,
        status: newStatus,
      }

      return {
        ...state,
        columns: state.columns.map(column => {
          // Remove from original column
          if (column.id === oldColumn.id) {
            return {
              ...column,
              issues: (column.issues || []).filter(i => i.id !== issueId),
            }
          }

          // Add to new column
          if (column.id === newStatus) {
            return {
              ...column,
              issues: [...(column.issues || []), updatedIssue],
            }
          }

          // Leave other columns unchanged
          return column
        }),
      }

    case 'ADD_ISSUE':
      return {
        ...state,
        columns: state.columns.map(column => ({
          ...column,
          issues:
            column.id === action.payload.status
              ? [...(column.issues || []), mapApiIssueToBoardIssue(action.payload)].filter(
                  (issue): issue is BoardIssue => issue !== null,
                )
              : column.issues || [],
        })),
      }

    default:
      return state
  }
}

interface BoardContextType {
  state: BoardState
  loadIssues: (projectId?: number) => Promise<void>
  updateIssue: (issue: ApiIssue) => Promise<void>
  deleteIssue: (issueId: string) => Promise<void>
  moveIssue: (issueId: string, newStatus: string) => Promise<void>
  addIssue: (issue: Partial<ApiIssue>) => Promise<void>
  selectProject: (project: Project) => void
  loadProjects: (roomId: number) => Promise<void>
  projects: Project[]
  isLoading: boolean
}

const BoardContext = createContext<BoardContextType | undefined>(undefined)

export const BoardProvider: React.FC<{children: React.ReactNode; roomId?: number}> = ({
  children,
  roomId,
}) => {
  const [state, dispatch] = useReducer(boardReducer, initialState)
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Function to load projects from a specific room
  const loadProjects = useCallback(
    async (roomId: number) => {
      if (!roomId) {
        console.warn('No room ID provided, cannot load projects')
        return
      }

      try {
        setIsLoading(true)
        console.log('Loading projects for room ID:', roomId)
        const data = await projectService.getProjectsByRoomId(roomId)
        console.log('Projects loaded:', data)
        setProjects(data)

        // Automatically select the first project if available
        if (data.length > 0 && !state.selectedProject) {
          selectProject(data[0])
          // Load issues for the first project
          await loadIssues(data[0].id)
        }
      } catch (error) {
        console.error('Failed to load projects:', error)
        toast.error('Failed to load projects. Please try again.')
      } finally {
        setIsLoading(false)
      }
    },
    [state.selectedProject],
  )

  // Function to select a project
  const selectProject = useCallback((project: Project) => {
    dispatch({type: 'SET_SELECTED_PROJECT', payload: project})
    // Load issues for the selected project
    loadIssues(project.id)
  }, [])

  // Load issues from the API
  const loadIssues = useCallback(
    async (projectId?: number) => {
      try {
        setIsLoading(true)
        console.log('Loading issues for project ID:', projectId || state.selectedProject?.id)

        // If no projectId is provided, use the selected project ID
        const id = projectId || state.selectedProject?.id

        if (!id) {
          console.warn('No project ID provided, cannot load issues')
          return
        }

        const apiIssues = await issueService.getIssuesByProjectId(id)
        console.log('Issues loaded from API:', apiIssues)

        // No need to filter deleted issues here, the mapper will handle it
        dispatch({type: 'SET_ISSUES', payload: apiIssues})
      } catch (error) {
        console.error('Failed to load issues:', error)
        toast.error('Failed to load issues. Please try again.')
      } finally {
        setIsLoading(false)
      }
    },
    [state.selectedProject],
  )

  // Load projects on component mount if roomId is provided
  useEffect(() => {
    if (roomId) {
      loadProjects(roomId)
    }
  }, [roomId, loadProjects])

  const updateIssue = useCallback(async (issue: ApiIssue) => {
    try {
      const updatedIssue = await issueService.updateIssue(Number(issue.id), issue)
      dispatch({type: 'UPDATE_ISSUE', payload: updatedIssue})
    } catch (error) {
      console.error('Failed to update issue:', error)
    }
  }, [])

  const deleteIssue = useCallback(async (issueId: string) => {
    try {
      await issueService.deleteIssue(Number(issueId))
      dispatch({type: 'DELETE_ISSUE', payload: issueId})
    } catch (error) {
      console.error('Failed to delete issue:', error)
    }
  }, [])

  const moveIssue = useCallback(async (issueId: string, newStatus: string) => {
    try {
      // Parse the ID and check if it's a valid number
      const numericId = parseInt(issueId, 10)
      if (isNaN(numericId)) {
        console.error(`Invalid issue ID: ${issueId} cannot be converted to a number`)
        return
      }

      // Use the specific updateIssueStatus method that targets the status endpoint
      await issueService.updateIssueStatus(numericId, newStatus)

      dispatch({type: 'MOVE_ISSUE', payload: {issueId, newStatus}})
    } catch (error) {
      console.error('Failed to move issue:', error)
    }
  }, [])

  // Add a new issue
  const addIssue = useCallback(
    async (issue: Partial<ApiIssue>) => {
      if (!state.selectedProject) {
        toast.error('No project selected. Please select a project first.')
        return
      }

      try {
        // Create the issue with required fields and projectId
        const newIssue = {
          title: issue.title || 'New Issue',
          description: issue.description || '',
          status: issue.status || IssueStatus.OPEN,
          timeEstimate: issue.timeEstimate || 0,
          timeSpent: issue.timeSpent || 0,
          projectId: state.selectedProject.id, // Use projectId to match the CreateIssue type
          participantIds: issue.participantIds || [],
          labelIds: issue.labelIds || [],
        }

        console.log('Creating issue:', newIssue)
        const createdIssue = await issueService.createIssue(newIssue)
        console.log('Issue created:', createdIssue)

        dispatch({type: 'ADD_ISSUE', payload: createdIssue})
        toast.success('Issue created successfully')
      } catch (error) {
        console.error('Failed to create issue:', error)
        toast.error('Failed to create issue. Please try again.')
      }
    },
    [state.selectedProject],
  )

  return (
    <BoardContext.Provider
      value={{
        state,
        loadIssues,
        updateIssue,
        deleteIssue,
        moveIssue,
        addIssue,
        selectProject,
        loadProjects,
        projects,
        isLoading,
      }}>
      {children}
    </BoardContext.Provider>
  )
}

export const useBoard = () => {
  const context = useContext(BoardContext)
  if (!context) {
    throw new Error('useBoard must be used within a BoardProvider')
  }
  return context
}
