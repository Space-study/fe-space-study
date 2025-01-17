'use client'

import {Flame, Timer} from 'lucide-react'
import {useEffect, useState} from 'react'

interface FocusTimerProps {
  onClose?: () => void
  onMinimize?: () => void
  minimized?: boolean
}

export default function FocusTimer({minimized}: FocusTimerProps) {
  const [time, setTime] = useState(1500) // 25 minutes in seconds
  const [isCounting, setIsCounting] = useState(false)
  const [isPomodoroMode, setIsPomodoroMode] = useState(true)
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isCounting && time > 0) {
      timer = setInterval(() => {
        setTime(prevTime => prevTime - 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isCounting, time])

  const formatTime = (timeInSeconds: number) => {
    const hrs = Math.floor(timeInSeconds / 3600)
    const mins = Math.floor((timeInSeconds % 3600) / 60)
    const secs = timeInSeconds % 60
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const handleStartPomodoro = () => {
    if (time > 0) {
      setIsCounting(true)
    }
  }

  const handleStopPomodoro = () => {
    setIsCounting(false)
  }

  const handleResetPomodoro = () => {
    setTime(isPomodoroMode ? 1500 : 0)
    setIsCounting(false)
  }

  const handleSetTime = () => {
    const totalSeconds = hours * 3600 + minutes * 60 + seconds
    setTime(totalSeconds)
  }

  const handleTogglePomodoroMode = () => {
    setIsPomodoroMode(!isPomodoroMode)
    setTime(isPomodoroMode ? 0 : 1500)
    setIsCounting(false)
  }

  if (minimized) return null
  return (
    <div>
      {/* Content */}
      <div className='p-4'>
        {/* Title */}
        <div className='mb-4 flex items-center justify-center gap-2 text-white'>
          <Flame className='h-5 w-5 text-orange-500' />
          <span>Focus Boost Mode</span>
          <Timer className='h-5 w-5' />
        </div>

        {/* Timer Display */}
        <div className='mb-4 text-center'>
          <span className='font-mono text-3xl font-bold text-white'>{formatTime(time)}</span>
        </div>

        {/* Mode Toggle */}
        <div className='mb-4 text-center'>
          <button
            onClick={handleTogglePomodoroMode}
            className={`w-full rounded-md py-2 text-white transition-colors ${
              isPomodoroMode ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
            }`}>
            {isPomodoroMode ? 'Chế độ Pomodoro' : 'Chế độ Tự thiết lập'}
          </button>
        </div>

        {/* Custom Time Inputs */}
        {!isPomodoroMode && (
          <div className='mb-4 flex gap-2'>
            <input
              type='number'
              value={hours}
              onChange={e => setHours(Math.min(Math.max(0, Number(e.target.value)), 24))}
              className='w-14 rounded border border-gray-600 bg-gray-800 px-2 py-1 text-center text-white'
              placeholder='0'
              min='0'
              max='24'
            />
            <input
              type='number'
              value={minutes}
              onChange={e => setMinutes(Math.min(Math.max(0, Number(e.target.value)), 59))}
              className='w-14 rounded border border-gray-600 bg-gray-800 px-2 py-1 text-center text-white'
              placeholder='0'
              min='0'
              max='59'
            />
            <input
              type='number'
              value={seconds}
              onChange={e => setSeconds(Math.min(Math.max(0, Number(e.target.value)), 59))}
              className='w-14 rounded border border-gray-600 bg-gray-800 px-2 py-1 text-center text-white'
              placeholder='0'
              min='0'
              max='59'
            />
            <button
              onClick={handleSetTime}
              className='rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600'>
              Set Time
            </button>
          </div>
        )}

        {/* Control Buttons */}
        <div className='flex gap-2'>
          <button
            onClick={handleStartPomodoro}
            className='flex-1 rounded bg-green-500 py-2 text-white hover:bg-green-600'
            disabled={isCounting}>
            Start
          </button>
          <button
            onClick={handleStopPomodoro}
            className='flex-1 rounded bg-yellow-500 py-2 text-white hover:bg-yellow-600'
            disabled={!isCounting}>
            Stop
          </button>
          <button
            onClick={handleResetPomodoro}
            className='flex-1 rounded bg-red-500 py-2 text-white hover:bg-red-600'>
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}
