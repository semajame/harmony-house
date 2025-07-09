'use client'

import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Review = {
  id: number
  name: string
  rating: number
  message: string
}

export default function ReviewsPreview({ roomName }: { roomName: string }) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(
          `/api/admin/review/by-room-name?room=${encodeURIComponent(roomName)}`
        )
        if (!res.ok) throw new Error('Failed to fetch reviews')
        const data = await res.json()
        setReviews(data)
      } catch (err) {
        console.error('Error fetching reviews:', err)
        setError('Failed to load reviews.')
      } finally {
        setLoading(false)
      }
    }

    if (roomName) {
      fetchReviews()
    }
  }, [roomName])

  return (
    <div className='bg-white rounded-2xl p-6 shadow-lg border border-purple-100'>
      <div className='flex items-center justify-between mb-6'>
        <h3 className='text-xl font-bold text-gray-800'>Recent Reviews</h3>
      </div>

      {loading ? (
        <p className='text-gray-500 text-sm'>Loading reviews...</p>
      ) : error ? (
        <p className='text-red-500 text-sm'>{error}</p>
      ) : reviews.length === 0 ? (
        <p className='text-gray-500 text-sm'>No reviews for this room yet.</p>
      ) : (
        <div className='space-y-4'>
          {reviews.slice(0, 3).map((review) => (
            <div
              key={review.id}
              className='border-b border-gray-100 pb-4 last:border-0'
            >
              <div className='flex items-start gap-4'>
                <div className='w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold'>
                  {review.name.charAt(0).toUpperCase()}
                </div>
                <div className='flex-1'>
                  <div className='flex items-center gap-2 mb-2'>
                    <span className='font-medium text-gray-800'>
                      {review.name}
                    </span>
                    <div className='flex'>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className='text-gray-600 text-sm'>{review.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
