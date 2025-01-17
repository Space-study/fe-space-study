import {BoardState, Task} from '@/core/types/board'
import React, {createContext, useCallback, useContext, useReducer} from 'react'
import {v4 as uuidv4} from 'uuid'

type BoardAction =
  | {type: 'ADD_COLUMN'; payload: {title: string}}
  | {type: 'EDIT_COLUMN'; payload: {columnId: string; title: string}}
  | {type: 'DELETE_COLUMN'; payload: {columnId: string}}
  | {type: 'ADD_TASK'; payload: {columnId: string; task: Partial<Task>}}
  | {
      type: 'MOVE_TASK'
      payload: {
        sourceColumnId: string
        destinationColumnId: string
        sourceIndex: number
        destinationIndex: number
      }
    }

const initialState: BoardState = {
  columns: [
    {id: 'todo', title: 'To Do', tasks: []},
    {id: 'in-progress', title: 'In Progress', tasks: []},
    {id: 'done', title: 'Done', tasks: []},
  ],
}

const boardReducer = (state: BoardState, action: BoardAction): BoardState => {
  switch (action.type) {
    case 'ADD_COLUMN':
      return {
        ...state,
        columns: [...state.columns, {id: uuidv4(), title: action.payload.title, tasks: []}],
      }

    case 'EDIT_COLUMN':
      return {
        ...state,
        columns: state.columns.map(column =>
          column.id === action.payload.columnId ? {...column, title: action.payload.title} : column,
        ),
      }

    case 'DELETE_COLUMN':
      return {
        ...state,
        columns: state.columns.filter(column => column.id !== action.payload.columnId),
      }

    case 'ADD_TASK':
      return {
        ...state,
        columns: state.columns.map(column =>
          column.id === action.payload.columnId
            ? {
                ...column,
                tasks: [
                  ...column.tasks,
                  {
                    id: uuidv4(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    priority: 'medium',
                    ...action.payload.task,
                  } as Task,
                ],
              }
            : column,
        ),
      }

    case 'MOVE_TASK':
      const {sourceColumnId, destinationColumnId, sourceIndex, destinationIndex} = action.payload

      return {
        ...state,
        columns: state.columns.map(column => {
          if (column.id === sourceColumnId) {
            // Remove task from source column
            const newTasks = [...column.tasks]
            newTasks.splice(sourceIndex, 1)
            return {...column, tasks: newTasks}
          }
          if (column.id === destinationColumnId) {
            // Add task to destination column
            const newTasks = [...column.tasks]
            const movedTask = state.columns.find(col => col.id === sourceColumnId)?.tasks[
              sourceIndex
            ]
            if (movedTask) {
              newTasks.splice(destinationIndex, 0, {
                ...movedTask,
                updatedAt: new Date(),
              })
            }
            return {...column, tasks: newTasks}
          }
          return column
        }),
      }

    default:
      return state
  }
}

interface BoardContextType {
  state: BoardState
  addColumn: (title: string) => void
  editColumn: (columnId: string, title: string) => void
  deleteColumn: (columnId: string) => void
  addTask: (columnId: string, task: Partial<Task>) => void
  moveTask: (
    sourceColumnId: string,
    destinationColumnId: string,
    sourceIndex: number,
    destinationIndex: number,
  ) => void
}

const BoardContext = createContext<BoardContextType | undefined>(undefined)

export const BoardProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [state, dispatch] = useReducer(boardReducer, initialState)

  const addColumn = useCallback((title: string) => {
    dispatch({type: 'ADD_COLUMN', payload: {title}})
  }, [])

  const editColumn = useCallback((columnId: string, title: string) => {
    dispatch({type: 'EDIT_COLUMN', payload: {columnId, title}})
  }, [])

  const deleteColumn = useCallback((columnId: string) => {
    dispatch({type: 'DELETE_COLUMN', payload: {columnId}})
  }, [])

  const addTask = useCallback((columnId: string, task: Partial<Task>) => {
    dispatch({type: 'ADD_TASK', payload: {columnId, task}})
  }, [])

  const moveTask = useCallback(
    (
      sourceColumnId: string,
      destinationColumnId: string,
      sourceIndex: number,
      destinationIndex: number,
    ) => {
      dispatch({
        type: 'MOVE_TASK',
        payload: {sourceColumnId, destinationColumnId, sourceIndex, destinationIndex},
      })
    },
    [],
  )

  const value = {
    state,
    addColumn,
    editColumn,
    deleteColumn,
    addTask,
    moveTask,
  }

  return <BoardContext.Provider value={value}>{children}</BoardContext.Provider>
}

export const useBoard = () => {
  const context = useContext(BoardContext)
  if (!context) {
    throw new Error('useBoard must be used within a BoardProvider')
  }
  return context
}
