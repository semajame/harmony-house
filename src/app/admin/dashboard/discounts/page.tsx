"use client"

import { useEffect, useState } from "react"
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
} from "lucide-react"
import {
  DialogHeader,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type Promo = {
  isActive: boolean
  id: number
  code: string
  discount: number
  usageLimit: number
  expiresAt?: string
  createdAt?: string
}

export default function Discount() {
  const [code, setCode] = useState("")
  const [discount, setDiscount] = useState<number | "">("")
  const [usageLimit, setUsageLimit] = useState<number | "">(1)
  const [expiresAt, setExpiresAt] = useState<string>("")
  const [message, setMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [open, setOpen] = useState(false)

  const [editOpen, setEditOpen] = useState(false)
  const [editPromo, setEditPromo] = useState<Promo | null>(null)
  const [editCode, setEditCode] = useState("")
  const [editDiscount, setEditDiscount] = useState<number | "">("")
  const [editUsageLimit, setEditUsageLimit] = useState<number | "">(1)
  const [editExpiresAt, setEditExpiresAt] = useState<string>("")
  const [editMessage, setEditMessage] = useState<string | null>(null)
  const [isEditLoading, setIsEditLoading] = useState(false)
  const [isEditSuccess, setIsEditSuccess] = useState(false)

  const [isActive, setIsActive] = useState(true)
  const [promos, setPromos] = useState<Promo[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoadingPromos, setIsLoadingPromos] = useState(true)

  // Fetch all promo codes
  const fetchPromos = async () => {
    setIsLoadingPromos(true)
    try {
      const res = await fetch("/api/admin/discount")
      const data = await res.json()
      setPromos(data)
    } catch (err) {
      console.error("Failed to fetch promos", err)
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
      const res = await fetch("/api/admin/discount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          discount: Number(discount),
          isActive,
          usageLimit: Number(usageLimit),
          expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setMessage(data.error || "Failed to create promo code")
        setIsSuccess(false)
      } else {
        setMessage(`Promo "${data.code}" created successfully!`)
        setIsSuccess(true)
        setCode("")
        setDiscount("")
        setUsageLimit(1)
        setExpiresAt("")
        fetchPromos()
        setTimeout(() => setOpen(false), 1500)
      }
    } catch (error) {
      setMessage("Network error. Please try again.")
      setIsSuccess(false)
    } finally {
      setIsLoading(false)
    }
  }

  // EDIT DISCOUNT
  const handleEdit = (promo: Promo) => {
    setEditPromo(promo)
    setEditCode(promo.code)
    setEditDiscount(promo.discount)
    setEditUsageLimit(promo.usageLimit)
    setEditExpiresAt(promo.expiresAt ? promo.expiresAt.slice(0, 16) : "")
    setIsActive(promo.isActive)
    setEditMessage(null)
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
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: editCode,
          discount: Number(editDiscount),
          isActive,
          usageLimit: Number(editUsageLimit),
          expiresAt: editExpiresAt
            ? new Date(editExpiresAt).toISOString()
            : null,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setEditMessage(data.error || "Failed to update promo code")
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
      setEditMessage("Network error. Please try again.")
      setIsEditSuccess(false)
    } finally {
      setIsEditLoading(false)
    }
  }

  const handleEditCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditCode(e.target.value.toUpperCase().replace(/\s/g, ""))
  }

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value.toUpperCase().replace(/\s/g, ""))
  }

  // DELETE DISCOUNT
  const handleDelete = async (id: number) => {
    const confirmed = confirm("Are you sure you want to delete this promo?")
    if (!confirmed) return

    try {
      const res = await fetch(`/api/admin/discount/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        const { error } = await res.json()
        throw new Error(error || "Failed to delete promo")
      }

      setPromos((prev) => prev.filter((promo) => promo.id !== id))
    } catch (error) {
      console.error("Delete failed:", error)
      alert("Failed to delete promo.")
    }
  }

  const filteredPromos = promos.filter((promo) =>
    promo.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPromos = promos.filter((promo) => promo.isActive).length
  const avgDiscount =
    promos.length > 0
      ? Math.round(
          promos.reduce((sum, p) => sum + p.discount, 0) / promos.length
        )
      : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header & Create Dialog */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                  <Gift className="text-white" size={28} />
                </div>
                Discount Management
              </h1>
              <p className="text-gray-600 mt-2">
                Create and manage promotional discount codes
              </p>
            </div>

            {/* Create Promo Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <button className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl shadow-lg">
                  <PlusCircle size={20} /> Create New Promo
                </button>
              </DialogTrigger>

              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                    <Tag className="text-green-600" size={24} /> Create Promo
                    Code
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                  {/* Code Input */}
                  <div>
                    <label
                      htmlFor="code"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Promo Code
                    </label>
                    <input
                      id="code"
                      type="text"
                      value={code}
                      onChange={handleCodeChange}
                      placeholder="Enter code (e.g., SAVE20)"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl"
                      required
                      maxLength={20}
                    />
                  </div>

                  {/* Discount Input */}
                  <div>
                    <label
                      htmlFor="discount"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Discount Percentage
                    </label>
                    <input
                      id="discount"
                      type="number"
                      value={discount}
                      onChange={(e) =>
                        setDiscount(
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                      placeholder="Enter discount percentage"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl"
                      required
                      min={1}
                      max={100}
                    />
                  </div>

                  {/* Usage Limit */}
                  <div>
                    <label
                      htmlFor="usageLimit"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Usage Limit
                    </label>
                    <input
                      id="usageLimit"
                      type="number"
                      value={usageLimit}
                      onChange={(e) => setUsageLimit(Number(e.target.value))}
                      placeholder="How many times this code can be used"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl"
                      min={1}
                    />
                  </div>

                  {/* Expiration Date */}
                  <div>
                    <label
                      htmlFor="expiresAt"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Expiration Date
                    </label>
                    <input
                      id="expiresAt"
                      type="datetime-local"
                      value={expiresAt}
                      onChange={(e) => setExpiresAt(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl"
                    />
                  </div>

                  {/* Active Toggle */}
                  <div className="flex items-center gap-3">
                    <input
                      id="isActive"
                      type="checkbox"
                      checked={isActive}
                      onChange={() => setIsActive(!isActive)}
                      className="w-5 h-5 text-green-600 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="isActive"
                      className="text-sm text-gray-700 font-medium"
                    >
                      Mark promo as{" "}
                      <span className="font-semibold">
                        {isActive ? "Active" : "Inactive"}
                      </span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading || !code || !discount}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-4 px-6 rounded-xl disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="animate-spin" size={18} /> Creating
                        Promo...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Tag size={18} /> Create Promo Code
                      </span>
                    )}
                  </button>

                  {/* Message Feedback */}
                  {message && (
                    <div
                      className={`p-4 rounded-xl border-2 ${
                        isSuccess
                          ? "bg-green-50 border-green-200 text-green-800"
                          : "bg-red-50 border-red-200 text-red-800"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isSuccess ? (
                          <CheckCircle className="text-green-600" size={20} />
                        ) : (
                          <AlertCircle className="text-red-600" size={20} />
                        )}
                        <p className="text-sm font-medium">{message}</p>
                      </div>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 border border-blue-200">
              <p className="text-blue-600 text-sm font-medium">Total Promos</p>
              <p className="text-2xl font-bold text-blue-800">{totalPromos}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-6 border border-green-200">
              <p className="text-green-600 text-sm font-medium">Avg Discount</p>
              <p className="text-2xl font-bold text-green-800">
                {avgDiscount}%
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-xl p-6 border border-purple-200">
              <p className="text-purple-600 text-sm font-medium">
                Active Codes
              </p>
              <p className="text-2xl font-bold text-purple-800">
                {totalPromos}
              </p>
            </div>
          </div>
        </div>

        {/* Promo Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Existing Promo Codes
            </h2>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search promo codes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
              />
            </div>
          </div>

          {isLoadingPromos ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-gray-400" size={32} />
              <span className="ml-3 text-gray-600">Loading promo codes...</span>
            </div>
          ) : filteredPromos.length === 0 ? (
            <div className="text-center py-12">No promo codes found.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Usage Limit</TableHead>
                  <TableHead>Expires At</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPromos.map((promo) => (
                  <TableRow key={promo.id}>
                    <TableCell>{promo.code}</TableCell>
                    <TableCell>{promo.discount}%</TableCell>
                    <TableCell>{promo.usageLimit}</TableCell>
                    <TableCell>
                      {promo.expiresAt
                        ? new Date(promo.expiresAt).toLocaleString()
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          promo.isActive ? "bg-green-600" : "bg-gray-400"
                        }
                      >
                        {promo.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(promo)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(promo.id)}
                        >
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
