import Icon from '@/core/components/customer/room/Icon'

interface Todo {
  id: number
  name: string
  completed: boolean
}

interface TodoItemProps {
  todo: Todo
  handleToggleComplete: (id: number) => void
  handleDeleteTodo: (id: number) => void
}

export default function TodoItem({todo, handleToggleComplete, handleDeleteTodo}: TodoItemProps) {
  return (
    <li className='flex items-center my-1' key={todo.id}>
      <button
        className='mr-2 text-lg focus:outline-none flex items-center'
        onClick={() => handleToggleComplete(todo.id)}>
        {todo.completed ? (
          <Icon className='text-green-500' name='Check-off' />
        ) : (
          <Icon className='text-white' name='Check-on' />
        )}
        <span className={`ml-2 ${todo.completed ? 'line-through' : ''}`}>{todo.name}</span>
      </button>
      <button className='ml-auto' onClick={() => handleDeleteTodo(todo.id)}>
        <Icon className='text-red-500' name='Trash' />
      </button>
    </li>
  )
}
