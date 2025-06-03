'use client'
import { useState, useEffect } from 'react'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Save,
  X,
  Filter,
  ChefHat,
  Clock,
  DollarSign,
  Star,
  Eye,
  EyeOff,
} from 'lucide-react'

type Food = {
  id: number
  name: string
  price: number
  description: string
  available: boolean
}

const foods = () => {
  const [foods, setFoods] = useState<Food[]>([])

  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [showModal, setShowModal] = useState(false)

  const [editingFood, setEditingFood] = useState<Food | null>(null)
  const [formData, setFormData] = useState<
    Omit<Food, 'id' | 'price'> & { price: string }
  >({
    name: '',
    price: '',
    description: '',
    available: false,
  })

  //^ FETCH FOOD
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await fetch('/api/admin/products') // adjust if the route is different
        const data = await res.json()

        const formattedData: Food[] = data.map((product: any) => ({
          id: product.id,
          name: product.name,
          category: 'Food', // or product.category if you have this
          price: parseFloat(product.price),
          description: product.description,
          image: '', // or use a default icon or product.image if exists
          available: product.is_active, // assuming this comes from backend
        }))

        setFoods(formattedData)
      } catch (error) {
        console.error('Failed to fetch products:', error)
      }
    }

    fetchFoods()
  }, [])

  //^ FOODS
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault() // prevent page reload

    try {
      const response = await fetch('/api/admin/products', {
        method: editingFood ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          is_active: formData.available,
        }),
      })

      if (!response.ok) throw new Error('Failed to save food')

      const savedFood = await response.json()

      // Update UI
      if (editingFood) {
        setFoods((prev) =>
          prev.map((item) =>
            item.id === editingFood.id
              ? { ...savedFood, available: savedFood.is_active }
              : item
          )
        )
      } else {
        setFoods((prev) => [
          ...prev,
          { ...savedFood, available: savedFood.is_active },
        ])
      }

      // Reset and close
      resetForm()
      closeModal()
    } catch (err) {
      console.error('Submission error:', err)
    }
  }

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this food item?')) {
      setFoods(foods.filter((food) => food.id !== id))
    }
  }

  const categories = ['Food', 'Drinks']

  const filteredFoods = foods.filter((food: any) => {
    const matchesSearch =
      food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      food.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory =
      filterCategory === 'all' || food.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      description: '',
      available: true,
    })
    setEditingFood(null)
  }

  const openModal = (food?: Food) => {
    if (food) {
      setFormData({ ...food, price: food.price.toString() })
      setEditingFood(food)
    } else {
      resetForm()
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    resetForm()
  }

  const toggleAvailability = (id: number) => {
    setFoods(
      foods.map((food) =>
        food.id === id ? { ...food, available: !food.available } : food
      )
    )
  }

  return (
    <div className='h-full bg-gray-100 p-6'>
      {/* Filters */}
      <div className='bg-white rounded-lg shadow p-6 mb-6'>
        <div className='flex flex-col md:flex-row gap-4 items-start md:items-center justify-between'>
          <div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center'>
            {/* Search */}
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
              <input
                type='text'
                placeholder='Search foods...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent w-full sm:w-64'
              />
            </div>

            <div className='relative'>
              <button
                onClick={() => openModal()}
                className='bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors cursor-pointer'
              >
                <Plus className='h-5 w-5' />
                <span>Add Food</span>
              </button>
            </div>

            {/* Category Filter */}
            <div className='relative'>
              <Filter className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className='pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white cursor-pointer'
              >
                <option value='all'>All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className='text-sm text-gray-600'>
            {filteredFoods.length} of {foods.length} items
          </div>
        </div>
      </div>

      {/* Food Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
        {filteredFoods.map((food) => (
          <div
            key={food.id}
            className='bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200'
          >
            <div className='p-6'>
              {/* Food Header */}
              <div className='flex items-start justify-between mb-4'>
                <div className='flex items-center space-x-3'>
                  <div className='flex-1'>
                    <h3 className='text-md font-semibold text-gray-900'>
                      {food.name}
                    </h3>
                  </div>
                </div>
                <div className='flex space-x-1'>
                  <button
                    onClick={() => toggleAvailability(food.id)}
                    className={`p-1 rounded hover:bg-gray-100 ${
                      food.available ? 'text-green-600' : 'text-gray-400'
                    }`}
                    title={food.available ? 'Available' : 'Unavailable'}
                  >
                    {food.available ? (
                      <Eye className='h-4 w-4' />
                    ) : (
                      <EyeOff className='h-4 w-4' />
                    )}
                  </button>
                  <button
                    onClick={() => openModal(food)}
                    className='p-1 hover:bg-gray-100 rounded text-blue-600'
                    title='Edit'
                  >
                    <Edit className='h-4 w-4' />
                  </button>
                  <button
                    onClick={() => handleDelete(food.id)}
                    className='p-1 hover:bg-gray-100 rounded text-red-600'
                    title='Delete'
                  >
                    <Trash2 className='h-4 w-4' />
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className='text-gray-600 text-sm mb-4 line-clamp-2'>
                {food.description}
              </p>

              {/* Details */}
              <div className='space-y-2 mb-4'>
                <div className='flex items-center justify-between text-sm'>
                  <span className='flex items-center text-gray-600'>
                    <DollarSign className='h-4 w-4 mr-1' />
                    Price
                  </span>
                  <span className='font-semibold text-green-600'>
                    ${food.price}
                  </span>
                </div>
              </div>

              {/* Status */}
              <div className='mt-3 pt-3 border-t'>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    food.available
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {food.available ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredFoods.length === 0 && (
        <div className='text-center py-12'>
          <ChefHat className='h-12 w-12 text-gray-400 mx-auto mb-4' />
          <h3 className='text-lg font-medium text-gray-900 mb-2'>
            No food items found
          </h3>
          <p className='text-gray-500'>
            Try adjusting your search or add a new food item.
          </p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
          <div className='bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
            <div className='p-6'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-2xl font-bold text-gray-900'>
                  {editingFood ? 'Edit Food Item' : 'Add New Food Item'}
                </h2>
                <button
                  onClick={closeModal}
                  className='p-2 hover:bg-gray-100 rounded-lg'
                >
                  <X className='h-5 w-5' />
                </button>
              </div>

              <form onSubmit={handleSubmit} className='space-y-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Food Name *
                    </label>
                    <input
                      type='text'
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                      placeholder='Enter food name'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Price ($) *
                    </label>
                    <input
                      type='number'
                      step='0.01'
                      required
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                      placeholder='0.00'
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor='description'
                    className='block text-sm font-medium text-gray-700 mb-1'
                  >
                    Description *
                  </label>
                  <textarea
                    id='description'
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                    placeholder='Describe the food item'
                  />
                </div>

                <div className='flex items-center'>
                  <input
                    type='checkbox'
                    id='available'
                    checked={formData.available}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        available: e.target.checked,
                      })
                    }
                    className='h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded'
                  />
                  <label
                    htmlFor='available'
                    className='ml-2 block text-sm text-gray-900'
                  >
                    Available for order
                  </label>
                </div>

                <div className='flex justify-end space-x-3 pt-4'>
                  <button
                    type='submit'
                    className='px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center space-x-2 cursor-pointer'
                  >
                    <Save className='h-4 w-4' />
                    <span>{editingFood ? 'Update' : 'Add'} Food</span>
                  </button>
                  <button
                    type='button'
                    onClick={() => {
                      resetForm()
                      closeModal()
                    }}
                    className='px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50'
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default foods
