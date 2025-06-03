'use client'

import { useEffect, useState } from 'react'
import {
  Filter,
  Mail,
  Phone,
  MapPin,
  Calendar,
  MoreVertical,
  Search,
  User,
} from 'lucide-react'

interface UserType {
  id: number
  username: string
  email: string
  phone: string
  role: string
  status: string

  isActive: boolean
}

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [filterActive, setFilterActive] = useState<
    'all' | 'active' | 'inactive'
  >('all')

  const [users, setUsers] = useState<UserType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/admin/users') // Update path if your API route is different
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()

        console.log(data)
        setUsers(data)
      } catch (err) {
        console.error('Error fetching users:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const filteredUsers = users.filter((user) => {
    const name = user?.username || ''
    const email = user?.email || ''
    const role = user?.role || ''
    const isActive = user?.isActive

    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole =
      filterRole === 'all' || role.toLowerCase() === filterRole.toLowerCase()

    const matchesActive =
      filterActive === 'all' ||
      (filterActive === 'active' && isActive === true) ||
      (filterActive === 'inactive' && isActive === false)

    return matchesSearch && matchesRole && matchesActive
  })

  const getStatusColor = (isActive: boolean) => {
    return isActive === true
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800'
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'text-purple-600 bg-purple-100'
      case 'costumer':
        return 'text-blue-600 bg-blue-100'
      case 'staff':
        return 'text-pink-600 bg-pink-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className='flex h-full bg-gray-100'>
      <div className='flex-1 flex flex-col '>
        <main className='flex-1 overflow-y-auto bg-gray-100 p-6'>
          <div className='mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between'>
            <div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center'>
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

              <div className='relative'>
                <Filter className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className='pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer'
                >
                  <option value='all' className='cursor-pointer'>
                    All Roles
                  </option>
                  <option value='admin' className='cursor-pointer'>
                    Admin
                  </option>
                  <option value='staff' className='cursor-pointer'>
                    Staff
                  </option>
                  <option value='costumer' className='cursor-pointer'>
                    Costumer
                  </option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <p className='text-gray-600'>Loading users...</p>
          ) : filteredUsers.length === 0 ? (
            <div className='text-center py-12'>
              <User className='h-12 w-12 text-gray-400 mx-auto mb-4' />
              <h3 className='text-lg font-medium text-gray-900 mb-2'>
                No users found
              </h3>
              <p className='text-gray-500'>
                Try adjusting your search or filter criteria.
              </p>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className='bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200'
                >
                  <div className='p-6'>
                    <div className='flex items-start justify-between mb-4'>
                      <div className='flex items-center space-x-3'>
                        <div className='w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center'>
                          <span className='text-white text-sm font-medium'>
                            {user.username.charAt(0).toUpperCase() ?? ''}
                          </span>
                        </div>
                        <div>
                          <h3 className='text-lg font-semibold text-gray-900'>
                            {user.username}
                          </h3>
                          <p className='text-sm text-gray-500'>
                            {user.isActive}
                          </p>
                        </div>
                      </div>
                      <button className='p-1 hover:bg-gray-100 rounded'>
                        <MoreVertical className='h-4 w-4 text-gray-400' />
                      </button>
                    </div>

                    <div className='space-y-3'>
                      <div className='flex items-center space-x-2 text-sm text-gray-600'>
                        <Mail className='h-4 w-4' />
                        <span>{user.email}</span>
                      </div>
                      <div className='flex items-center space-x-2 text-sm text-gray-600'>
                        <Phone className='h-4 w-4' />
                        <span>{user.phone}</span>
                      </div>
                    </div>

                    <div className='flex items-center justify-between mt-4 pt-4 border-t border-gray-100'>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          user.isActive
                        )}`}
                      >
                        {user.isActive === true ? 'Active' : 'Inactive'}
                      </span>

                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(
                          user.role
                        )}`}
                      >
                        {user.role.charAt(0).toUpperCase() +
                          user.role.slice(1).toLowerCase()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default Users
