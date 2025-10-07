"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Pencil, Trash, Plus } from "lucide-react"

interface Room {
  id?: number
  name: string
  description: string
  capacity: number | ""
  price: number | ""
  image: string
  isActive: boolean
}

export default function ManageRooms() {
  const [rooms, setRooms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingRoom, setEditingRoom] = useState<any | null>(null)
  const [form, setForm] = useState({
    name: "",
    description: "",
    capacity: "",
    price: "",
    image: "", // default image
    isActive: true,
  })

  // Fetch rooms
  const fetchRooms = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/admin/rooms")
      const data = await res.json()
      setRooms(data)
    } catch (err) {
      console.error("Failed to fetch rooms", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRooms()
  }, [])

  // Handle form submit (Add / Update)
  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        capacity: 5,
        image: form.image || "",
      }

      let res
      if (editingRoom && editingRoom.id) {
        res = await fetch(`/api/admin/rooms/${editingRoom.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      } else {
        res = await fetch("/api/admin/rooms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        console.error("API Error:", res.status, err)
        return
      }

      await fetchRooms()
      setDialogOpen(false)
      setForm({
        name: "",
        description: "",
        capacity: "",
        price: "",
        image: "",
        isActive: true,
      })
      setEditingRoom(null)
    } catch (err) {
      console.error("Failed to save room", err)
    }
  }

  // Handle Edit
  const handleEdit = (room: any) => {
    setEditingRoom(room)
    setForm(room)
    setDialogOpen(true)
  }

  // Handle Delete
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this room?")) return

    try {
      await fetch(`/api/admin/rooms/${id}`, {
        method: "DELETE",
      })
      await fetchRooms()
    } catch (err) {
      console.error("Failed to delete room", err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-t-transparent border-primary"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Rooms</h2>
        <Button
          onClick={() => {
            setEditingRoom(null)
            setForm({
              name: "",
              description: "",
              capacity: "",
              price: "",
              image: "/images/rooms/room-2.jpg",
              isActive: true,
            })
            setDialogOpen(true)
          }}
        >
          <Plus className="w-4 h-4 mr-2" /> Add Room
        </Button>
      </div>

      {/* Rooms Table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full text-sm bg-white">
          <thead className="bg-white">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-left">Capacity</th>
              <th className="px-4 py-2 text-left">Price</th>
              {/* <th className="px-4 py-2 text-left">Image</th> */}
              <th className="px-4 py-2 text-left">Status</th>

              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id} className="border-t">
                <td className="px-4 py-2">{room.name}</td>
                <td className="px-4 py-2">{room.description}</td>
                <td className="px-4 py-2">{room.capacity}</td>
                <td className="px-4 py-2">₱{room.price}</td>
                <td className="px-4 py-2">
                  {room.isActive ? (
                    <span className="text-green-600 font-semibold">Active</span>
                  ) : (
                    <span className="text-gray-500 font-semibold">
                      Inactive
                    </span>
                  )}
                </td>

                <td className="px-4 py-2 text-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(room)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(room.id)}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingRoom ? "Edit Room" : "Add Room"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="Room Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
            <Input
              type="number"
              placeholder="Capacity"
              value={5}
              disabled
              onChange={(e) => setForm({ ...form, capacity: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />

            {/* Active/Inactive Toggle */}
            <div className="flex items-center gap-3">
              <input
                id="isActive"
                type="checkbox"
                checked={form.isActive || false}
                onChange={() => setForm({ ...form, isActive: !form.isActive })}
                className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <label
                htmlFor="isActive"
                className="text-sm text-gray-700 font-medium"
              >
                Mark room as{" "}
                <span className="font-semibold">
                  {form.isActive ? "Active" : "Inactive"}
                </span>
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDialogOpen(false)
                setEditingRoom(null)
                setForm({
                  name: "",
                  description: "",
                  capacity: "",
                  price: "",
                  image: "",
                  isActive: true, // default active
                })
              }}
            >
              Cancel
            </Button>

            <Button onClick={handleSubmit}>
              {editingRoom ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
