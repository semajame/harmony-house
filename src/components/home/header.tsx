'use client'

import Image from 'next/image'
import { Button } from '../ui/button'
import Link from 'next/link'
import { useState } from 'react'

import { ChevronDown, Menu, X } from 'lucide-react'

import AuthButtons from '../forms-buttons/auth-buttons'

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className='bg-[#944EA8] px-5 py-3 text-white fixed z-50 top-0 w-full'>
      <div className='flex justify-between items-center'>
        {/* Logo + Title */}
        <Link href='/' className='flex items-center gap-2'>
          <Image
            src='/images/harmony-house-logo.png'
            alt='Logo Image'
            width={50}
            height={50}
          />
          <span className='text-lg font-semibold font-serif italic'>
            Harmony House
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className='hidden md:flex items-center gap-10'>
          <ul className='flex gap-4 items-center'>
            <li>
              <Link href='/' className='hover:underline px-2'>
                Home
              </Link>
            </li>
            <li>
              <Link href='#rooms' className='hover:underline px-2'>
                Rooms
              </Link>
            </li>
            <li>
              <Link href='#menu' className='hover:underline px-2'>
                Menu
              </Link>
            </li>
            <li>
              <Link href='#contact' className='hover:underline px-2'>
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        {/* Desktop Buttons */}
        <div className='hidden md:flex gap-2'>
          <AuthButtons />
        </div>

        {/* Mobile Hamburger */}
        <div className='md:hidden'>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className='md:hidden mt-4 space-y-4 text-center'>
          <Link href='/' className='block'>
            Home
          </Link>
          <Link href='/' className='block'>
            Rooms
          </Link>
          <Link href='/' className='block'>
            Menu
          </Link>
          <Link href='/' className='block'>
            Contact
          </Link>

          <div className='flex justify-center gap-2 mt-4'>
            <Link href='/login'>
              <Button className='bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 '>
                Login
              </Button>
            </Link>
            <Link href='/signup'>
              <Button className='bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 '>
                Register
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
