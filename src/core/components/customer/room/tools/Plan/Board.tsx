// import {useOnClickOutside} from '@/core/hooks/useOnClickOutside'
import {Column} from '@src/core/types/board'
// import {Plus} from 'lucide-react'
import {Button} from '@/core/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/core/components/ui/select'
import {IssueStatus} from '@src/core/enums/issue-status.enum'
import {Loader2, Plus} from 'lucide-react'
import React, {memo, useEffect, useState} from 'react'
import {DndProvider} from 'react-dnd'
import {HTML5Backend} from 'react-dnd-html5-backend'
import {BoardColumn} from './BoardColumn'
import {useBoard} from './BoardContext'
import {CreateIssueDialog} from './CreateIssueDialog'

interface BoardProps {
  roomId?: number
}

export const Board: React.FC<BoardProps> = memo(({roomId}) => {
  // const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const {state, loadIssues, addIssue, loadProjects, projects, selectProject, isLoading} = useBoard()
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  // const modalRef = useRef<HTMLDivElement>(null)

  // useOnClickOutside(modalRef, () => setIsCreateModalOpen(false))

  // Load projects when component mounts
  useEffect(() => {
    if (roomId) {
      loadProjects(roomId)
    }
  }, [roomId, loadProjects])

  const createTestIssue = () => {
    addIssue({
      title: 'Test Issue ' + new Date().toLocaleTimeString(),
      description: 'This is a test issue created for debugging.',
      status: IssueStatus.OPEN,
      timeEstimate: 0,
      timeSpent: 0,
    })
  }

  const handleProjectChange = (projectId: string) => {
    const selectedProject = projects.find(p => p.id.toString() === projectId)
    if (selectedProject) {
      selectProject(selectedProject)
    }
  }

  const handleCreateIssue = (title: string, description: string) => {
    addIssue({
      title,
      description,
      status: IssueStatus.OPEN,
      timeEstimate: 0,
      timeSpent: 0,
    })
    setShowCreateDialog(false)
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className='p-6'>
        <div className='flex justify-between mb-4'>
          <div className='flex items-center space-x-4'>
            <h1 className='text-2xl font-bold'>Issue Board</h1>
            {isLoading && <Loader2 className='h-5 w-5 animate-spin text-gray-400' />}

            {/* Project selector */}
            <div className='min-w-[200px]'>
              <Select
                value={state.selectedProject?.id?.toString()}
                onValueChange={handleProjectChange}
                disabled={isLoading || projects.length === 0}>
                <SelectTrigger>
                  <SelectValue placeholder='Select a project' />
                </SelectTrigger>
                <SelectContent>
                  {projects.map(project => (
                    <SelectItem key={project.id} value={project.id.toString()}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className='flex gap-2'>
            {/* <Button 
              onClick={() => setShowCreateDialog(true)} 
              variant='default'
              disabled={!state.selectedProject}
            >
              <Plus className='mr-2 h-4 w-4' />
              New Issue
            </Button> */}

            <Button onClick={createTestIssue} variant='outline' disabled={!state.selectedProject}>
              <Plus className='mr-2 h-4 w-4' />
              Test Issue
            </Button>

            <Button
              onClick={() => state.selectedProject && loadIssues(state.selectedProject.id)}
              variant='outline'
              disabled={!state.selectedProject}>
              <Loader2 className='mr-2 h-4 w-4' />
              Refresh
            </Button>
          </div>
        </div>

        {!state.selectedProject && !isLoading && (
          <div className='p-8 text-center border rounded-lg bg-gray-50'>
            <p className='text-gray-500'>Please select a project to view issues</p>
          </div>
        )}

        {state.selectedProject && (
          <div className='flex space-x-4 overflow-x-auto pb-4'>
            {state.columns.map((column: Column) => (
              <BoardColumn key={column.id} column={column} />
            ))}
          </div>
        )}

        {state.selectedProject && state.columns.every(col => !col.issues?.length) && !isLoading && (
          <div className='mt-4 p-6 text-center border rounded-lg bg-gray-50'>
            <p className='text-gray-600'>No issues found in this project.</p>
            <p className='text-gray-400 text-sm mt-2'>
              Click the &quot;New Issue&quot; button to create your first issue.
            </p>
          </div>
        )}
      </div>

      {/* Create Issue Dialog */}
      {showCreateDialog && state.selectedProject && (
        <CreateIssueDialog columnId={IssueStatus.OPEN} onCreateIssue={handleCreateIssue} />
      )}
    </DndProvider>
  )
})

Board.displayName = 'Board'
