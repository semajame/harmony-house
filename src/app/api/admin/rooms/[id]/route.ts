import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { params } = context
  const id = parseInt(params.id, 10)

  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid room ID' }, { status: 400 })
  }

  // your logic here, e.g. fetching room data from DB
  return NextResponse.json({ message: `Room ID is ${id}` })
}
