import {Input} from '@/core/components/ui/input'
import {useState} from 'react'
import {toast} from 'react-hot-toast'
import TodoItem from './TodoItem'

interface Todo {
  id: number
  name: string
  completed: boolean
}

interface TodoListProps {
  minimized?: boolean
}

export default function TodoList({minimized}: TodoListProps) {
  const [task, setTask] = useState<string>('')
  const [todoList, setTodoList] = useState<Todo[]>([])

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault()
    if (task.trim()) {
      const newTodo: Todo = {
        id: Date.now(),
        name: task.trim(),
        completed: false,
      }
      setTodoList([...todoList, newTodo])
      console.log('run here')
      toast.success('Task added successfully!')
      setTask('')
    }
  }

  const handleToggleComplete = (id: number) => {
    setTodoList(prevList =>
      prevList.map(todo => (todo.id === id ? {...todo, completed: !todo.completed} : todo)),
    )
  }

  const handleDeleteTodo = (id: number) => {
    setTodoList(prevList => prevList.filter(todo => todo.id !== id))
    toast.success('Task deleted successfully!')
  }

  if (minimized) return null

  return (
    <div className='px-10 py-4 overflow-y-auto h-[30vh] text-white'>
      <h2 className='text-2xl mb-3 text-center'>📚 TO DO LIST 📜</h2>
      <form className='flex items-center' onSubmit={handleAddTodo}>
        <Input
          type='text'
          placeholder='Add a task...'
          value={task}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTask(e.target.value)}
        />
        <button type='submit' className='bg-green-700 px-2 py-1 rounded-md ml-2'>
          ADD
        </button>
      </form>
      <ul className='overflow-y-auto mt-3'>
        {todoList.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            handleToggleComplete={handleToggleComplete}
            handleDeleteTodo={handleDeleteTodo}
          />
        ))}
      </ul>
    </div>
  )
}
