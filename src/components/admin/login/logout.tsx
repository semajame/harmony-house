import { signOut } from 'next-auth/react'

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/admin/login' })}
      className='text-red-400 py-2 px-4 cursor-pointer'
    >
      Logout
    </button>
  )
}
