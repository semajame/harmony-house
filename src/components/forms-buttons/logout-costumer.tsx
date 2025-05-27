import { signOut } from 'next-auth/react'

export default function LogoutCustomer() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/login' })}
      className='text-white bg-black rounded-sm py-2 px-4 cursor-pointer'
    >
      Logout
    </button>
  )
}
