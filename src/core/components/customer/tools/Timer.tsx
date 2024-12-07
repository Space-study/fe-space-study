import {MovableCard} from '@/core/components/common/MovableCard'
import {IconButton, ThemedButton} from '@/core/components/common/SquareButton'
import React, {useEffect, useState} from 'react'
import {FaCog, FaSync} from 'react-icons/fa'

// Helper function for formatting digits
const formatDigits = (number: number): string => `${['', '0'][+(number < 10)]}${number}`

const formatTime = (seconds: number): string =>
  `${formatDigits(Math.floor(seconds / 60))}:${formatDigits(seconds % 60)}`

interface TimerProps {
  visible: boolean
  toggleCard: () => void
}

type IntervalData = {
  pomodoro: number
  short: number
  long: number
}

type TimerData = {
  currentInterval: keyof IntervalData
  remaining: number
  startDate: number | undefined
}

export const Timer: React.FC<TimerProps> = ({visible, toggleCard}) => {
  const [intervalData, setIntervalData] = useState<IntervalData>({
    pomodoro: 20 * 60,
    short: 5 * 60,
    long: 10 * 60,
  })

  const [timerData, setTimerData] = useState<TimerData>({
    currentInterval: 'pomodoro',
    remaining: intervalData['pomodoro'],
    startDate: undefined,
  })

  const changeActiveInterval = (name: keyof IntervalData): void => {
    setTimerData({
      currentInterval: name,
      remaining: intervalData[name],
      startDate: undefined,
    })
  }

  const resetActiveInterval = (): void => {
    setTimerData({
      ...timerData,
      remaining: intervalData[timerData.currentInterval],
      startDate: undefined,
    })
  }

  const currentRemaining = (): number => {
    const {remaining, startDate} = timerData
    const currentDate = Math.floor(Date.now() / 1000)
    return remaining + (startDate ? startDate - currentDate : 0)
  }

  const startHandler = (): void => {
    if (timerData.startDate) {
      setTimerData({
        ...timerData,
        remaining: currentRemaining(),
        startDate: undefined,
      })
    } else {
      setTimerData({
        ...timerData,
        startDate: Math.floor(Date.now() / 1000),
      })
    }
  }

  return (
    <MovableCard visible={visible} className='w-[400px] h-[150px]' toggleCard={toggleCard}>
      <div className='w-full flex flex-3 justify-between items-center'>
        <div className='flex-3 text-[4rem] text-4xl font-semibold'>
          {formatTime(currentRemaining())}
        </div>
        <div className='flex-2'>
          <ThemedButton label='Start' className='w-full' onClick={startHandler} />
        </div>
        <div className='h-full flex items-center justify-center'>
          <IconButton icon={FaSync} onClick={resetActiveInterval} />
        </div>
      </div>

      <div className='w-full gap-[10px] flex justify-between mt-4'>
        <ThemedButton
          className=' flex-1'
          label='Pomodoro'
          onClick={() => changeActiveInterval('pomodoro')}
        />
        <ThemedButton
          className=' flex-1'
          label='Short Break'
          onClick={() => changeActiveInterval('short')}
        />
        <ThemedButton
          className='flex-1'
          label='Long Break'
          onClick={() => changeActiveInterval('long')}
        />
        <IconButton className='' icon={FaCog} onClick={() => console.log('Settings clicked')} />
      </div>
    </MovableCard>
  )
}
