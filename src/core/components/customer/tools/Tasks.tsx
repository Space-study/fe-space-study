import {MovableCard} from '@/core/components/common/MovableCard'
import {ThemedButton} from '@/core/components/common/SquareButton'
import React, {useState} from 'react'
import {FaCheck, FaPlus, FaTrash} from 'react-icons/fa'

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

  const deleteTask = (key: number) => {
    const updatedTasks = tasks.filter((_, index) => index !== key)
    setTasks(updatedTasks)
  }

  return (
    <MovableCard
      visible={visible}
      className='tasks shadow-lg rounded-lg p-4 bg-gray-50 '
      toggleCard={toggleCard}>
      <h2 className='text-xl font-semibold mb-4'>Tasks</h2>
      <div className='max-h-[500px] overflow-y-auto space-y-2'>
        {tasks.length > 0 ? (
          tasks.map((item, i) => (
            <TaskItem
              key={i}
              toggleTask={() => toggleTask(i)}
              deleteTask={() => deleteTask(i)}
              {...item}
            />
          ))
        ) : (
          <div className='text-gray-500 italic'>No tasks added yet</div>
        )}
      </div>
      <TaskInput addTask={addTask} />
    </MovableCard>
  )
}

// TaskItem component
interface TaskItemProps {
  name: string
  done: boolean
  toggleTask: () => void
  deleteTask: () => void
}

export const TaskItem: React.FC<TaskItemProps> = ({name, done, toggleTask, deleteTask}) => (
  <div
    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition duration-200 border flex-wrap ${
      done ? 'bg-green-100 border-green-400' : 'bg-white border-gray-300 hover:bg-gray-100'
    }`}
    style={{maxWidth: '400px'}}>
    <div
      className="h-[21px] aspect-square rounded-full border-2 flex items-center justify-center transition duration-200 ${
        done ? 'bg-green-400 text-white border-green-400' : 'bg-gray-200 text-gray-400 border-gray-300'
      }"
      onClick={toggleTask}>
      {done && <FaCheck />}
    </div>
    <div
      className={`flex-1 transition duration-200 ${
        done ? 'line-through text-gray-500' : 'text-gray-800'
      } break-words`}
      style={{wordWrap: 'break-word', maxWidth: '400px'}}>
      {name}
    </div>
    <button
      className='text-red-500 hover:text-red-700 transition duration-200'
      onClick={deleteTask}>
      <FaTrash />
    </button>
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
    <div className='flex flex-wrap items-center gap-2 mt-4 max-w-[400px]'>
      <input
        className='flex-1 p-2 rounded-lg border border-gray-300 bg-white shadow-sm outline-none focus:ring-2 focus:ring-green-400 transition duration-200'
        onKeyDown={handleEnter}
        value={name}
        placeholder='Enter a new task...'
        onChange={e => setName(e.target.value)}
      />
      <ThemedButton
        disabled={!name}
        onClick={handleAdd}
        className='p-2 bg-green-500 text-white rounded-lg shadow-lg transition duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-green-600'
        icon={FaPlus}
      />
    </div>
  )
}
