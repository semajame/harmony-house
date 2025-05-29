'use client'

import { useState } from 'react'
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  User,
  MessageSquare,
} from 'lucide-react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleInputChange = (e: any) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setSubmitted(true)

    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false)
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      })
    }, 3000)
  }

  const contactInfo = [
    {
      icon: <Phone className='h-6 w-6' />,
      title: 'Phone',
      details: ['+1 (555) 123-4567', '+1 (555) 987-6543'],
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: <Mail className='h-6 w-6' />,
      title: 'Email',
      details: ['harmonyhouse@gmail.com'],
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: <MapPin className='h-6 w-6' />,
      title: 'Address',
      details: ['123 Hotel Street', 'City, State 12345'],
      color: 'bg-red-100 text-red-600',
    },
    {
      icon: <Clock className='h-6 w-6' />,
      title: 'Hours',
      details: ['Mon-Fri: 9:00 AM - 6:00 PM', 'Sat-Sun: 10:00 AM - 4:00 PM'],
      color: 'bg-purple-100 text-purple-600',
    },
  ]

  if (submitted) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4'>
        <div className='bg-white rounded-lg shadow-xl p-8 text-center max-w-md'>
          <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
            <Send className='h-8 w-8 text-green-600' />
          </div>
          <h2 className='text-2xl font-bold text-gray-800 mb-2'>
            Message Sent!
          </h2>
          <p className='text-gray-600'>
            Thank you for contacting us. We'll get back to you soon.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'
      id='contact'
    >
      {/* Header */}
      <div className='bg-[#944EA8] shadow-sm'>
        <div className='max-w-7xl mx-auto px-6 py-8'>
          <div className='text-center'>
            <h1 className='text-4xl font-bold text-white mb-4'>Contact Us</h1>
            <p className='text-lg text-gray-100 max-w-2xl mx-auto'>
              We'd love to hear from you. Get in touch with us for any
              questions, reservations, or feedback about your stay.
            </p>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-6 py-12'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-12'>
          {/* Contact Information */}
          <div className='lg:col-span-1 space-y-8'>
            <div>
              <h2 className='text-2xl font-bold text-gray-800 mb-6'>
                Get In Touch
              </h2>
              <p className='text-gray-600 mb-8'>
                Our friendly team is here to help you with any inquiries. Reach
                out through any of the following methods.
              </p>
            </div>

            <div className='space-y-6'>
              {contactInfo.map((item, index) => (
                <div key={index} className='flex items-start space-x-4'>
                  <div className={`p-3 rounded-lg ${item.color}`}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 className='font-semibold text-gray-800 mb-1'>
                      {item.title}
                    </h3>
                    {item.details.map((detail, idx) => (
                      <p key={idx} className='text-gray-600 text-sm'>
                        {detail}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className='lg:col-span-2'>
            <div className='bg-white rounded-xl shadow-lg p-8'>
              <h2 className='text-2xl font-bold text-gray-800 mb-6'>
                Send us a Message
              </h2>

              <div className='space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Full Name *
                    </label>
                    <div className='relative'>
                      <User className='absolute left-3 top-3 h-5 w-5 text-gray-400' />
                      <input
                        type='text'
                        name='name'
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        placeholder='Your full name'
                      />
                    </div>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Email Address *
                    </label>
                    <div className='relative'>
                      <Mail className='absolute left-3 top-3 h-5 w-5 text-gray-400' />
                      <input
                        type='email'
                        name='email'
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        placeholder='your.email@example.com'
                      />
                    </div>
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Phone Number
                    </label>
                    <div className='relative'>
                      <Phone className='absolute left-3 top-3 h-5 w-5 text-gray-400' />
                      <input
                        type='tel'
                        name='phone'
                        value={formData.phone}
                        onChange={handleInputChange}
                        className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        placeholder='(555) 123-4567'
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Message *
                  </label>
                  <div className='relative'>
                    <MessageSquare className='absolute left-3 top-3 h-5 w-5 text-gray-400' />
                    <textarea
                      name='message'
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none'
                      placeholder='Tell us how we can help you...'
                    />
                  </div>
                </div>

                <button
                  type='submit'
                  disabled={isSubmitting}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                  } text-white`}
                >
                  {isSubmitting ? (
                    <>
                      <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className='h-5 w-5' />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
