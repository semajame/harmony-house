'use client'

import { useState } from 'react'
import {
  Home,
  BarChart3,
  Users,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  Activity,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  User,
} from 'lucide-react'

const Staffs = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')

  // Sample user data
  const users = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      role: 'Admin',
      status: 'Active',
      location: 'New York, USA',
      joinDate: '2023-01-15',
      avatar: 'JD',
      lastSeen: '2 hours ago',
    },
    {
      id: 2,
      name: 'Sarah Wilson',
      email: 'sarah.wilson@example.com',
      phone: '+1 (555) 234-5678',
      role: 'Manager',
      status: 'Active',
      location: 'Los Angeles, USA',
      joinDate: '2023-02-20',
      avatar: 'SW',
      lastSeen: '1 day ago',
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      phone: '+1 (555) 345-6789',
      role: 'User',
      status: 'Inactive',
      location: 'Chicago, USA',
      joinDate: '2023-03-10',
      avatar: 'MJ',
      lastSeen: '1 week ago',
    },
    {
      id: 4,
      name: 'Emily Davis',
      email: 'emily.davis@example.com',
      phone: '+1 (555) 456-7890',
      role: 'User',
      status: 'Active',
      location: 'Miami, USA',
      joinDate: '2023-04-05',
      avatar: 'ED',
      lastSeen: '5 minutes ago',
    },
    {
      id: 5,
      name: 'David Brown',
      email: 'david.brown@example.com',
      phone: '+1 (555) 567-8901',
      role: 'Manager',
      status: 'Active',
      location: 'Seattle, USA',
      joinDate: '2023-01-28',
      avatar: 'DB',
      lastSeen: '3 hours ago',
    },
    {
      id: 6,
      name: 'Lisa Garcia',
      email: 'lisa.garcia@example.com',
      phone: '+1 (555) 678-9012',
      role: 'User',
      status: 'Active',
      location: 'Austin, USA',
      joinDate: '2023-05-12',
      avatar: 'LG',
      lastSeen: '30 minutes ago',
    },
  ]

  // Filter users based on search and role
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole =
      filterRole === 'all' ||
      user.role.toLowerCase() === filterRole.toLowerCase()
    return matchesSearch && matchesRole
  })

  const getStatusColor = (status: any) => {
    return status === 'Active'
      ? 'text-green-600 bg-green-100'
      : 'text-red-600 bg-red-100'
  }

  const getRoleColor = (role: any) => {
    switch (role) {
      case 'Admin':
        return 'text-purple-600 bg-purple-100'
      case 'Manager':
        return 'text-blue-600 bg-blue-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className='flex h-screen bg-gray-100'>
      {/* Sidebar */}

      {/* Main Content */}
      <div className='flex-1 flex flex-col overflow-hidden lg:ml-0'>
        {/* Header */}

        {/* Main Content Area */}
        <main className='flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6'>
          {/* Filters and Search */}
          <div className='mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between'>
            <div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center'>
              {/* Search */}
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                <input
                  type='text'
                  placeholder='Search users...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64'
                />
              </div>

              {/* Role Filter */}
              <div className='relative'>
                <Filter className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className='pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white'
                >
                  <option value='all'>All Roles</option>
                  <option value='admin'>Admin</option>
                  <option value='manager'>Manager</option>
                  <option value='user'>User</option>
                </select>
              </div>
            </div>
          </div>

          {/* Users Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className='bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200'
              >
                <div className='p-6'>
                  {/* User Header */}
                  <div className='flex items-start justify-between mb-4'>
                    <div className='flex items-center space-x-3'>
                      <div className='w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center'>
                        <span className='text-white font-medium'>
                          {user.avatar}
                        </span>
                      </div>
                      <div>
                        <h3 className='text-lg font-semibold text-gray-900'>
                          {user.name}
                        </h3>
                        <p className='text-sm text-gray-500'>{user.lastSeen}</p>
                      </div>
                    </div>
                    <button className='p-1 hover:bg-gray-100 rounded'>
                      <MoreVertical className='h-4 w-4 text-gray-400' />
                    </button>
                  </div>

                  {/* User Details */}
                  <div className='space-y-3'>
                    <div className='flex items-center space-x-2 text-sm text-gray-600'>
                      <Mail className='h-4 w-4' />
                      <span>{user.email}</span>
                    </div>
                    <div className='flex items-center space-x-2 text-sm text-gray-600'>
                      <Phone className='h-4 w-4' />
                      <span>{user.phone}</span>
                    </div>
                    <div className='flex items-center space-x-2 text-sm text-gray-600'>
                      <MapPin className='h-4 w-4' />
                      <span>{user.location}</span>
                    </div>
                    <div className='flex items-center space-x-2 text-sm text-gray-600'>
                      <Calendar className='h-4 w-4' />
                      <span>Joined {user.joinDate}</span>
                    </div>
                  </div>

                  {/* Status and Role */}
                  <div className='flex items-center justify-between mt-4 pt-4 border-t border-gray-100'>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        user.status
                      )}`}
                    >
                      {user.status}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredUsers.length === 0 && (
            <div className='text-center py-12'>
              <User className='h-12 w-12 text-gray-400 mx-auto mb-4' />
              <h3 className='text-lg font-medium text-gray-900 mb-2'>
                No users found
              </h3>
              <p className='text-gray-500'>
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default Staffs
