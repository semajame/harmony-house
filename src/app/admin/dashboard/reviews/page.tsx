'use client'

import { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import {
  Star,
  MoreVertical,
  Trash2,
  Mail,
  MapPin,
  Calendar,
  TrendingUp,
  Filter,
  ChevronDown,
} from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

interface Review {
  id: number
  name: string
  email: string
  room: string
  rating: number
  message: string
  user: { id: number; name: string; email: string }
}

const ReviewsPage = () => {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRoom, setSelectedRoom] = useState<string>('all')

  // Get unique rooms from reviews
  const availableRooms = Array.from(
    new Set(reviews.map((review) => review.room))
  ).sort()

  // Filter reviews based on selected room
  const filteredReviews =
    selectedRoom === 'all'
      ? reviews
      : reviews.filter((review) => review.room === selectedRoom)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch('/api/admin/review')
        const data = await res.json()
        setReviews(data)
      } catch (err) {
        console.error('Failed to fetch reviews:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [])

  const handleDelete = async (id: number) => {
    const confirmed = confirm('Are you sure you want to delete this review?')
    if (!confirmed) return

    try {
      const res = await fetch('/api/admin/review', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      })

      if (!res.ok) {
        const { error } = await res.json()
        throw new Error(error || 'Failed to delete review.')
      }

      setReviews((prev) => prev.filter((r) => r.id !== id))
    } catch (err) {
      console.error('Delete failed:', err)
      alert('Failed to delete review.')
    }
  }

  const averageRating =
    filteredReviews.length > 0
      ? (
          filteredReviews.reduce((sum, review) => sum + review.rating, 0) /
          filteredReviews.length
        ).toFixed(1)
      : '0.0'

  const ratingDistribution = Array.from({ length: 5 }, (_, i) => {
    const star = 5 - i
    const count = filteredReviews.filter((r) => r.rating === star).length
    const percentage =
      filteredReviews.length > 0 ? (count / filteredReviews.length) * 100 : 0
    return { star, count, percentage }
  })

  return (
    <div className='overflow-y-auto bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50'>
      {/* Animated Background Elements */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse'></div>
        <div className='absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-indigo-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse delay-1000'></div>
      </div>

      <div className='relative pt-10 pb-10 px-4'>
        {/* Enhanced Header */}
        <div className='max-w-7xl mx-auto mb-12'>
          <div className='text-center mb-8'>
            <h1 className='text-5xl md:text-6xl font-bold mb-4 text-gray-900'>
              Customer Reviews
            </h1>
            <p className='text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed'>
              Discover what our guests are saying about their experiences
            </p>
          </div>

          {/* Filter Controls */}
          {!loading && reviews.length > 0 && (
            <div className='flex justify-center mb-8'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='outline'
                    className='bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 text-slate-700 hover:text-slate-900 cursor-pointer'
                  >
                    <Filter className='w-4 h-4 mr-2' />
                    {selectedRoom === 'all' ? 'All Rooms' : selectedRoom}
                    <ChevronDown className='w-4 h-4 ml-2' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align='center'
                  className='border-0 shadow-xl bg-white/95 backdrop-blur-sm min-w-48'
                >
                  <DropdownMenuItem
                    onClick={() => setSelectedRoom('all')}
                    className={`cursor-pointer ${
                      selectedRoom === 'all'
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <span className='flex items-center justify-between w-full'>
                      All Rooms
                      {selectedRoom === 'all' && (
                        <span className='text-blue-500'>✓</span>
                      )}
                    </span>
                  </DropdownMenuItem>
                  {availableRooms.map((room) => (
                    <DropdownMenuItem
                      key={room}
                      onClick={() => setSelectedRoom(room)}
                      className={`cursor-pointer ${
                        selectedRoom === room
                          ? 'bg-blue-50 text-blue-700 font-medium'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <span className='flex items-center justify-between w-full'>
                        {room}
                        {selectedRoom === room && (
                          <span className='text-blue-500'>✓</span>
                        )}
                      </span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {/* Stats Dashboard */}
          {!loading && filteredReviews.length > 0 && (
            <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-12'>
              <Card className='bg-white/80 backdrop-blur-sm border-0 shadow-lg '>
                <CardContent className='p-6 text-center'>
                  <div className='flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mx-auto mb-3'>
                    <TrendingUp className='w-6 h-6 text-white' />
                  </div>
                  <div className='text-3xl font-bold text-slate-800 mb-1'>
                    {filteredReviews.length}
                  </div>
                  <div className='text-sm text-slate-600'>
                    {selectedRoom === 'all'
                      ? 'Total Reviews'
                      : `Reviews for ${selectedRoom}`}
                  </div>
                </CardContent>
              </Card>

              <Card className='bg-white/80 backdrop-blur-sm border-0 shadow-lg '>
                <CardContent className='p-6 text-center'>
                  <div className='flex items-center justify-center w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full mx-auto mb-3'>
                    <Star className='w-6 h-6 text-white fill-current' />
                  </div>
                  <div className='text-3xl font-bold text-slate-800 mb-1'>
                    {averageRating}
                  </div>
                  <div className='text-sm text-slate-600'>Average Rating</div>
                </CardContent>
              </Card>

              <Card className='bg-white/80 backdrop-blur-sm border-0 shadow-lg  md:col-span-2'>
                <CardContent className='p-6'>
                  <h3 className='font-semibold text-slate-800 mb-4'>
                    Rating Distribution
                  </h3>
                  <div className='space-y-2'>
                    {ratingDistribution.map(({ star, count, percentage }) => (
                      <div key={star} className='flex items-center gap-3'>
                        <div className='flex items-center gap-1 w-12'>
                          <span className='text-sm font-medium text-slate-700'>
                            {star}
                          </span>
                          <Star className='w-3 h-3 fill-yellow-400 text-yellow-400' />
                        </div>
                        <div className='flex-1 bg-slate-200 rounded-full h-2 overflow-hidden'>
                          <div
                            className='h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full transition-all duration-700 ease-out'
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className='text-sm text-slate-600 w-8'>
                          {count}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Reviews Grid */}
        <div className='max-w-7xl mx-auto'>
          <div className='grid gap-8 md:grid-cols-2 xl:grid-cols-3'>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Card
                  key={i}
                  className='bg-white/80 backdrop-blur-sm border-0 shadow-lg'
                >
                  <CardHeader className='pb-4'>
                    <div className='flex items-start gap-4'>
                      <Skeleton className='w-12 h-12 rounded-full' />
                      <div className='flex-1'>
                        <Skeleton className='h-5 w-32 mb-2' />
                        <Skeleton className='h-4 w-24' />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className='pt-0'>
                    <Skeleton className='h-4 w-20 mb-3' />
                    <Skeleton className='h-4 w-full mb-2' />
                    <Skeleton className='h-4 w-full mb-2' />
                    <Skeleton className='h-4 w-3/4' />
                  </CardContent>
                </Card>
              ))
            ) : filteredReviews.length === 0 ? (
              <div className='col-span-full'>
                <Card className='bg-white/80 backdrop-blur-sm border-0 shadow-lg'>
                  <CardContent className='p-12 text-center'>
                    <div className='w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6'>
                      <Star className='w-10 h-10 text-slate-400' />
                    </div>
                    <h3 className='text-xl font-semibold text-slate-800 mb-2'>
                      {selectedRoom === 'all'
                        ? 'No Reviews Yet'
                        : `No Reviews for ${selectedRoom}`}
                    </h3>
                    <p className='text-slate-600'>
                      {selectedRoom === 'all'
                        ? 'Be the first to share your experience!'
                        : 'Try selecting a different room or view all reviews.'}
                    </p>
                    {selectedRoom !== 'all' && (
                      <Button
                        onClick={() => setSelectedRoom('all')}
                        variant='outline'
                        className='mt-4 bg-white/80 hover:bg-white/90 border-slate-200 cursor-pointer'
                      >
                        View All Reviews
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              filteredReviews.map((review, index) => (
                <Card
                  key={review.id}
                  className='group bg-white/90 backdrop-blur-sm border-0 shadow-lg overflow-hidden relative'
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  {/* Gradient Border Effect */}
                  <div className='absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>

                  <CardHeader className='relative pb-4'>
                    <div className='flex justify-between items-start'>
                      <div className='flex items-start gap-4'>
                        {/* Avatar */}
                        <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-lg'>
                          {review.name.charAt(0).toUpperCase()}
                        </div>

                        <div className='flex-1'>
                          <CardTitle className='text-lg font-semibold text-slate-800 group-hover:text-slate-900 transition-colors'>
                            {review.name}
                          </CardTitle>
                          <div className='flex items-center gap-4 mt-1'>
                            <div className='flex items-center gap-1 text-sm text-slate-500'>
                              <Mail className='w-3 h-3' />
                              <span className='truncate max-w-32'>
                                {review.email}
                              </span>
                            </div>
                            <div className='flex items-center gap-1 text-sm text-slate-500'>
                              <MapPin className='w-3 h-3' />
                              <span>{review.room}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* More Options */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-slate-100 cursor-pointer'
                          >
                            <MoreVertical className='w-4 h-4 text-slate-500' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align='end'
                          className='border-0 shadow-xl'
                        >
                          <DropdownMenuItem
                            onClick={() => handleDelete(review.id)}
                            className='text-red-600 cursor-pointer hover:bg-red-50 focus:bg-red-50'
                          >
                            <Trash2 className='w-4 h-4 mr-2' />
                            Delete Review
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>

                  <CardContent className='relative pt-0 space-y-4'>
                    {/* Rating */}
                    <div className='flex items-center gap-3'>
                      <div className='flex items-center gap-1'>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={`transition-colors duration-200 ${
                              i < review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-slate-300'
                            }`}
                          />
                        ))}
                      </div>
                      <div className='flex items-center gap-2'>
                        <span className='text-sm font-semibold text-slate-700'>
                          {review.rating}.0
                        </span>
                        <span className='text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full'>
                          {review.rating >= 4
                            ? 'Excellent'
                            : review.rating >= 3
                            ? 'Good'
                            : 'Fair'}
                        </span>
                      </div>
                    </div>

                    {/* Review Message */}
                    <div className='relative'>
                      <p className='text-slate-700 leading-relaxed text-sm'>
                        "{review.message}"
                      </p>
                      <div className='absolute -left-2 -top-1 text-4xl text-slate-200 font-serif leading-none'>
                        "
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReviewsPage
