import { useState } from 'react'
import { Calendar, Clock, Users, Minus, Plus } from 'lucide-react'

export default function CheckInForm() {
  const [checkInDate, setCheckInDate] = useState('09-22-24')
  const [checkInTime, setCheckInTime] = useState('7pm')
  const [checkOutTime, setCheckOutTime] = useState('11am')
  const [persons, setPersons] = useState(1)

  const timeOptions = [
    '6am',
    '7am',
    '8am',
    '9am',
    '10am',
    '11am',
    '12pm',
    '1pm',
    '2pm',
    '3pm',
    '4pm',
    '5pm',
    '6pm',
    '7pm',
    '8pm',
    '9pm',
    '10pm',
    '11pm',
  ]

  const handlePersonsChange = (increment: number) => {
    setPersons((prev) => Math.max(1, prev + increment))
  }

  return (
    <div>
      {/* Background pattern overlay */}

      {/* Main form card */}
      <div className='relative bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-2xl p-8 w-full max-w-6xl'>
        <h2 className='text-2xl font-bold text-gray-800 mb-6'>
          CHECK IN AVAILABILITY
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-4 gap-6 items-end text-black'>
          {/* Check-in Date */}
          <div className='space-y-2'>
            <label className='block text-sm font-medium text-gray-700'>
              Check-in
            </label>
            <div className='relative'>
              <input
                type='text'
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className='w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white'
                placeholder='MM-DD-YY'
              />
              <Calendar className='absolute right-3 top-3 h-5 w-5 text-gray-400' />
            </div>
          </div>

          {/* Check-in Time */}
          <div className='space-y-2'>
            <label className='block text-sm font-medium text-gray-700'>
              Check-in time
            </label>
            <div className='relative'>
              <select
                value={checkInTime}
                onChange={(e) => setCheckInTime(e.target.value)}
                className='w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white appearance-none'
              >
                {timeOptions.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
              <Clock className='absolute right-3 top-3 h-5 w-5 text-gray-400 pointer-events-none' />
            </div>
          </div>

          {/* Check-out Time */}
          <div className='space-y-2'>
            <label className='block text-sm font-medium text-gray-700'>
              Check-out time
            </label>
            <div className='relative'>
              <select
                value={checkOutTime}
                onChange={(e) => setCheckOutTime(e.target.value)}
                className='w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white appearance-none'
              >
                {timeOptions.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
              <Clock className='absolute right-3 top-3 h-5 w-5 text-gray-400 pointer-events-none' />
            </div>
          </div>

          {/* Persons Counter */}
          <div className='space-y-2'>
            <label className='block text-sm font-medium text-gray-700'>
              Persons:
            </label>
            <div className='flex items-center space-x-3'>
              <button
                onClick={() => handlePersonsChange(-1)}
                className='flex items-center justify-center w-10 h-12 border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-purple-500'
                disabled={persons <= 1}
              >
                <Minus className='h-4 w-4 text-gray-600' />
              </button>

              <div className='flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-md bg-white min-w-16 justify-center'>
                <Users className='h-5 w-5 text-gray-400' />
                <span className='font-medium text-gray-800'>{persons}</span>
              </div>

              <button
                onClick={() => handlePersonsChange(1)}
                className='flex items-center justify-center w-10 h-12 border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-purple-500'
              >
                <Plus className='h-4 w-4 text-gray-600' />
              </button>

              <button className='ml-4 px-8 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors'>
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
