'use client'

import Image from 'next/image'
import { Button } from './ui/button'
import Link from 'next/link'
import { useState } from 'react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { ChevronDown, Menu, X } from 'lucide-react'

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className='bg-[#944EA8] px-5 py-3 text-white'>
      <div className='flex justify-between items-center'>
        {/* Logo + Title */}
        <a href='/' className='flex items-center gap-2'>
          <Image
            src='/images/harmony-house-logo.png'
            alt='Logo Image'
            width={50}
            height={50}
          />
          <span className='text-lg font-semibold'>Harmony House</span>
        </a>

        {/* Desktop Nav */}
        <nav className='hidden md:flex items-center gap-10'>
          <ul className='flex gap-4 items-center'>
            <li>
              <a href='' className='hover:underline'>
                Home
              </a>
            </li>
            <li>
              <a href='' className='hover:underline'>
                Contact Us
              </a>
            </li>
            <li>
              <DropdownMenu>
                <DropdownMenuTrigger className='cursor-pointer flex items-center gap-1'>
                  Menu <ChevronDown />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Rooms</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Foods</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Drinks</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          </ul>
        </nav>

        {/* Desktop Buttons */}
        <div className='hidden md:flex gap-2'>
          <Link href='/login'>
            <Button>Login</Button>
          </Link>
          <Link href='/signup'>
            <Button>Register</Button>
          </Link>
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
          <a href='' className='block'>
            Home
          </a>
          <a href='' className='block'>
            Contact Us
          </a>
          <div>
            <p className='font-semibold'>Menu</p>
            <ul className='space-y-1'>
              <li>Rooms</li>
              <li>Foods</li>
              <li>Drinks</li>
            </ul>
          </div>
          <div className='flex justify-center gap-2 mt-4'>
            <Link href='/login'>
              <Button className='w-24'>Login</Button>
            </Link>
            <Link href='/signup'>
              <Button className='w-24'>Register</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
