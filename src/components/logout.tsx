import { signOut } from 'next-auth/react'

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut()}
      className='bg-black text-white border cursor-pointer p-2 rounded mt-5 text-sm'
    >
      Logout
    </button>
  )
}
