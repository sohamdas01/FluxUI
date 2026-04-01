import React from 'react'
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';


const ProjectHeader = () => {
  return (
    <div className='flex items-center justify-between p-3 '>
                <div className='flex gap-1 items-center'>
                <Image src='/logo.png' alt='logo' width={40} height={40}/>
                <h2 className='text-xl text-primary font-bold'>FluxUI</h2>
                </div>
                <Button><Save/>Save</Button>
    </div>
  )
}

export default ProjectHeader