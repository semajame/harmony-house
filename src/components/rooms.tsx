'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation' // ✅ App Router
import { useState } from 'react'

import { rooms } from '@/lib/rooms'

export default function Rooms() {
  const router = useRouter()
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null)

  const handleBookNow = (id: number) => {
    router.push(`/room/${id}`) // ✅ navigate to dynamic route
  }

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <h1 className='text-center text-4xl mb-10 font-bold text-gray-800'>
        Rooms
      </h1>
      <div className='max-w-7xl mx-auto'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {rooms.map((room) => (
            <div
              key={room.id}
              className='bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300'
            >
              <div className='relative h-42 bg-gray-200'>
                <Image
                  src={room.image}
                  alt={room.name}
                  fill
                  className='w-full h-full object-contain'
                />
              </div>
              <div className='p-4 space-y-3'>
                <h3 className='text-lg font-bold text-gray-800 text-center'>
                  {room.name}
                </h3>
                <p className='text-sm text-gray-600 text-center'>
                  {room.price}
                </p>
                <p className='text-xs text-gray-600 text-center leading-relaxed min-h-16'>
                  {room.description}
                </p>
                <div className='pt-2'>
                  <button
                    onClick={() => handleBookNow(room.id)} // ✅ go to /room/[id]
                    className='w-full py-2 px-4 rounded-md font-medium text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200'
                  >
                    BOOK NOW
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
