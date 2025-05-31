'use client'

import { useParams, useRouter } from 'next/navigation'
import { rooms } from '@/lib/rooms'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Calendar,
  Clock,
  Users,
  Star,
  Music,
  Volume2,
  Wifi,
  Thermometer,
  Camera,
  Shield,
  Heart,
  Share2,
  ArrowLeft,
  CheckCircle,
  Sparkles,
  User,
  Mail,
  Phone,
  Utensils,
} from 'lucide-react'

const foodOptions = [
  { id: 1, name: 'Chicken Wings', price: 199 },
  { id: 2, name: 'Nachos & Cheese', price: 149 },
  { id: 3, name: 'Fries Bucket', price: 99 },
  { id: 4, name: 'Coke 1.5L', price: 89 },
]

export default function RoomPage() {
  const params = useParams()
  const router = useRouter()
  const roomId = Number(params.id)
  const room = rooms.find((r) => r.id === roomId)
  const [selectedFoods, setSelectedFoods] = useState<number[]>([])

  // Form state
  // const [fullName, setFullName] = useState('')
  // const [email, setEmail] = useState('')
  // const [phone, setPhone] = useState('')
  const [checkInDate, setCheckInDate] = useState('')
  const [checkInTime, setCheckInTime] = useState('')
  const [checkOutTime, setCheckOutTime] = useState('')
  const [persons, setPersons] = useState(5)
  const [isLiked, setIsLiked] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)

  // Mock additional images for the room
  const roomImages = [
    room?.image,
    room?.image, // In real app, these would be different images
    room?.image,
    room?.image,
  ]

  const features = [
    {
      icon: Volume2,
      label: 'Premium Sound System',
      description: '7.1 Surround Sound',
    },
    { icon: Camera, label: 'HD Display', description: '65" 4K Smart TV' },
    {
      icon: Wifi,
      label: 'Free High-Speed WiFi',
      description: 'Unlimited access',
    },
    {
      icon: Thermometer,
      label: 'Climate Control',
      description: 'Individual AC control',
    },
    {
      icon: Music,
      label: '50,000+ Songs',
      description: 'Multi-language library',
    },
    {
      icon: Shield,
      label: 'Private & Secure',
      description: 'Soundproof rooms',
    },
  ]

  const timeSlots = [
    '1:00',
    '2:00',
    '3:00',
    '4:00',
    '5:00',
    '6:00',
    '7:00',
    '8:00',
    '9:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
    '21:00',
    '22:00',
    '23:00',
  ]

  const handleFoodToggle = (id: number) => {
    setSelectedFoods((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    )
  }

  //^ format time to am and pm
  function formatToAMPM(time24: string): string {
    const [hour, minute] = time24.split(':').map(Number)
    const period = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 === 0 ? 12 : hour % 12
    return `${hour12}:${minute.toString().padStart(2, '0')} ${period}`
  }

  //^  Calculate total price whenever time changes
  useEffect(() => {
    if (checkInTime && checkOutTime && room) {
      const checkInHour = parseInt(checkInTime.split(':')[0])
      const checkOutHour = parseInt(checkOutTime.split(':')[0])
      let hours = checkOutHour - checkInHour

      // Handle overnight bookings
      if (hours <= 0) {
        hours = 24 - checkInHour + checkOutHour
      }

      const roomPriceNumber = parseInt(
        room.price.toString().replace(/[^\d]/g, '')
      )
      const foodTotal = selectedFoods.reduce((sum, fid) => {
        const food = foodOptions.find((f) => f.id === fid)
        return sum + (food?.price || 0)
      }, 0)

      setTotalPrice(hours * roomPriceNumber + foodTotal)
    }
  }, [checkInTime, checkOutTime, room, selectedFoods, foodOptions])

  //^ Handle reservation button
  const handleReserve = (event: React.FormEvent) => {
    event.preventDefault() // Prevent page refresh
    if (!checkInDate || !checkInTime || !checkOutTime) {
      alert('Please fill in all required fields')
      return
    }

    const checkIn = new Date(`${checkInDate}T${checkInTime}:00`)
    const checkOut = new Date(`${checkInDate}T${checkOutTime}:00`)

    // If checkout is before checkin, assume next day
    if (checkOut <= checkIn) {
      checkOut.setDate(checkOut.getDate() + 1)
    }

    const reservationData = {
      roomId: room?.id,
      checkIn: checkIn.toISOString(),
      checkOut: checkOut.toISOString(),
      totalPrice: totalPrice,
    }

    try {
      // Save to localStorage
      localStorage.setItem('reservation', JSON.stringify(reservationData))
      console.log(reservationData)
      // Redirect to payment page
      router.push('/payment')
    } catch (error) {
      console.error('Error saving reservation to localStorage:', error)
      alert('An error occurred. Please try again.')
    }
  }

  const handleBackToRooms = () => {
    router.push('/rooms') // Adjust this path according to your routing structure
  }

  if (!room) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50'>
        <div className='text-center space-y-4'>
          <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto'>
            <Music className='w-8 h-8 text-red-500' />
          </div>
          <h2 className='text-2xl font-bold text-gray-800'>Room Not Found</h2>
          <p className='text-gray-600'>
            The room you're looking for doesn't exist.
          </p>
          <Button
            className='bg-purple-600 hover:bg-purple-700'
            onClick={handleBackToRooms}
          >
            <ArrowLeft className='w-4 h-4 mr-2' />
            Back to Rooms
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-50/50 via-white to-pink-50/50'>
      {/* Header with breadcrumb */}
      <div className='bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-40'>
        <div className='max-w-7xl mx-auto px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <Button
                variant='ghost'
                size='sm'
                className='text-purple-600 hover:bg-purple-50'
                onClick={handleBackToRooms}
              >
                <ArrowLeft className='w-4 h-4 mr-2' />
                Back to Rooms
              </Button>
              <div className='text-sm text-gray-500'>
                Rooms /{' '}
                <span className='text-purple-600 font-medium'>{room.name}</span>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setIsLiked(!isLiked)}
                className={`${
                  isLiked ? 'text-red-500' : 'text-gray-500'
                } hover:bg-red-50`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              </Button>
              <Button
                variant='ghost'
                size='sm'
                className='text-gray-500 hover:bg-gray-50'
              >
                <Share2 className='w-4 h-4' />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto p-6 grid lg:grid-cols-3 gap-8 py-8'>
        {/* Main Content */}
        <div className='lg:col-span-2 space-y-8'>
          {/* Room Header */}
          <div className='space-y-4'>
            <div className='flex items-center gap-3'>
              <h1 className='text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>
                {room.name}
              </h1>
              <div className='bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1'>
                <Sparkles className='w-3 h-3' />
                PREMIUM
              </div>
            </div>

            <div className='flex items-center gap-4 text-sm text-gray-600'>
              <div className='flex items-center gap-1'>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className='w-4 h-4 text-yellow-400 fill-current'
                  />
                ))}
                <span className='ml-1 font-medium'>4.9 (127 reviews)</span>
              </div>
              <div className='flex items-center gap-1'>
                <Users className='w-4 h-4' />
                <span>Up to 6 people</span>
              </div>
            </div>

            <div className='text-3xl font-bold text-purple-600'>
              {room.price}
              <span className='text-lg font-normal text-gray-500'>/hour</span>
            </div>
          </div>

          {/* Image Gallery */}
          <div className='space-y-4'>
            <div className='relative w-full h-80 md:h-96 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl overflow-hidden shadow-xl'>
              <Image
                src={roomImages[selectedImageIndex] || '/placeholder-room.jpg'}
                alt={room.name}
                fill
                className='object-cover transition-all duration-500'
                priority
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent' />

              {/* Image navigation */}
              <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2'>
                {roomImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      selectedImageIndex === index
                        ? 'bg-white scale-125'
                        : 'bg-white/50 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className='grid grid-cols-4 gap-2'>
              {roomImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative h-20 rounded-lg overflow-hidden transition-all duration-300 ${
                    selectedImageIndex === index
                      ? 'ring-2 ring-purple-500 scale-105'
                      : 'hover:scale-105'
                  }`}
                >
                  <Image
                    src={img || '/placeholder-room.jpg'}
                    alt={`${room.name} view ${index + 1}`}
                    fill
                    className='object-cover'
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className='bg-white rounded-2xl p-6 shadow-lg border border-purple-100'>
            <h3 className='text-xl font-bold text-gray-800 mb-4'>
              About This Room
            </h3>
            <p className='text-gray-600 leading-relaxed mb-6'>
              {room.description}
            </p>

            <div className='space-y-4'>
              <h4 className='font-semibold text-gray-800'>What's Included:</h4>
              <div className='grid md:grid-cols-2 gap-4'>
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className='flex items-start gap-3 p-3 bg-purple-50 rounded-lg'
                  >
                    <div className='w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0'>
                      <feature.icon className='w-4 h-4 text-purple-600' />
                    </div>
                    <div>
                      <div className='font-medium text-gray-800'>
                        {feature.label}
                      </div>
                      <div className='text-sm text-gray-600'>
                        {feature.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Food  */}

          {/* Reviews Preview */}
          <div className='bg-white rounded-2xl p-6 shadow-lg border border-purple-100'>
            <div className='flex items-center justify-between mb-6'>
              <h3 className='text-xl font-bold text-gray-800'>
                Recent Reviews
              </h3>
              <Button variant='outline' size='sm'>
                View All Reviews
              </Button>
            </div>

            <div className='space-y-4'>
              {[1, 2].map((review) => (
                <div
                  key={review}
                  className='border-b border-gray-100 pb-4 last:border-0'
                >
                  <div className='flex items-start gap-4'>
                    <div className='w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold'>
                      {review === 1 ? 'M' : 'S'}
                    </div>
                    <div className='flex-1'>
                      <div className='flex items-center gap-2 mb-2'>
                        <span className='font-medium text-gray-800'>
                          {review === 1 ? 'Maria Santos' : 'Sarah Kim'}
                        </span>
                        <div className='flex'>
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className='w-4 h-4 text-yellow-400 fill-current'
                            />
                          ))}
                        </div>
                      </div>
                      <p className='text-gray-600 text-sm'>
                        {review === 1
                          ? 'Amazing sound quality and comfortable seating! Perfect for our birthday celebration.'
                          : 'Great atmosphere and clean facilities. The song selection is impressive!'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Booking Sidebar */}
        <form onSubmit={handleReserve}>
          <div className='lg:col-span-1'>
            <div className='sticky top-24'>
              <div className='bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden'>
                <div className='bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6'>
                  <div className='flex items-center gap-2 mb-2'>
                    <Calendar className='w-5 h-5' />
                    <h3 className='text-lg font-bold'>Book Your Session</h3>
                  </div>
                  <p className='text-purple-100 text-sm'>
                    Reserve your perfect karaoke experience
                  </p>
                </div>

                <div className='p-6 space-y-6'>
                  {/* Date Selection */}
                  <div>
                    <label className='flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3'>
                      <Calendar className='w-4 h-4' />
                      Select Date
                    </label>
                    <input
                      type='date'
                      className='w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300'
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>

                  {/* Time Selection */}
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <label className='flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3'>
                        <Clock className='w-4 h-4' />
                        Check-in
                      </label>
                      <select
                        className='w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300'
                        value={checkInTime}
                        onChange={(e) => setCheckInTime(e.target.value)}
                      >
                        <option value=''>Select time</option>
                        {timeSlots.map((time) => (
                          <option key={time} value={time}>
                            {formatToAMPM(time)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className='flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3'>
                        <Clock className='w-4 h-4' />
                        Check-out
                      </label>
                      <select
                        className='w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300'
                        value={checkOutTime}
                        onChange={(e) => setCheckOutTime(e.target.value)}
                      >
                        <option value=''>Select time</option>
                        {timeSlots.map((time) => (
                          <option key={time} value={time}>
                            {formatToAMPM(time)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Guests */}
                  <div>
                    <label className='flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3'>
                      <Users className='w-4 h-4' />
                      Number of Guests
                    </label>
                    <div className='flex items-center border border-gray-200 rounded-lg overflow-hidden'>
                      <button
                        type='button'
                        onClick={() => setPersons(Math.max(1, persons - 1))}
                        className='p-3 hover:bg-gray-50 transition-colors'
                      >
                        -
                      </button>
                      <span className='flex-1 text-center py-3 border-x border-gray-200'>
                        {persons} {persons === 1 ? 'guest' : 'guests'}
                      </span>
                      <button
                        type='button'
                        onClick={() => setPersons(Math.min(6, persons + 1))}
                        className='p-3 hover:bg-gray-50 transition-colors'
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className='text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2'>
                      <Utensils className='w-4 h-4' />
                      Food Inclusions
                    </h4>
                    <div className='space-y-2'>
                      {foodOptions.map((food) => (
                        <label
                          key={food.id}
                          className='flex items-center justify-between bg-purple-50 px-3 py-2 rounded-lg cursor-pointer'
                        >
                          <div className='flex items-center gap-2'>
                            <input
                              type='checkbox'
                              checked={selectedFoods.includes(food.id)}
                              onChange={() => handleFoodToggle(food.id)}
                              className='accent-purple-600'
                            />
                            <span className='text-sm text-gray-700'>
                              {food.name}
                            </span>
                          </div>
                          <span className='text-sm font-medium text-purple-600'>
                            ₱{food.price}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Pricing Breakdown */}
                  <div className='bg-gray-50 rounded-lg p-4 space-y-2'>
                    <div className='flex justify-between text-sm'>
                      <span>Hourly rate</span>
                      <span>{room.price}</span>
                    </div>
                    <div className='flex justify-between text-sm'>
                      <span>Service fee</span>
                      <span>Free</span>
                    </div>
                    <div className='border-t border-gray-200 pt-2 flex justify-between font-semibold'>
                      <span>Total</span>
                      <span className='text-purple-600'>
                        ₱{totalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className='space-y-2'>
                    {[
                      '24 hour free cancellation',
                      'Instant confirmation',
                      '24/7 support',
                    ].map((benefit, index) => (
                      <div
                        key={index}
                        className='flex items-center gap-2 text-sm text-gray-600'
                      >
                        <CheckCircle className='w-4 h-4 text-green-500' />
                        {benefit}
                      </div>
                    ))}
                  </div>

                  {/* Book Button */}
                  <Button
                    type='submit'
                    className='w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-6 text-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl cursor-pointer'
                    disabled={!checkInDate || !checkInTime || !checkOutTime}
                  >
                    <Music className='w-5 h-5 mr-2' />
                    Reserve Your Spot
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
