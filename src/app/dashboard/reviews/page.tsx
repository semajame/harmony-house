'use client'

import { useState, useEffect } from 'react'
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Star } from 'lucide-react'
import { useSession } from 'next-auth/react'

export default function Review() {
  const { data: session, status } = useSession()

  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [formData, setFormData] = useState({
    room: '',
    name: '',
    email: '',
    review: '',
  })

  useEffect(() => {
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        name: session.user.name || '',
        email: session.user.email || '',
      }))
    }
  }, [session])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
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
      userId: session.user.id, // ✅ your API expects this
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

      // Reset form (keep name/email)
      setFormData((prev) => ({
        ...prev,
        room: '',
        review: '',
      }))
      setRating(0)
    } catch (err: any) {
      console.error('❌ Review submission failed:', err)
      alert(err.message)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 pt-[8rem] pb-10'>
      <Card className='w-full max-w-xl shadow-xl border-0 bg-white/80 backdrop-blur-sm'>
        <CardHeader className='text-center space-y-2'>
          <CardTitle className='text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
            Write a Review
          </CardTitle>
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
                  <SelectItem value='room1'>Room 1</SelectItem>
                  <SelectItem value='room2'>Room 2</SelectItem>
                  <SelectItem value='room3'>Room 3</SelectItem>
                  <SelectItem value='room4'>Room 4</SelectItem>
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
              <Label className='text-sm font-semibold'>Overall Rating</Label>
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
                  {getRatingText(hoveredRating || rating) || 'Click to rate'}
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
                onChange={(e) => handleInputChange('review', e.target.value)}
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
    </div>
  )
}
