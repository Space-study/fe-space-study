import {MovableCard} from '@/core/components/common/MovableCard'
import {ThemedButton} from '@/core/components/common/SquareButton'
import React, {useState} from 'react'
import {FaCheck, FaPlus} from 'react-icons/fa'

// Task interface
interface Task {
  name: string
  done: boolean
}

// TasksProps interface
interface TasksProps {
  visible: boolean
  toggleCard: () => void
}

// Tasks component
export const Tasks: React.FC<TasksProps> = ({visible, toggleCard}) => {
  const [tasks, setTasks] = useState<Task[]>([])

  const addTask = (newTask: Task) => setTasks([...tasks, newTask])
  const toggleTask = (key: number) => {
    const curTasks = [...tasks]
    curTasks[key].done = !curTasks[key].done
    setTasks(curTasks)
  }

  return (
    <MovableCard visible={visible} className='tasks' toggleCard={toggleCard}>
      {tasks.map((item, i) => (
        <TaskItem key={i} toggleTask={() => toggleTask(i)} {...item} />
      ))}
      <TaskInput addTask={addTask} />
    </MovableCard>
  )
}

// TaskItem component
interface TaskItemProps {
  name: string
  done: boolean
  toggleTask: () => void
}

export const TaskItem: React.FC<TaskItemProps> = ({name, done, toggleTask}) => (
  <div
    className={`w-full flex items-center gap-[5px] mt-2 cursor-pointer ${done ? 'checked' : ''}`}
    onClick={toggleTask}>
    <div className='h-[21px] aspect-square rounded-[5px] p-[0.1rem] bg-gray-300 text-[#ffdeb2]'>
      {done && <FaCheck />}
    </div>
    <div>{name}</div>
  </div>
)

// TaskInput component
interface TaskInputProps {
  addTask: (newTask: Task) => void
}

export const TaskInput: React.FC<TaskInputProps> = ({addTask}) => {
  const [name, setName] = useState('')

  const handleAdd = () => {
    if (name) {
      addTask({name, done: false})
      setName('')
    }
  }

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAdd()
    }
  }

  return (
    <div className='flex items-center gap-1 my-2'>
      <input
        className='p-2 w-full rounded border-none outline-none bg-white/50 transition duration-200 focus:bg-white/75'
        onKeyDown={handleEnter}
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <ThemedButton
        disabled={!name}
        onClick={handleAdd}
        className='p-[0.35rem] bg-green-500/60 transition duration-200 disabled:bg-white/50'
        icon={FaPlus}
      />
    </div>
  )
}
