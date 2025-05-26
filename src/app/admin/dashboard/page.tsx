'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import LogoutButton from '@/components/admin/login/logout'

import React, { useState } from 'react'
import {
  Home,
  BarChart3,
  Users,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  TrendingUp,
  DollarSign,
  Activity,
  UserPlus,
} from 'lucide-react'

export default function Dashboard() {
  const stats = [
    {
      title: 'Total Revenue',
      value: '$45,231.89',
      change: '+20.1%',
      trend: 'up',
      icon: DollarSign,
      color: 'bg-blue-500',
    },
    {
      title: 'Active Users',
      value: '2,350',
      change: '+180.1%',
      trend: 'up',
      icon: Users,
      color: 'bg-green-500',
    },
    {
      title: 'New Signups',
      value: '12,234',
      change: '+19%',
      trend: 'up',
      icon: UserPlus,
      color: 'bg-purple-500',
    },
    {
      title: 'Growth Rate',
      value: '573',
      change: '+201',
      trend: 'up',
      icon: TrendingUp,
      color: 'bg-orange-500',
    },
  ]

  if (status === 'loading') return <p>Loading...</p>

  return (
    <div className='flex h-screen bg-gray-100'>
      {/* Main Content */}

      {/* Main Content Area */}
      <main className='flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6'>
        {/* Stats Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6'>
          {stats.map((stat, index) => (
            <div key={index} className='bg-white rounded-lg shadow p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600'>
                    {stat.title}
                  </p>
                  <p className='text-2xl font-bold text-gray-900'>
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <stat.icon className='h-6 w-6 text-white' />
                </div>
              </div>
              <div className='mt-4 flex items-center'>
                <span className='text-green-600 text-sm font-medium'>
                  {stat.change}
                </span>
                <span className='text-gray-600 text-sm ml-2'>
                  from last month
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
          <div className='bg-white rounded-lg shadow p-6'>
            <h3 className='text-lg font-semibold text-gray-900 mb-4'>
              Revenue Overview
            </h3>
            <div className='h-64 bg-gray-50 rounded-lg flex items-center justify-center'>
              <p className='text-gray-500'>Chart Component Here</p>
            </div>
          </div>

          <div className='bg-white rounded-lg shadow p-6'>
            <h3 className='text-lg font-semibold text-gray-900 mb-4'>
              User Activity
            </h3>
            <div className='h-64 bg-gray-50 rounded-lg flex items-center justify-center'>
              <p className='text-gray-500'>Chart Component Here</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className='bg-white rounded-lg shadow'>
          <div className='px-6 py-4 border-b border-gray-200'>
            <h3 className='text-lg font-semibold text-gray-900'>
              Recent Activity
            </h3>
          </div>
          <div className='p-6'>
            <div className='space-y-4'>
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className='flex items-center space-x-4'>
                  <div className='w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center'>
                    <Users className='h-5 w-5 text-gray-600' />
                  </div>
                  <div className='flex-1'>
                    <p className='text-sm font-medium text-gray-900'>
                      New user registered
                    </p>
                    <p className='text-sm text-gray-500'>2 minutes ago</p>
                  </div>
                  <div className='text-sm text-gray-400'>View</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
