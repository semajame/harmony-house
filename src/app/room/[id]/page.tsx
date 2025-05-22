'use client'

import { useParams } from 'next/navigation'

export default function RoomPage() {
  const params = useParams()
  return <div>Room ID: {params.id}</div>
}
