'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreVertical, Trash2, Edit, Eye, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
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

export default function UserReviews() {
  const { data: session, status } = useSession()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
      } else {
        setReviews(data)
      }
    } catch (err) {
      console.error(err)
      setError('Something went wrong')
    } finally {
      setLoading(false)
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
        <Link
          href='/dashboard/reviews'
          className='bg-gradient-to-r from-indigo-500 to-purple-600 py-2 px-4 text-white rounded-md text-center'
        >
          Write a Review
        </Link>
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

      {/* Error message */}
      {error && (
        <div className='bg-red-50 border border-red-200 rounded-lg p-4 mb-4'>
          <p className='text-red-600'>{error}</p>
        </div>
      )}

      {/* Review list */}
      {!loading && reviews.length > 0 && (
        <div className='space-y-4'>
          <p className='text-sm text-gray-600 mb-4'>
            Found {reviews.length} review{reviews.length !== 1 ? 's' : ''}
          </p>

          <ul className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {reviews.map((review) => (
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
                    <svg
                      className='w-3 h-3 mr-1'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path d='...' />
                    </svg>
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

      {/* No reviews */}
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
