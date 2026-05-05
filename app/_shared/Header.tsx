
"use client"
import React from 'react'
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { SignInButton, useUser } from '@clerk/nextjs';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';

const Header = () => {
  const { user } = useUser();
  return (
    <div className='flex items-center justify-between py-4'>
      <div className='flex gap-1 items-center'>
        <Link href="/" className="flex gap-1 items-center">
          <Image src="/logo.png" alt="logo" width={40} height={40} />
          <h2 className="text-xl text-primary font-bold">FluxUI</h2>
        </Link>
      </div>
      <ul className='flex gap-3 items-center font-semibold text-gray-600'>
        <li className='hover:text-primary cursor-pointer'>
          <Link href='/'>Home</Link>
        </li>
        {user && (
          <li className='hover:text-primary cursor-pointer'>
            {/*  Projects link - only show when logged in */}
            <Link href='/projects'>Projects</Link>
          </li>
        )}
        <Link href='/pricing'>
        <li className='hover:text-primary cursor-pointer'>Pricing</li>
        </Link>
      </ul>
      {!user ?
        <SignInButton mode='modal'>
          <Button>Get Started</Button>
        </SignInButton>
        : <UserButton />}
    </div>
  )
}

export default Header