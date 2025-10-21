'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { MoreVertical, Trash2, Edit, Eye, Star, Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

import Link from 'next/link'

interface Review {
  id: number
  room: string
  name: string
  email: string
  rating: number
  message: string
  createdAt: string
  user?: {
    username: string
  }
}

interface Filters {
  room: string
  rating: string
  dateFrom: string
  dateTo: string
  searchText: string
}

export default function UserReviews() {
  const { data: session, status } = useSession()
  const [reviews, setReviews] = useState<Review[]>([])
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showFilters, setShowFilters] = useState(false)

const [reservations, setReservations] = useState<{ roomId: number; userId: number }[]>([])



  const [filters, setFilters] = useState<Filters>({
    room: '',
    rating: '',
    dateFrom: '',
    dateTo: '',
    searchText: '',
  })

const fetchReservations = async () => {
  try {
    const res = await fetch('/api/admin/reservations');
    if (!res.ok) throw new Error('Failed to fetch reservations');

    const data = await res.json();

    // Extract both roomId and userId
    const reservationsData = data.map((r: any) => ({
      roomId: r.room?.id,
      userId: r.user?.id,
    }));

    setReservations(reservationsData);

    console.log('Fetched reservations:', reservationsData);
  } catch (err) {
    console.error('Error fetching reservations:', err);
  }
};

  const fetchReviews = async () => {
    if (!session?.user?.id) {
      setError('User not authenticated')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch(
        `/api/admin/review/by-user-id?id=${session.user.id}`
      )
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to fetch reviews')
        setReviews([])
        setFilteredReviews([])
      } else {
        setReviews(data)
        setFilteredReviews(data)
      }
    } catch (err) {
      console.error(err)
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  // Filter function
  const applyFilters = () => {
    let filtered = reviews

    // Filter by room
    if (filters.room) {
      filtered = filtered.filter((review) => review.room === filters.room)
    }

    // Filter by rating
    if (filters.rating) {
      filtered = filtered.filter(
        (review) => review.rating === parseInt(filters.rating)
      )
    }

    // Filter by date range
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom)
      filtered = filtered.filter(
        (review) => new Date(review.createdAt) >= fromDate
      )
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo)
      toDate.setHours(23, 59, 59, 999) // Include the entire day
      filtered = filtered.filter(
        (review) => new Date(review.createdAt) <= toDate
      )
    }

    // Filter by search text (in message)
    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase()
      filtered = filtered.filter(
        (review) =>
          review.message.toLowerCase().includes(searchLower) ||
          review.name.toLowerCase().includes(searchLower) ||
          review.email.toLowerCase().includes(searchLower)
      )
    }

    setFilteredReviews(filtered)
  }

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      room: '',
      rating: '',
      dateFrom: '',
      dateTo: '',
      searchText: '',
    })
    setFilteredReviews(reviews)
  }

  // Get unique rooms for filter options
  const uniqueRooms = [...new Set(reviews.map((review) => review.room))].sort()

  // Check if any filters are active
  const hasActiveFilters = Object.values(filters).some((value) => value !== '')

  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [formData, setFormData] = useState({
    room: '',
    name: '',
    email: '',
    review: '',
  })
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        name: session.user.name || '',
        email: session.user.email || '',
      }))
    }
  }, [session])

  useEffect(() => {
    applyFilters();
      if (session?.user?.id) {
    fetchReservations()
  }
  }, [filters, reviews, session])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleFilterChange = (field: keyof Filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const getRatingText = (rating: number) => {
    const ratingTexts = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent']
    return ratingTexts[rating]
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!session || !session.user) {
      alert('You must be logged in to submit a review.')
      return
    }

    if (rating === 0) {
      alert('Please select a rating before submitting.')
      return
    }

    const reviewData = {
      userId: session.user.id,
      room: formData.room,
      name: formData.name,
      email: formData.email,
      rating,
      message: formData.review,
    }

    try {
      const res = await fetch('/api/admin/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      })

      if (!res.ok) {
        const { error } = await res.json()
        throw new Error(error || 'Something went wrong')
      }

      alert('Thank you for your review! It has been submitted successfully.')
      console.log('✅ Review submitted:', await res.json())

      setOpen(false)
      setFormData((prev) => ({
        ...prev,
        room: '',
        review: '',
      }))
      setRating(0)

      // Refresh reviews after submission
      fetchReviews()
    } catch (err: any) {
      console.error('❌ Review submission failed:', err)
      alert(err.message)
    }
  }

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

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      fetchReviews()
    }
  }, [status, session])

  if (status === 'loading' || loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-24 px-4'>
        <div className='max-w-6xl mx-auto'>
          <div className='animate-pulse'>
            <div className='h-8 bg-gray-300 rounded w-64 mb-8'></div>
            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
              {[...Array(6)].map((_, i) => (
                <div key={i} className='bg-white rounded-xl p-6 shadow-lg'>
                  <div className='h-4 bg-gray-300 rounded w-3/4 mb-4'></div>
                  <div className='h-3 bg-gray-200 rounded w-1/2 mb-2'></div>
                  <div className='h-3 bg-gray-200 rounded w-2/3 mb-2'></div>
                  <div className='h-3 bg-gray-200 rounded w-1/3'></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <div className='max-w-xl mx-auto mt-10'>
        <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
          <h2 className='text-lg font-semibold text-yellow-800 mb-2'>
            Authentication Required
          </h2>
          <p className='text-yellow-700'>
            Please sign in to view your reviews.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className='max-w-6xl mx-auto mt-32 mb-10 min-h-screen px-4'>
      {/* Header */}
      <div className='flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3'>
        <h1 className='text-3xl md:text-4xl font-bold text-gray-800'>
          My Reviews
        </h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => setOpen(true)}
              className='bg-gradient-to-r from-indigo-500 to-purple-600 text-white cursor-pointer'
            >
              Write a Review
            </Button>
          </DialogTrigger>

          <DialogContent className='p-0 max-w-2xl'>
            <Card className='w-full max-w-xl shadow-xl border-0 bg-white/80 backdrop-blur-sm'>
              <CardHeader className='text-center space-y-2'>
                <DialogTitle className='text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                  Write a Review
                </DialogTitle>
                <CardDescription className='text-gray-600'>
                  Share your experience with us
                </CardDescription>
              </CardHeader>

              <CardContent className='space-y-6'>
                <form onSubmit={handleSubmit} className='space-y-6'>
                  {/* Room Selection */}
                  <div className='space-y-2'>
                    <Label htmlFor='room' className='text-sm font-semibold'>
                      Select Room
                    </Label>
                    <Select
                      value={formData.room}
                      onValueChange={(value: string) =>
                        handleInputChange('room', value)
                      }
                    >
                      <SelectTrigger className='w-full cursor-pointer'>
                        <SelectValue placeholder='Choose a room...' />
                      </SelectTrigger>
    <SelectContent>
 {[1, 2, 3, 4].map((num) => {
  const userId = Number(session?.user?.id); // Convert to number
  const isAvailable = reservations.some(
    (r) => r.roomId === num && r.userId === userId
  );

  return (
    <SelectItem
      key={num}
      value={`Room ${num}`}
      disabled={!isAvailable}
      className={isAvailable ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'}
    >
      Room {num} {!isAvailable && '(Unavailable)'}
    </SelectItem>
  );
})}

</SelectContent>

                    </Select>
                  </div>

                  {/* Name Input */}
                  <div className='space-y-2'>
                    <Label htmlFor='name' className='text-sm font-semibold'>
                      Your Name
                    </Label>
                    <Input
                      id='name'
                      type='text'
                      value={formData.name}
                      disabled
                      className='w-full bg-gray-100 cursor-not-allowed'
                    />
                  </div>

                  {/* Email Input */}
                  <div className='space-y-2'>
                    <Label htmlFor='email' className='text-sm font-semibold'>
                      Email Address
                    </Label>
                    <Input
                      id='email'
                      type='email'
                      value={formData.email}
                      disabled
                      className='w-full bg-gray-100 cursor-not-allowed'
                    />
                  </div>

                  {/* Star Rating */}
                  <div className='space-y-2'>
                    <Label className='text-sm font-semibold'>
                      Overall Rating
                    </Label>
                    <div className='flex items-center space-x-2'>
                      <div className='flex space-x-1'>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-8 h-8 cursor-pointer transition-all duration-200 ${
                              star <= (hoveredRating || rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300 hover:text-yellow-400'
                            }`}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                          />
                        ))}
                      </div>
                      <span className='text-sm text-gray-600 ml-2'>
                        {getRatingText(hoveredRating || rating) ||
                          'Click to rate'}
                      </span>
                    </div>
                  </div>

                  {/* Review Text */}
                  <div className='space-y-2'>
                    <Label htmlFor='review' className='text-sm font-semibold'>
                      Your Review
                    </Label>
                    <Textarea
                      id='review'
                      placeholder='Share your experience with us...'
                      value={formData.review}
                      onChange={(e) =>
                        handleInputChange('review', e.target.value)
                      }
                      required
                      className='w-full min-h-[120px] resize-none'
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type='submit'
                    className='w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-6 text-sm  cursor-pointer'
                  >
                    Submit Review
                  </Button>
                </form>
              </CardContent>
            </Card>
          </DialogContent>
        </Dialog>
      </div>

      {/* Session info */}
      {session?.user && (
        <div className='bg-gray-50 rounded-lg p-4 mb-6'>
          <h2 className='font-medium text-gray-700 text-base sm:text-lg'>
            Logged in as:
          </h2>
          <p className='text-sm text-gray-600 break-words'>
            {session.user.name || session.user.email}
          </p>
        </div>
      )}

      {/* Filters Section */}
      <div className='bg-white rounded-lg border border-gray-200 mb-6'>
        <Collapsible open={showFilters} onOpenChange={setShowFilters}>
          <CollapsibleTrigger asChild>
            <Button
              variant='ghost'
              className='w-full justify-between p-4 font-medium text-left hover:bg-gray-50'
            >
              <div className='flex items-center gap-2'>
                <Filter className='w-4 h-4' />
                Filters
                {hasActiveFilters && (
                  <span className='bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full'>
                    {Object.values(filters).filter((v) => v !== '').length}{' '}
                    active
                  </span>
                )}
              </div>
              <svg
                className={`w-4 h-4 transition-transform ${
                  showFilters ? 'rotate-180' : ''
                }`}
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M19 9l-7 7-7-7'
                />
              </svg>
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent className='px-4 pb-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {/* Search Text */}
              <div className='space-y-2'>
                <Label className='text-sm font-medium'>Search in reviews</Label>
                <Input
                  placeholder='Search by text, name, or email...'
                  value={filters.searchText}
                  onChange={(e) =>
                    handleFilterChange('searchText', e.target.value)
                  }
                  className='w-full'
                />
              </div>

              {/* Room Filter */}
              <div className='space-y-2'>
                <Label className='text-sm font-medium'>Room</Label>
                <Select
                  value={filters.room || 'all'}
                  onValueChange={(value) =>
                    handleFilterChange('room', value === 'all' ? '' : value)
                  }
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='All rooms' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All rooms</SelectItem>
                    {uniqueRooms.map((room) => (
                      <SelectItem key={room} value={room}>
                        {room}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Rating Filter */}
              <div className='space-y-2'>
                <Label className='text-sm font-medium'>Rating</Label>
                <Select
                  value={filters.rating || 'all'}
                  onValueChange={(value) =>
                    handleFilterChange('rating', value === 'all' ? '' : value)
                  }
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='All ratings' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All ratings</SelectItem>
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <SelectItem key={rating} value={rating.toString()}>
                        <div className='flex items-center gap-2'>
                          {rating} star{rating !== 1 ? 's' : ''}
                          <div className='flex'>
                            {[...Array(rating)].map((_, i) => (
                              <Star
                                key={i}
                                className='w-3 h-3 fill-yellow-400 text-yellow-400'
                              />
                            ))}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date From */}
              <div className='space-y-2'>
                <Label className='text-sm font-medium'>From Date</Label>
                <Input
                  type='date'
                  value={filters.dateFrom}
                  onChange={(e) =>
                    handleFilterChange('dateFrom', e.target.value)
                  }
                  className='w-full'
                />
              </div>

              {/* Date To */}
              <div className='space-y-2'>
                <Label className='text-sm font-medium'>To Date</Label>
                <Input
                  type='date'
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  className='w-full'
                />
              </div>

              {/* Clear Filters */}
              <div className='flex items-end'>
                <Button
                  variant='outline'
                  onClick={clearFilters}
                  disabled={!hasActiveFilters}
                  className='w-full'
                >
                  <X className='w-4 h-4 mr-2' />
                  Clear Filters
                </Button>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Error message */}
      {error && (
        <div className='bg-red-50 border border-red-200 rounded-lg p-4 mb-4'>
          <p className='text-red-600'>{error}</p>
        </div>
      )}

      {/* Review list */}
      {!loading && filteredReviews.length > 0 && (
        <div className='space-y-4'>
          <div className='flex items-center justify-between text-sm text-gray-600 mb-4'>
            <p>
              Showing {filteredReviews.length} of {reviews.length} review
              {reviews.length !== 1 ? 's' : ''}
            </p>
            {hasActiveFilters && (
              <p className='text-blue-600'>Filters applied</p>
            )}
          </div>

          <ul className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {filteredReviews.map((review) => (
              <li
                key={review.id}
                className='bg-white border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow'
              >
                {/* Header */}
                <div className='flex flex-col lg:flex-row lg:justify-between gap-3 mb-4'>
                  <div className='flex items-center flex-wrap gap-2'>
                    <span className='text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded'>
                      Review #{review.id}
                    </span>
                    <div className='flex space-x-1'>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className='text-sm text-gray-600 ml-1'>
                        ({review.rating}/5)
                      </span>
                    </div>
                  </div>

                  <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm'>
                    <button
                      onClick={() => handleDelete(review.id)}
                      className='text-red-500 flex items-center gap-1'
                    >
                      <Trash2 className='w-4 h-4' />
                      Delete Review
                    </button>
                    <time className='text-xs text-gray-400'>
                      {new Date(review.createdAt).toLocaleString()}
                    </time>
                  </div>
                </div>

                {/* Room info */}
                <div className='mb-3'>
                  <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                    Room: {review.room}
                  </span>
                </div>

                {/* Message */}
                <div className='mb-4'>
                  <p className='text-gray-800 leading-relaxed break-words'>
                    {review.message}
                  </p>
                </div>

                {/* Reviewer */}
                <div className='border-t pt-3 text-sm'>
                  <div className='flex flex-col sm:flex-row sm:justify-between gap-2'>
                    <div className='flex flex-wrap gap-4 text-gray-600'>
                      <span className='flex items-center gap-1'>
                        <svg
                          className='w-4 h-4'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path d='...' />
                        </svg>
                        {review.name}
                      </span>
                      <span className='flex items-center gap-1 text-gray-500'>
                        <svg
                          className='w-4 h-4'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path d='...' />
                        </svg>
                        {review.email}
                      </span>
                    </div>
                    {review.user?.username && (
                      <span className='text-xs text-gray-400 whitespace-nowrap'>
                        Account: {review.user.username}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* No reviews after filtering */}
      {!loading &&
        filteredReviews.length === 0 &&
        reviews.length > 0 &&
        !error && (
          <div className='text-center py-8'>
            <div className='text-gray-400 mb-2'>
              <Filter className='mx-auto h-12 w-12' />
            </div>
            <p className='text-gray-500'>
              No reviews match your current filters.
            </p>
            <p className='text-sm text-gray-400 mt-1'>
              Try adjusting your filters or clearing them to see more results.
            </p>
            <Button variant='outline' onClick={clearFilters} className='mt-4'>
              Clear All Filters
            </Button>
          </div>
        )}

      {/* No reviews at all */}
      {!loading && reviews.length === 0 && !error && (
        <div className='text-center py-8'>
          <div className='text-gray-400 mb-2'>
            <svg
              className='mx-auto h-12 w-12'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path d='...' />
            </svg>
          </div>
          <p className='text-gray-500'>No reviews found.</p>
          <p className='text-sm text-gray-400 mt-1'>
            Your reviews will appear here once you create them.
          </p>
        </div>
      )}
    </div>
  )
}
