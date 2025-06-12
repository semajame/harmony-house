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
  Plus,
  X,
  Eye,
  EyeOff,
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

interface CreateUserData {
  username: string
  name: string
  email: string
  password: string
  phone: string
  role: string
}

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [filterActive, setFilterActive] = useState<
    'all' | 'active' | 'inactive'
  >('all')

  const [users, setUsers] = useState<UserType[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const [formData, setFormData] = useState<CreateUserData>({
    username: '',
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'customer',
  })

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/admin/users')
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
      case 'customer':
        return 'text-blue-600 bg-blue-100'
      case 'staff':
        return 'text-pink-600 bg-pink-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreating(true)

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to create user')
      }

      const newUser = await response.json()

      // Add the new user to the users list
      setUsers((prev) => [...prev, newUser])

      // Reset form and close modal
      setFormData({
        username: '',
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'customer',
      })
      setIsModalOpen(false)

      console.log('User created successfully:', newUser)
    } catch (error) {
      console.error('Error creating user:', error)
      // You might want to show an error message to the user here
    } finally {
      setIsCreating(false)
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setFormData({
      username: '',
      name: '',
      email: '',
      password: '',
      phone: '',
      role: 'customer',
    })
    setShowPassword(false)
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

              <div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className='bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200 cursor-pointer'
                >
                  <Plus className='h-4 w-4' />
                  Create User
                </button>
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
                  <option value='customer' className='cursor-pointer'>
                    Customer
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

      {/* Create User Modal */}
      {isModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto'>
            <div className='flex items-center justify-between p-6 border-b border-gray-200'>
              <h2 className='text-xl font-semibold text-gray-900'>
                Create New User
              </h2>
              <button
                onClick={closeModal}
                className='p-1 hover:bg-gray-100 rounded-full cursor-pointer'
              >
                <X className='h-5 w-5 text-gray-400' />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className='p-6 space-y-4 '>
              {/* Username */}
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label
                    htmlFor='username'
                    className='block text-sm font-medium text-gray-700 mb-1'
                  >
                    Username *
                  </label>
                  <input
                    type='text'
                    id='username'
                    name='username'
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    placeholder='Enter username'
                  />
                </div>
                {/* Name */}
                <div>
                  <label
                    htmlFor='name'
                    className='block text-sm font-medium text-gray-700 mb-1'
                  >
                    Full Name *
                  </label>
                  <input
                    type='text'
                    id='name'
                    name='name'
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    placeholder='Enter full name'
                  />
                </div>
                {/* Email */}
                <div>
                  <label
                    htmlFor='email'
                    className='block text-sm font-medium text-gray-700 mb-1'
                  >
                    Email
                  </label>
                  <input
                    type='email'
                    id='email'
                    name='email'
                    value={formData.email}
                    onChange={handleInputChange}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    placeholder='Enter email address'
                  />
                </div>
                {/* Password */}
                <div>
                  <label
                    htmlFor='password'
                    className='block text-sm font-medium text-gray-700 mb-1'
                  >
                    Password *
                  </label>
                  <div className='relative'>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id='password'
                      name='password'
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className='w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                      placeholder='Enter password'
                    />
                    <button
                      type='button'
                      onClick={() => setShowPassword(!showPassword)}
                      className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
                    >
                      {showPassword ? (
                        <EyeOff className='h-4 w-4' />
                      ) : (
                        <Eye className='h-4 w-4' />
                      )}
                    </button>
                  </div>
                </div>
                {/* Phone */}
                <div>
                  <label
                    htmlFor='phone'
                    className='block text-sm font-medium text-gray-700 mb-1'
                  >
                    Phone
                  </label>
                  <input
                    type='tel'
                    id='phone'
                    name='phone'
                    value={formData.phone}
                    onChange={handleInputChange}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    placeholder='123-456-7890'
                  />
                </div>
                {/* Role */}
                <div>
                  <label
                    htmlFor='role'
                    className='block text-sm font-medium text-gray-700 mb-1'
                  >
                    Role
                  </label>
                  <select
                    id='role'
                    name='role'
                    value={formData.role}
                    onChange={handleInputChange}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'
                  >
                    <option value='customer' className='cursor-pointer'>
                      Customer
                    </option>
                    <option value='staff' className='cursor-pointer'>
                      Staff
                    </option>
                    <option value='admin' className='cursor-pointer'>
                      Admin
                    </option>
                  </select>
                </div>
              </div>

              {/* Form Actions */}
              <div className='flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 w-full'>
                <button
                  type='button'
                  onClick={closeModal}
                  className='px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 cursor-pointer'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={isCreating}
                  className='px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors duration-200 cursor-pointer'
                >
                  {isCreating ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Users
