import {Button} from '@/core/components/ui/button'
import {Card, CardContent} from '@/core/components/ui/card'
import {Checkbox} from '@/core/components/ui/checkbox'
import {Input} from '@/core/components/ui/input'
import {Label} from '@/core/components/ui/label'
import {RadioGroup, RadioGroupItem} from '@/core/components/ui/radio-group'
import {Plus} from 'lucide-react'
import React, {useState} from 'react'

interface Project {
  id: number
  name: string
  color: ColorType
}

interface ProjectCreatorProps {
  onCreateProject: (project: Omit<Project, 'id'>) => void
  onClose: () => void
}

const colors = [
  {name: 'Grey', value: 'grey'},
  {name: 'Green', value: 'green'},
  {name: 'Blue', value: 'blue'},
  {name: 'Brown', value: 'brown'},
  {name: 'Orange', value: 'orange'},
  {name: 'Yellow', value: 'yellow'},
  {name: 'Pink', value: 'pink'},
  {name: 'Purple', value: 'purple'},
] as const

type ColorType = (typeof colors)[number]['value']

const ProjectCreator: React.FC<ProjectCreatorProps> = ({onCreateProject, onClose}) => {
  const [projectName, setProjectName] = useState('')
  const [selectedColor, setSelectedColor] = useState<ColorType>('grey')

  const handleCreate = () => {
    if (projectName.trim()) {
      onCreateProject({
        name: projectName,
        color: selectedColor,
      })
      setProjectName('')
      onClose()
    }
  }

  return (
    <Card className='w-full'>
      <CardContent className='p-4'>
        <Input
          type='text'
          placeholder='Project name'
          value={projectName}
          onChange={e => setProjectName(e.target.value)}
          className='mb-4'
        />

        <RadioGroup
          value={selectedColor}
          onValueChange={value => setSelectedColor(value as ColorType)}>
          {colors.map(color => (
            <div key={color.value} className='flex items-center space-x-2'>
              <RadioGroupItem value={color.value} id={color.value} />
              <div className='w-4 h-4 rounded' style={{backgroundColor: color.value}} />
              <Label htmlFor={color.value}>{color.name}</Label>
            </div>
          ))}
        </RadioGroup>

        <Button onClick={handleCreate} className='w-full mt-4'>
          Create
        </Button>
      </CardContent>
    </Card>
  )
}

const ProjectManagement: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([
    {id: 1, name: 'Plan', color: 'yellow'},
    {id: 2, name: 'Plan', color: 'yellow'},
  ])
  const [showProjectCreator, setShowProjectCreator] = useState(false)

  const handleCreateProject = (newProject: Omit<Project, 'id'>) => {
    setProjects([...projects, {id: Date.now(), ...newProject}])
  }

  return (
    <div>
      <div className='flex items-center justify-between mb-2'>
        <h2 className='font-semibold'>Projects</h2>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => setShowProjectCreator(!showProjectCreator)}>
          <Plus className='h-4 w-4' />
        </Button>
      </div>

      {showProjectCreator && (
        <ProjectCreator
          onCreateProject={project => {
            handleCreateProject(project)
            setShowProjectCreator(false)
          }}
          onClose={() => setShowProjectCreator(false)}
        />
      )}

      <div className='space-y-2'>
        <div className='flex items-center space-x-2'>
          <Checkbox id='all-projects' defaultChecked />
          <Label htmlFor='all-projects'>All</Label>
        </div>
        {projects.map(project => (
          <div key={project.id} className='flex items-center space-x-2'>
            <Checkbox id={`project-${project.id}`} />
            <div className='w-3 h-3 rounded' style={{backgroundColor: project.color}} />
            <Label htmlFor={`project-${project.id}`}>#{project.name}</Label>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProjectManagement
