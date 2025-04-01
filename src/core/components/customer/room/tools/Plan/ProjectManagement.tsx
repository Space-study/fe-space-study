import {Button} from '@/core/components/ui/button'
import {Card, CardContent} from '@/core/components/ui/card'
import {Checkbox} from '@/core/components/ui/checkbox'
import {Input} from '@/core/components/ui/input'
import {Label} from '@/core/components/ui/label'
import {CreateProject, Project, projectService} from '@/core/services/plan/project'
import {Check, Edit, Plus, Trash, X} from 'lucide-react'
import React, {useEffect, useState} from 'react'
import {toast} from 'sonner'

interface ProjectCreatorProps {
  onCreateProject: (project: CreateProject) => void
  onClose: () => void
  roomId: number
  userId: number
}

const ProjectCreator: React.FC<ProjectCreatorProps> = ({
  onCreateProject,
  onClose,
  roomId,
  userId,
}) => {
  const [projectName, setProjectName] = useState('')

  const handleCreate = () => {
    if (projectName.trim()) {
      onCreateProject({
        name: projectName,
        ownerId: userId,
        roomId: roomId,
      })
      setProjectName('')
    }
  }

  return (
    <Card className='w-full mb-4'>
      <CardContent className='p-4'>
        <Input
          type='text'
          placeholder='Project name'
          value={projectName}
          onChange={e => setProjectName(e.target.value)}
          className='mb-4'
        />

        <div className='flex justify-between'>
          <Button onClick={onClose} variant='outline'>
            <X className='h-4 w-4 mr-1' />
            Cancel
          </Button>
          <Button onClick={handleCreate}>
            <Check className='h-4 w-4 mr-1' />
            Create
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

interface ProjectManagementProps {
  roomId: number
  userId: number
}

const ProjectManagement: React.FC<ProjectManagementProps> = ({roomId, userId}) => {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProjects, setSelectedProjects] = useState<number[]>([])
  const [showProjectCreator, setShowProjectCreator] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [editName, setEditName] = useState('')

  // Load projects for the current room
  const loadProjects = async () => {
    if (!roomId) {
      console.error('Room ID is undefined or null')
      toast.error('Room ID is required to load projects')
      return
    }

    try {
      setIsLoading(true)
      const data = await projectService.getProjectsByRoomId(roomId)
      setProjects(data)
      setSelectedProjects(data.map(p => p.id))
    } catch (error) {
      toast.error('Failed to load projects. Please try again.')
      console.error('Failed to load projects:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (roomId) {
      loadProjects()
    }
  }, [roomId])

  const handleCreateProject = async (newProject: CreateProject) => {
    if (!roomId) {
      console.error('Room ID is undefined or null')
      toast.error('Room ID is required to create a project')
      return
    }

    try {
      setIsLoading(true)
      const createdProject = await projectService.createProject(newProject)
      setProjects([...projects, createdProject])
      setSelectedProjects([...selectedProjects, createdProject.id])
      toast.success('Your project has been created successfully.')
    } catch (error) {
      toast.error('Failed to create project. Please try again.')
      console.error('Failed to create project:', error)
    } finally {
      setIsLoading(false)
      setShowProjectCreator(false)
    }
  }

  const handleUpdateProject = async (project: Project) => {
    try {
      setIsLoading(true)
      await projectService.updateProject(project.id, {name: editName})
      setProjects(projects.map(p => (p.id === project.id ? {...p, name: editName} : p)))
      toast.success('Your project has been updated successfully.')
    } catch (error) {
      toast.error('Failed to update project. Please try again.')
      console.error('Failed to update project:', error)
    } finally {
      setIsLoading(false)
      setEditingProject(null)
    }
  }

  const handleDeleteProject = async (projectId: number) => {
    try {
      setIsLoading(true)
      await projectService.deleteProject(projectId)
      setProjects(projects.filter(p => p.id !== projectId))
      setSelectedProjects(selectedProjects.filter(id => id !== projectId))
      toast.success('Your project has been deleted successfully.')
    } catch (error) {
      toast.error('Failed to delete project. Please try again.')
      console.error('Failed to delete project:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleProject = (projectId: number, checked: boolean) => {
    if (checked) {
      setSelectedProjects([...selectedProjects, projectId])
    } else {
      setSelectedProjects(selectedProjects.filter(id => id !== projectId))
    }
  }

  const handleToggleAll = (checked: boolean) => {
    if (checked) {
      setSelectedProjects(projects.map(p => p.id))
    } else {
      setSelectedProjects([])
    }
  }

  const startEdit = (project: Project) => {
    setEditingProject(project)
    setEditName(project.name)
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between mb-2'>
        <h2 className='font-semibold'>Projects</h2>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => setShowProjectCreator(!showProjectCreator)}
          disabled={isLoading}>
          <Plus className='h-4 w-4' />
        </Button>
      </div>

      {showProjectCreator && (
        <ProjectCreator
          onCreateProject={handleCreateProject}
          onClose={() => setShowProjectCreator(false)}
          roomId={roomId}
          userId={userId}
        />
      )}

      <div className='space-y-2'>
        <div className='flex items-center space-x-2'>
          <Checkbox
            id='all-projects'
            checked={selectedProjects.length === projects.length && projects.length > 0}
            onCheckedChange={handleToggleAll}
          />
          <Label htmlFor='all-projects'>All Projects</Label>
        </div>

        {isLoading && <div className='text-sm text-muted-foreground'>Loading projects...</div>}

        {projects.length === 0 && !isLoading && (
          <div className='text-sm text-muted-foreground'>No projects found</div>
        )}

        {projects.map(project => (
          <div key={project.id} className='flex items-center space-x-2'>
            <Checkbox
              id={`project-${project.id}`}
              checked={selectedProjects.includes(project.id)}
              onCheckedChange={checked => handleToggleProject(project.id, !!checked)}
            />

            {editingProject?.id === project.id ? (
              <div className='flex-1 flex items-center space-x-2'>
                <Input
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className='h-7 py-1'
                />
                <Button
                  size='icon'
                  variant='ghost'
                  onClick={() => setEditingProject(null)}
                  className='h-6 w-6'>
                  <X className='h-3 w-3' />
                </Button>
                <Button
                  size='icon'
                  variant='ghost'
                  onClick={() => handleUpdateProject(project)}
                  className='h-6 w-6'
                  disabled={!editName.trim()}>
                  <Check className='h-3 w-3' />
                </Button>
              </div>
            ) : (
              <>
                <Label htmlFor={`project-${project.id}`} className='flex-1'>
                  {project.name}
                </Label>
                <div className='flex items-center space-x-1'>
                  <Button
                    size='icon'
                    variant='ghost'
                    onClick={() => startEdit(project)}
                    className='h-6 w-6'>
                    <Edit className='h-3 w-3' />
                  </Button>
                  <Button
                    size='icon'
                    variant='ghost'
                    onClick={() => handleDeleteProject(project.id)}
                    className='h-6 w-6'>
                    <Trash className='h-3 w-3' />
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProjectManagement
