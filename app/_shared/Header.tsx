"use client"
import React from 'react'
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { SignInButton, useUser } from '@clerk/nextjs';
import { UserButton } from '@clerk/nextjs';

const Header = () => {
  const {user}=useUser();// useUser hook from clerk to get the user information
  return (
    <div className='flex items-center justify-between py-4'> 
        <div className='flex gap-1 items-center'>
        <Image src='/logo.png' alt='logo' width={40} height={40}/>
        <h2 className='text-xl text-primary font-bold'>FluxUI</h2>
        </div>
        <ul className='flex gap-3 items-center font-semibold text-gray-600'>
            <li className='hover:text-primary cursor-pointer'>Home</li>
            <li className='hover:text-primary cursor-pointer'>Pricing</li>
        </ul>
        {!user? 
        <SignInButton mode='modal'>
          <Button >Get Started</Button> 
        </SignInButton>
        : <UserButton/>}
    </div>
  )
}

export default Header