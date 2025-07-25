'use client'

import { useEffect, useState } from 'react'
import {
  Tag,
  Percent,
  CheckCircle,
  AlertCircle,
  Loader2,
  PlusCircle,
  Edit3,
  Trash2,
  Calendar,
  TrendingUp,
  Gift,
  Search,
  Filter,
} from 'lucide-react'
import {
  DialogHeader,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'

import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from '@/components/ui/table'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
// Using shadcn/ui components (available in Claude artifacts)

type Promo = {
  isActive: boolean
  id: number
  code: string
  discount: number
  createdAt?: string
}

export default function Discount() {
  const [code, setCode] = useState('')
  const [discount, setDiscount] = useState<number | ''>('')
  const [message, setMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [open, setOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [promos, setPromos] = useState<Promo[]>([])
  const [editPromo, setEditPromo] = useState<Promo | null>(null)
  const [editCode, setEditCode] = useState('')
  const [editDiscount, setEditDiscount] = useState<number | ''>('')
  const [editMessage, setEditMessage] = useState<string | null>(null)
  const [isEditLoading, setIsEditLoading] = useState(false)
  const [isEditSuccess, setIsEditSuccess] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [isLoadingPromos, setIsLoadingPromos] = useState(true)

  // Fetch all promo codes
  const fetchPromos = async () => {
    setIsLoadingPromos(true)
    try {
      const res = await fetch('/api/admin/discount')
      const data = await res.json()
      setPromos(data)
    } catch (err) {
      console.error('Failed to fetch promos', err)
    } finally {
      setIsLoadingPromos(false)
    }
  }

  useEffect(() => {
    fetchPromos()
  }, [])

  // POST DISCOUNT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    setIsLoading(true)
    setIsSuccess(false)

    try {
      const res = await fetch('/api/admin/discount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, discount: Number(discount), isActive }),
      })

      const data = await res.json()

      if (!res.ok) {
        setMessage(data.error || 'Failed to create promo code')
        setIsSuccess(false)
      } else {
        setMessage(`Promo "${data.code}" created successfully!`)
        setIsSuccess(true)
        setCode('')
        setDiscount('')
        fetchPromos()
        setTimeout(() => setOpen(false), 1500)
      }
    } catch (error) {
      setMessage('Network error. Please try again.')
      setIsSuccess(false)
    } finally {
      setIsLoading(false)
      setOpen(false)
    }
  }

  // EDIT DISCOUNT
  const handleEdit = (promo: Promo) => {
    setEditPromo(promo)
    setEditCode(promo.code)
    setEditDiscount(promo.discount)
    setEditMessage(null)
    setIsActive(promo.isActive) // ✅ SET THIS
    setIsEditSuccess(false)
    setEditOpen(true)
  }

  // UPDATE DISCOUNT
  const handleUpdateSubmit = async () => {
    if (!editPromo) return

    setEditMessage(null)
    setIsEditLoading(true)
    setIsEditSuccess(false)

    try {
      const res = await fetch(`/api/admin/discount/${editPromo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: editCode,
          discount: Number(editDiscount),
          isActive, // ✅ include this
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setEditMessage(data.error || 'Failed to update promo code')
        setIsEditSuccess(false)
      } else {
        setEditMessage(`Promo "${data.code}" updated successfully!`)
        setIsEditSuccess(true)
        fetchPromos()
        setTimeout(() => {
          setEditOpen(false)
          setEditPromo(null)
        }, 1500)
      }
    } catch (error) {
      setEditMessage('Network error. Please try again.')
      setIsEditSuccess(false)
    } finally {
      setIsEditLoading(false)
      setEditOpen(false)
    }
  }

  const handleEditCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/\s/g, '')
    setEditCode(value)
  }

  // DELETE DISCOUNT
  const handleDelete = async (id: number) => {
    const confirmed = confirm('Are you sure you want to delete this promo?')
    if (!confirmed) return

    try {
      const res = await fetch(`/api/admin/discount/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        const { error } = await res.json()
        throw new Error(error || 'Failed to delete promo')
      }

      setPromos((prev) => prev.filter((promo) => promo.id !== id))
    } catch (error) {
      console.error('Delete failed:', error)
      alert('Failed to delete promo.')
    }
  }

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/\s/g, '')
    setCode(value)
  }

  // Filter promos based on search
  const filteredPromos = promos.filter((promo) =>
    promo.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Calculate stats
  const totalPromos = promos.length
  const avgDiscount =
    promos.length > 0
      ? Math.round(
          promos.reduce((sum, p) => sum + p.discount, 0) / promos.length
        )
      : 0

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6'>
      <div className='max-w-7xl mx-auto space-y-8'>
        {/* Header Section */}
        <div className='bg-white rounded-2xl shadow-xl border border-gray-100 p-8'>
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900 flex items-center gap-3'>
                <div className='p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl'>
                  <Gift className='text-white' size={28} />
                </div>
                Discount Management
              </h1>
              <p className='text-gray-600 mt-2'>
                Create and manage promotional discount codes
              </p>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <button className='inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105'>
                  <PlusCircle size={20} />
                  Create New Promo
                </button>
              </DialogTrigger>

              <DialogContent className='max-w-lg'>
                <DialogHeader>
                  <DialogTitle className='text-2xl font-bold flex items-center gap-2'>
                    <Tag className='text-green-600' size={24} />
                    Create Promo Code
                  </DialogTitle>
                </DialogHeader>

                <div className='space-y-6'>
                  {/* Code Input */}
                  <div>
                    <label
                      htmlFor='code'
                      className='block text-sm font-semibold text-gray-700 mb-2'
                    >
                      Promo Code
                    </label>
                    <div className='relative'>
                      <input
                        id='code'
                        type='text'
                        value={code}
                        onChange={handleCodeChange}
                        placeholder='Enter code (e.g., SAVE20)'
                        className='w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 placeholder-gray-400'
                        required
                        maxLength={20}
                      />
                      <Tag
                        className='absolute left-4 top-3.5 text-gray-400'
                        size={18}
                      />
                    </div>
                    <p className='text-xs text-gray-500 mt-1'>
                      Auto-converted to uppercase, spaces removed
                    </p>
                  </div>

                  {/* Discount Input */}
                  <div>
                    <label
                      htmlFor='discount'
                      className='block text-sm font-semibold text-gray-700 mb-2'
                    >
                      Discount Percentage
                    </label>
                    <div className='relative'>
                      <input
                        id='discount'
                        type='number'
                        value={discount}
                        onChange={(e) =>
                          setDiscount(
                            e.target.value === '' ? '' : Number(e.target.value)
                          )
                        }
                        placeholder='Enter discount percentage'
                        className='w-full px-4 py-3 pl-12 pr-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 placeholder-gray-400'
                        required
                        min={1}
                        max={100}
                      />
                      <Percent
                        className='absolute left-4 top-3.5 text-gray-400'
                        size={18}
                      />
                      <span className='absolute right-4 top-3.5 text-gray-400 text-sm'>
                        %
                      </span>
                    </div>
                    <div className='flex justify-between text-xs text-gray-500 mt-1'>
                      <span>Min: 1%</span>
                      <span>Max: 100%</span>
                    </div>
                  </div>

                  {/* Active Status Toggle */}
                  <div className='flex items-center gap-3'>
                    <input
                      id='isActive'
                      type='checkbox'
                      checked={isActive}
                      onChange={() => setIsActive(!isActive)}
                      className='w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500'
                    />
                    <label
                      htmlFor='isActive'
                      className='text-sm text-gray-700 font-medium'
                    >
                      Mark promo as{' '}
                      <span className='font-semibold'>
                        {isActive ? 'Active' : 'Inactive'}
                      </span>
                    </label>
                  </div>

                  {/* Preview */}
                  {code && discount && (
                    <div className='bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4'>
                      <h4 className='font-semibold text-green-800 mb-3 flex items-center gap-2'>
                        <CheckCircle size={16} />
                        Preview
                      </h4>
                      <div className='bg-white rounded-lg p-4 border border-green-200'>
                        <p className='font-mono text-xl font-bold text-green-700'>
                          {code}
                        </p>
                        <p className='text-green-600 text-sm mt-1'>
                          {discount}% discount applied
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading || !code || !discount}
                    className='w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl'
                  >
                    {isLoading ? (
                      <span className='flex items-center justify-center gap-2'>
                        <Loader2 className='animate-spin' size={18} />
                        Creating Promo...
                      </span>
                    ) : (
                      <span className='flex items-center justify-center gap-2'>
                        <Tag size={18} />
                        Create Promo Code
                      </span>
                    )}
                  </button>

                  {/* Message Feedback */}
                  {message && (
                    <div
                      className={`p-4 rounded-xl border-2 ${
                        isSuccess
                          ? 'bg-green-50 border-green-200 text-green-800'
                          : 'bg-red-50 border-red-200 text-red-800'
                      }`}
                    >
                      <div className='flex items-center gap-2'>
                        {isSuccess ? (
                          <CheckCircle
                            className='text-green-600 flex-shrink-0'
                            size={20}
                          />
                        ) : (
                          <AlertCircle
                            className='text-red-600 flex-shrink-0'
                            size={20}
                          />
                        )}
                        <p className='text-sm font-medium'>{message}</p>
                      </div>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogContent className='max-w-lg'>
                <DialogHeader>
                  <DialogTitle className='text-2xl font-bold flex items-center gap-2'>
                    <Edit3 className='text-blue-600' size={24} />
                    Edit Promo Code
                  </DialogTitle>
                </DialogHeader>

                <div className='space-y-6'>
                  {/* Edit Code Input */}
                  <div>
                    <label
                      htmlFor='editCode'
                      className='block text-sm font-semibold text-gray-700 mb-2'
                    >
                      Promo Code
                    </label>
                    <div className='relative'>
                      <input
                        id='editCode'
                        type='text'
                        value={editCode}
                        onChange={handleEditCodeChange}
                        placeholder='Enter code (e.g., SAVE20)'
                        className='w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400'
                        required
                        maxLength={20}
                      />
                      <Tag
                        className='absolute left-4 top-3.5 text-gray-400'
                        size={18}
                      />
                    </div>
                    <p className='text-xs text-gray-500 mt-1'>
                      Auto-converted to uppercase, spaces removed
                    </p>
                  </div>

                  {/* Edit Discount Input */}
                  <div>
                    <label
                      htmlFor='editDiscount'
                      className='block text-sm font-semibold text-gray-700 mb-2'
                    >
                      Discount Percentage
                    </label>
                    <div className='relative'>
                      <input
                        id='editDiscount'
                        type='number'
                        value={editDiscount}
                        onChange={(e) =>
                          setEditDiscount(
                            e.target.value === '' ? '' : Number(e.target.value)
                          )
                        }
                        placeholder='Enter discount percentage'
                        className='w-full px-4 py-3 pl-12 pr-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400'
                        required
                        min={1}
                        max={100}
                      />
                      <Percent
                        className='absolute left-4 top-3.5 text-gray-400'
                        size={18}
                      />
                      <span className='absolute right-4 top-3.5 text-gray-400 text-sm'>
                        %
                      </span>
                    </div>
                    <div className='flex justify-between text-xs text-gray-500 mt-1'>
                      <span>Min: 1%</span>
                      <span>Max: 100%</span>
                    </div>
                  </div>

                  <div className='flex items-center gap-3'>
                    <input
                      id='isActive'
                      type='checkbox'
                      checked={isActive}
                      onChange={() => setIsActive(!isActive)}
                      className='w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500'
                    />
                    <label
                      htmlFor='isActive'
                      className='text-sm text-gray-700 font-medium'
                    >
                      Mark promo as{' '}
                      <span className='font-semibold'>
                        {isActive ? 'Active' : 'Inactive'}
                      </span>
                    </label>
                  </div>

                  {/* Edit Preview */}
                  {editCode && editDiscount && (
                    <div className='bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4'>
                      <h4 className='font-semibold text-blue-800 mb-3 flex items-center gap-2'>
                        <CheckCircle size={16} />
                        Updated Preview
                      </h4>
                      <div className='bg-white rounded-lg p-4 border border-blue-200'>
                        <p className='font-mono text-xl font-bold text-blue-700'>
                          {editCode}
                        </p>
                        <p className='text-blue-600 text-sm mt-1'>
                          {editDiscount}% discount applied
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Update Button */}
                  <div className='flex gap-3'>
                    <button
                      onClick={() => setEditOpen(false)}
                      className='flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200'
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdateSubmit}
                      disabled={isEditLoading || !editCode || !editDiscount}
                      className='flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl'
                    >
                      {isEditLoading ? (
                        <span className='flex items-center justify-center gap-2'>
                          <Loader2 className='animate-spin' size={18} />
                          Updating...
                        </span>
                      ) : (
                        <span className='flex items-center justify-center gap-2'>
                          <CheckCircle size={18} />
                          Update Promo
                        </span>
                      )}
                    </button>
                  </div>

                  {/* Edit Message Feedback */}
                  {editMessage && (
                    <div
                      className={`p-4 rounded-xl border-2 ${
                        isEditSuccess
                          ? 'bg-green-50 border-green-200 text-green-800'
                          : 'bg-red-50 border-red-200 text-red-800'
                      }`}
                    >
                      <div className='flex items-center gap-2'>
                        {isEditSuccess ? (
                          <CheckCircle
                            className='text-green-600 flex-shrink-0'
                            size={20}
                          />
                        ) : (
                          <AlertCircle
                            className='text-red-600 flex-shrink-0'
                            size={20}
                          />
                        )}
                        <p className='text-sm font-medium'>{editMessage}</p>
                      </div>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 border border-blue-200'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-blue-600 text-sm font-medium'>
                    Total Promos
                  </p>
                  <p className='text-2xl font-bold text-blue-800'>
                    {totalPromos}
                  </p>
                </div>
                <div className='p-3 bg-blue-500 rounded-lg'>
                  <Tag className='text-white' size={20} />
                </div>
              </div>
            </div>

            <div className='bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-6 border border-green-200'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-green-600 text-sm font-medium'>
                    Avg Discount
                  </p>
                  <p className='text-2xl font-bold text-green-800'>
                    {avgDiscount}%
                  </p>
                </div>
                <div className='p-3 bg-green-500 rounded-lg'>
                  <TrendingUp className='text-white' size={20} />
                </div>
              </div>
            </div>

            <div className='bg-gradient-to-br from-purple-50 to-pink-100 rounded-xl p-6 border border-purple-200'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-purple-600 text-sm font-medium'>
                    Active Codes
                  </p>
                  <p className='text-2xl font-bold text-purple-800'>
                    {totalPromos}
                  </p>
                </div>
                <div className='p-3 bg-purple-500 rounded-lg'>
                  <Gift className='text-white' size={20} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Promo Table Section */}
        <div className='bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden'>
          <div className='p-6 border-b border-gray-100'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-xl font-bold text-gray-900'>
                Existing Promo Codes
              </h2>
              <div className='flex items-center gap-3'>
                <div className='relative'>
                  <Search
                    className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                    size={16}
                  />
                  <input
                    type='text'
                    placeholder='Search promo codes...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  />
                </div>
              </div>
            </div>
          </div>

          {isLoadingPromos ? (
            <div className='flex items-center justify-center py-12'>
              <Loader2 className='animate-spin text-gray-400' size={32} />
              <span className='ml-3 text-gray-600'>Loading promo codes...</span>
            </div>
          ) : filteredPromos.length === 0 ? (
            <div className='text-center py-12'>
              {promos.length === 0 ? (
                <div>
                  <Gift className='mx-auto text-gray-300 mb-4' size={48} />
                  <p className='text-gray-500 text-lg'>
                    No promo codes created yet
                  </p>
                  <p className='text-gray-400 text-sm'>
                    Create your first promo code to get started
                  </p>
                </div>
              ) : (
                <div>
                  <Search className='mx-auto text-gray-300 mb-4' size={48} />
                  <p className='text-gray-500 text-lg'>
                    No promos match your search
                  </p>
                  <p className='text-gray-400 text-sm'>
                    Try adjusting your search terms
                  </p>
                </div>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader className='bg-gray-50'>
                <TableRow className='hover:bg-transparent'>
                  <TableHead className='font-semibold text-gray-700'>
                    Code
                  </TableHead>
                  <TableHead className='font-semibold text-gray-700'>
                    Discount
                  </TableHead>
                  <TableHead className='font-semibold text-gray-700'>
                    Created
                  </TableHead>
                  <TableHead className='font-semibold text-gray-700'>
                    Status
                  </TableHead>
                  <TableHead className='font-semibold text-gray-700'>
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPromos.map((promo, index) => (
                  <TableRow
                    key={promo.id}
                    className='hover:bg-gray-50 transition-colors'
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <TableCell>
                      <div className='flex items-center gap-3'>
                        <div className='p-2 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg'>
                          <Tag className='text-blue-600' size={16} />
                        </div>
                        <span className='font-mono font-bold text-gray-800'>
                          {promo.code}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className='inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium'>
                        {promo.discount}%
                        <Percent size={12} />
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-2 text-gray-600'>
                        <Calendar size={14} />
                        <span className='text-sm'>
                          {promo.createdAt
                            ? new Date(promo.createdAt).toLocaleDateString(
                                'en-US',
                                {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                }
                              )
                            : '—'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <Badge
                          className={
                            promo.isActive ? 'bg-green-600' : 'bg-gray-400'
                          }
                        >
                          {promo.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex gap-2'>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => handleEdit(promo)}
                          className='hover:bg-blue-50 hover:text-blue-600 transition-colors'
                        >
                          <Edit3 size={14} />
                          Edit
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => handleDelete(promo.id)}
                          className='hover:bg-red-50 hover:text-red-600 transition-colors'
                        >
                          <Trash2 size={14} />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  )
}
