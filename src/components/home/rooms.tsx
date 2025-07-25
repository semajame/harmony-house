'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  Music,
  Users,
  Star,
  Clock,
  Wifi,
  Volume2,
  Sparkles,
} from 'lucide-react'

import { rooms } from '@/lib/rooms'
// import BookButton from './book-room'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function Rooms() {
  const router = useRouter()
  const { data: session, status } = useSession()

  console.log(session)
  const [hoveredRoom, setHoveredRoom] = useState<number | null>(null)

  const handleMouseEnter = (id: number) => {
    setHoveredRoom(id)
    router.prefetch(`/rooms/${id}`)
  }

  const handleBookNow = (id: number) => {
    if (status === 'loading') return

    if (!session) {
      router.push('/login')
    } else {
      router.push(`/room/${id}`)
    }
  }

  return (
    <div
      className='bg-gradient-to-br from-purple-50 via-white to-pink-50 py-20 relative overflow-hidden'
      id='rooms'
    >
      {/* Background decorative elements */}
      <div className='absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none'>
        <div className='absolute top-20 left-10 w-32 h-32 bg-purple-200/30 rounded-full blur-3xl'></div>
        <div className='absolute bottom-20 right-10 w-40 h-40 bg-pink-200/30 rounded-full blur-3xl'></div>
        <div className='absolute top-1/2 left-1/3 w-24 h-24 bg-blue-200/30 rounded-full blur-2xl'></div>
      </div>

      <div className='relative z-10'>
        {/* Header Section */}
        <div className='text-center mb-16 max-w-4xl mx-auto px-4'>
          <div className='flex items-center justify-center gap-3 mb-4'>
            <Music className='w-8 h-8 text-purple-600' />
            <h1 className='text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent'>
              Premium KTV Rooms
            </h1>
            <Music className='w-8 h-8 text-purple-600' />
          </div>

          <p className='text-xl text-gray-600 leading-relaxed mb-8'>
            Choose from our collection of thoughtfully designed karaoke rooms,
            each equipped with state-of-the-art sound systems and comfortable
            seating for the perfect singing experience.
          </p>

          {/* Features badges */}
          <div className='flex flex-wrap justify-center gap-4 mb-8'>
            <div className='flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-purple-100'>
              <Volume2 className='w-4 h-4 text-purple-600' />
              <span className='text-sm font-medium text-gray-700'>
                Premium Sound
              </span>
            </div>
            <div className='flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-purple-100'>
              <Wifi className='w-4 h-4 text-purple-600' />
              <span className='text-sm font-medium text-gray-700'>
                Free WiFi
              </span>
            </div>
            <div className='flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-purple-100'>
              <Clock className='w-4 h-4 text-purple-600' />
              <span className='text-sm font-medium text-gray-700'>
                Flexible Hours
              </span>
            </div>
          </div>
        </div>

        {/* Rooms Grid */}
        <div className='max-w-7xl mx-auto px-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
            {rooms.map((room, index) => (
              <div
                key={room.id}
                className={`group relative bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl ${
                  hoveredRoom === room.id ? 'ring-2 ring-purple-400' : ''
                }`}
                onMouseEnter={() => setHoveredRoom(room.id)}
                onMouseLeave={() => setHoveredRoom(null)}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards',
                }}
              >
                {/* Popular badge for featured rooms */}
                {index === 1 && (
                  <div className='absolute top-4 left-4 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1'>
                    <Sparkles className='w-3 h-3' />
                    POPULAR
                  </div>
                )}

                {/* Image container */}
                <div className='relative h-48 bg-gradient-to-br from-purple-100 to-pink-100 overflow-hidden'>
                  <Image
                    src={room.image}
                    alt={room.name}
                    fill
                    className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
                  />

                  {/* Hover overlay */}
                  <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                    <div className='absolute bottom-4 left-4 right-4'>
                      <div className='flex items-center gap-2 text-white text-sm'>
                        <Users className='w-4 h-4' />
                        <span>Perfect for groups</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className='p-6 space-y-4'>
                  <div className='text-center'>
                    <h3 className='text-xl font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors duration-300'>
                      {room.name}
                    </h3>
                  </div>

                  <p className='text-sm text-gray-600 leading-relaxed min-h-[3rem] text-center'>
                    {room.description}
                  </p>

                  {/* Features list */}
                  <div className='flex flex-wrap justify-center gap-2 py-2'>
                    <span className='bg-purple-50 text-purple-700 px-2 py-1 rounded-full text-xs font-medium'>
                      HD Screen
                    </span>
                    <span className='bg-pink-50 text-pink-700 px-2 py-1 rounded-full text-xs font-medium'>
                      Premium Audio
                    </span>
                    <span className='bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium'>
                      AC Climate
                    </span>
                  </div>

                  {/* Price */}

                  <div>
                    <p className='text-center text-xl text-purple-600'>
                      ₱{room.price}
                    </p>
                  </div>

                  {/* Book button */}
                  <div className='pt-4'>
                    <button
                      onMouseEnter={() => handleMouseEnter(room.id)}
                      onClick={() => handleBookNow(room.id)}
                      className='group/btn w-full py-3 px-6 rounded-xl font-semibold text-sm bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl relative overflow-hidden cursor-pointer'
                    >
                      <span className='relative z-10 flex items-center justify-center gap-2'>
                        <Music className='w-4 h-4 group-hover/btn:animate-bounce' />
                        BOOK NOW
                      </span>

                      <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700'></div>
                    </button>
                  </div>
                </div>

                {/* Bottom accent */}
                <div className='absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300'></div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className='mt-20 text-center max-w-4xl mx-auto px-4'>
          <div className='bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-purple-100'>
            <h3 className='text-2xl font-bold text-gray-800 mb-4'>
              🎤 Can't decide? Let us help!
            </h3>
            <p className='text-gray-600 mb-6'>
              Our team can recommend the perfect room based on your group size
              and preferences.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Link
                href='#contact'
                className='bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 cursor-pointer'
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
