"use client"
import React, { useState } from 'react'
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Loader2, Save } from 'lucide-react';
import { useContext } from 'react';
import { SettingContext } from '@/context/SettingContext';
import axios from 'axios';
import { toast } from 'sonner';

const ProjectHeader = () => {
  const{settingDetails,setSettingDetails}=useContext(SettingContext);
  const [loading,setLoading]=useState(false);
  const onSave=async ()=>{
    if (!settingDetails?.projectId) {
    toast.error("No project ID found. Cannot save.");
    return;
  }
    
    try{
    setLoading(true);
    const result=await axios.put('/api/project',{
      projectId:settingDetails?.projectId,
      projectName:settingDetails?.projectName,
      theme:settingDetails?.theme
    })
    setLoading(false);
    console.log(result.data);
   toast.success('Project details saved successfully!');
  }catch(e){
     setLoading(false);
     toast.error('Failed to save project details. Please try again.');
     console.error(e);
  }
  }
  return (
    <div className='flex items-center justify-between p-3 '>
                <div className='flex gap-1 items-center'>
                <Image src='/logo.png' alt='logo' width={40} height={40}/>
                <h2 className='text-xl text-primary font-bold'>FluxUI</h2>
                </div>
                <Button  onClick={onSave} disabled={loading}>{loading?<Loader2 className='animate-spin'/> :<Save />} Save</Button>
    </div>
  )
}

export default ProjectHeader